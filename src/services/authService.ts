export type UserRole = 'admin' | 'freemium' | 'guest';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  provider: 'google' | 'phone_otp' | 'direct_admin' | 'freemium_quick';
  role: UserRole;
  title?: string;
  company?: string;
  registeredAt: string;
  lastLoginAt: string;
  token?: string;
}

const STORAGE_AUTH_KEY = 'kbox_auth_session_user_v2';
const ADMIN_EMAILS = ['kuboxsys@gmail.com', 'admin@kboxhubia.ai', 'jorgehuerta@kboxhubia.ai'];
const ADMIN_PHONES = ['+584123931011', '+58 412-3931011', '04123931011', '4123931011', '584123931011'];

class AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: Array<(user: AuthUser | null) => void> = [];

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    try {
      const stored = localStorage.getItem(STORAGE_AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        // Re-validate role in case credentials match admin
        if (this.checkIsAdmin(parsed.email, parsed.phone)) {
          parsed.role = 'admin';
        }
        this.currentUser = parsed;
      }
    } catch (e) {
      console.warn('Auth session loading failed:', e);
      this.currentUser = null;
    }
  }

  private saveSession() {
    try {
      if (this.currentUser) {
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(STORAGE_AUTH_KEY);
      }
      this.notifyListeners();
    } catch (e) {
      console.warn('Auth session saving failed:', e);
    }
  }

  public subscribe(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public isAdmin(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role === 'admin' || this.checkIsAdmin(this.currentUser.email, this.currentUser.phone);
  }

  public checkIsAdmin(email?: string, phone?: string): boolean {
    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      if (ADMIN_EMAILS.some(ae => ae.toLowerCase() === cleanEmail)) {
        return true;
      }
    }
    if (phone) {
      const cleanPhone = phone.replace(/[\s\-()]/g, '');
      if (ADMIN_PHONES.some(ap => ap.replace(/[\s\-()]/g, '') === cleanPhone)) {
        return true;
      }
    }
    return false;
  }

  // --- GOOGLE SIGN-IN ---
  public async loginWithGoogle(customEmail?: string, customName?: string): Promise<AuthUser> {
    const email = customEmail ? customEmail.trim().toLowerCase() : 'kuboxsys@gmail.com';
    const isAdminUser = this.checkIsAdmin(email, undefined);

    const name = customName || (isAdminUser ? 'Ing. Jorge Huerta' : email.split('@')[0]);
    const photoUrl = isAdminUser 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    const user: AuthUser = {
      id: `usr-google-${Date.now()}`,
      name: name,
      email: email,
      photoUrl: photoUrl,
      provider: 'google',
      role: isAdminUser ? 'admin' : 'freemium',
      title: isAdminUser ? 'Creador & Arquitecto Principal' : 'Ejecutivo / Miembro Freemium',
      company: isAdminUser ? 'Kboxhubia DeepTech' : 'Empresa Invitada',
      registeredAt: this.currentUser?.registeredAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      token: `g_jwt_${Math.random().toString(36).substring(2)}`
    };

    this.currentUser = user;
    this.saveSession();
    return user;
  }

  // --- PHONE / WHATSAPP OTP LOGIN ---
  public async verifyPhoneOtp(phone: string, code: string, customName?: string): Promise<AuthUser> {
    const cleanPhone = phone.trim();
    const isAdminUser = this.checkIsAdmin(undefined, cleanPhone);

    const name = customName || (isAdminUser ? 'Ing. Jorge Huerta' : 'Usuario Móvil');

    const user: AuthUser = {
      id: `usr-phone-${Date.now()}`,
      name: name,
      phone: cleanPhone,
      photoUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanPhone)}`,
      provider: 'phone_otp',
      role: isAdminUser ? 'admin' : 'freemium',
      title: isAdminUser ? 'Administrador & Creador' : 'Cliente Freemium',
      company: isAdminUser ? 'Kboxhubia' : 'Comunidad WhatsApp',
      registeredAt: this.currentUser?.registeredAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      token: `otp_token_${Math.random().toString(36).substring(2)}`
    };

    this.currentUser = user;
    this.saveSession();
    return user;
  }

  // --- QUICK FREEMIUM REGISTRATION ---
  public async registerFreemiumQuick(contact: string, role: string): Promise<AuthUser> {
    const isEmail = contact.includes('@');
    const email = isEmail ? contact.trim().toLowerCase() : undefined;
    const phone = !isEmail ? contact.trim() : undefined;

    const isAdminUser = this.checkIsAdmin(email, phone);

    const user: AuthUser = {
      id: `usr-free-${Date.now()}`,
      name: isAdminUser ? 'Ing. Jorge Huerta' : (email ? email.split('@')[0] : 'Usuario Freemium'),
      email: email,
      phone: phone,
      photoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(contact)}`,
      provider: 'freemium_quick',
      role: isAdminUser ? 'admin' : 'freemium',
      title: isAdminUser ? 'Administrador & Creador' : role,
      company: isAdminUser ? 'Kboxhubia' : 'Comunidad B2B',
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      token: `free_jwt_${Math.random().toString(36).substring(2)}`
    };

    this.currentUser = user;
    this.saveSession();
    return user;
  }

  // --- LOGOUT ---
  public logout() {
    this.currentUser = null;
    this.saveSession();
  }
}

export const authService = new AuthService();
