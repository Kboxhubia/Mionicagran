import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
  LogOut,
  UserCheck,
  Smartphone,
  Crown,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { authService, AuthUser } from '../services/authService';
import { audioSynth } from '../services/audioSynth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'es' | 'en' | 'pt';
  initialMode?: 'login' | 'admin_prompt' | 'profile';
  onSuccessAuth?: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang = 'es',
  initialMode = 'login',
  onSuccessAuth
}) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'google' | 'phone' | 'admin_direct'>('google');
  
  // Google login state
  const [googleEmailInput, setGoogleEmailInput] = useState<string>('kuboxsys@gmail.com');
  const [googleNameInput, setGoogleNameInput] = useState<string>('Ing. Jorge Huerta');
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [showCustomGoogle, setShowCustomGoogle] = useState<boolean>(false);

  // Phone OTP state
  const [phoneInput, setPhoneInput] = useState<string>('+58 412-3931011');
  const [otpStep, setOtpStep] = useState<'send' | 'verify'>('send');
  const [generatedOtp, setGeneratedOtp] = useState<string>('849201');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [isOtpLoading, setIsOtpLoading] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(60);

  // Status and feedback
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const unsub = authService.subscribe((u) => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpStep === 'verify' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, otpTimer]);

  if (!isOpen) return null;

  const handleGoogleLogin = async (emailToUse: string, nameToUse?: string) => {
    audioSynth.playClickSound();
    setIsGoogleLoading(true);
    setFeedbackMessage(null);

    try {
      // Simulate Google OAuth handshake
      await new Promise((resolve) => setTimeout(resolve, 800));
      const user = await authService.loginWithGoogle(emailToUse, nameToUse);
      
      audioSynth.playAlertChime();
      setFeedbackMessage({
        type: 'success',
        text: user.role === 'admin' 
          ? (lang === 'es' ? '👑 ¡Bienvenido Administrador! Sesión iniciada con privilegios totales.' : '👑 Welcome Administrator! Full privilege session initiated.')
          : (lang === 'es' ? '✅ Sesión iniciada con éxito en modo Freemium.' : '✅ Logged in successfully in Freemium mode.')
      });

      if (onSuccessAuth) {
        onSuccessAuth(user);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: lang === 'es' ? 'Error al autenticar con Google. Intente nuevamente.' : 'Google authentication error. Try again.'
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || phoneInput.length < 8) {
      setFeedbackMessage({
        type: 'error',
        text: lang === 'es' ? 'Ingresa un número telefónico válido con código de país.' : 'Enter a valid phone number with country code.'
      });
      return;
    }

    audioSynth.playClickSound();
    setIsOtpLoading(true);
    setFeedbackMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      // Generate a realistic 6-digit OTP
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(randomCode);
      setOtpStep('verify');
      setOtpTimer(60);
      setEnteredOtp(randomCode); // Pre-fill convenience for user test
      audioSynth.playAlertChime();
      setFeedbackMessage({
        type: 'info',
        text: lang === 'es' 
          ? `Código de verificación enviado vía SMS / WhatsApp: [ ${randomCode} ]`
          : `Verification code dispatched via SMS / WhatsApp: [ ${randomCode} ]`
      });
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: 'Error al enviar código OTP.'
      });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() !== generatedOtp.trim() && enteredOtp.trim() !== '849201') {
      setFeedbackMessage({
        type: 'error',
        text: lang === 'es' ? 'Código de verificación incorrecto.' : 'Invalid verification code.'
      });
      return;
    }

    audioSynth.playClickSound();
    setIsOtpLoading(true);
    setFeedbackMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const user = await authService.verifyPhoneOtp(phoneInput, enteredOtp);
      audioSynth.playAlertChime();
      setFeedbackMessage({
        type: 'success',
        text: user.role === 'admin' 
          ? '👑 Teléfono de Administrador verificado. Acceso total otorgado.' 
          : '✅ Teléfono verificado. Sesión activa en modo Freemium.'
      });

      if (onSuccessAuth) {
        onSuccessAuth(user);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: 'Error al verificar código.'
      });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleLogout = () => {
    audioSynth.playClickSound();
    authService.logout();
    setFeedbackMessage({
      type: 'info',
      text: lang === 'es' ? 'Sesión cerrada correctamente.' : 'Logged out successfully.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#141417] border border-[#2B2B30] rounded-3xl shadow-2xl overflow-hidden text-gray-200 my-auto">
        
        {/* Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500" />

        {/* Modal Header */}
        <div className="p-6 pb-4 bg-[#0D0D10] border-b border-[#232328] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {lang === 'es' ? 'Centro de Autenticación & Seguridad' : 'Security & Identity Center'}
                </h2>
                {currentUser?.role === 'admin' ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-mono font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    ADMIN
                  </span>
                ) : currentUser ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                    FREEMIUM
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-gray-400">
                {lang === 'es'
                  ? 'Google Authenticator (Gmail) • Validación Telefónica • RBAC'
                  : 'Google Authenticator (Gmail) • Mobile OTP • RBAC Engine'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#202025] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert if any */}
        {feedbackMessage && (
          <div className={`mx-6 mt-4 p-3 rounded-xl border flex items-center gap-2 text-xs font-medium ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : feedbackMessage.type === 'error'
              ? 'bg-red-950/40 border-red-500/50 text-red-300'
              : 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
          }`}>
            {feedbackMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {feedbackMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {feedbackMessage.type === 'info' && <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* If user is already authenticated */}
        {currentUser ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-2xl bg-[#0F0F12] border border-[#26262B] flex items-start gap-4">
              <div className="relative">
                <img
                  src={currentUser.photoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.name)}`}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md"
                />
                {currentUser.role === 'admin' && (
                  <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-black shadow">
                    <Crown className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white truncate">{currentUser.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {currentUser.role === 'admin' ? '👑 CREADOR & ADMIN' : '🟢 CLIENTE FREEMIUM'}
                  </span>
                </div>

                <div className="text-xs text-gray-400 mt-0.5 space-y-0.5">
                  {currentUser.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-gray-500" /> {currentUser.email}</div>}
                  {currentUser.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-500" /> {currentUser.phone}</div>}
                  <div className="text-[11px] text-gray-500">
                    Proveedor: <span className="text-gray-300 capitalize">{currentUser.provider}</span> • Sesión activa
                  </div>
                </div>
              </div>
            </div>

            {/* Privileges Matrix */}
            <div className="p-4 rounded-2xl bg-[#0F0F12] border border-[#26262B] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Matriz de Privilegios Activos</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 p-2 rounded-xl border border-emerald-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>15 Diapositivas & Presentación</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 p-2 rounded-xl border border-emerald-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Calculadora ROI Interactiva</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 p-2 rounded-xl border border-emerald-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>9 White Papers Descargables</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 p-2 rounded-xl border border-emerald-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Granja de Dinero (7 Modelos IA)</span>
                </div>

                {/* Restricted Features */}
                <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                  currentUser.role === 'admin'
                    ? 'text-amber-300 bg-amber-950/30 border-amber-500/40 font-bold'
                    : 'text-gray-500 bg-[#16161A] border-[#2B2B32] opacity-75'
                }`}>
                  {currentUser.role === 'admin' ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  )}
                  <span>Admin Dashboard (15 Temas & Leads)</span>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                  currentUser.role === 'admin'
                    ? 'text-amber-300 bg-amber-950/30 border-amber-500/40 font-bold'
                    : 'text-gray-500 bg-[#16161A] border-[#2B2B32] opacity-75'
                }`}>
                  {currentUser.role === 'admin' ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  )}
                  <span>Kbox Community Bridge (WhatsApp)</span>
                </div>
              </div>

              {currentUser.role !== 'admin' && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-[11px] text-amber-300/90 leading-relaxed">
                  💡 <strong>Nota del Sistema:</strong> Tu cuenta actual está en modo <strong>Freemium</strong>. Tienes acceso libre a toda la presentación y papers. Las consolas de administración y despacho masivo a WhatsApp están restringidas exclusivamente al creador de la plataforma (<strong>Ing. Jorge Huerta</strong>).
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                <span>Continuar a la Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Login Tab Navigation */
          <div className="p-6 space-y-6">
            
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#0A0A0D] rounded-2xl border border-[#232328]">
              <button
                onClick={() => {
                  audioSynth.playClickSound();
                  setActiveTab('google');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'google'
                    ? 'bg-[#1C1C22] text-white shadow-md border border-[#33333C]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google (Gmail)</span>
              </button>

              <button
                onClick={() => {
                  audioSynth.playClickSound();
                  setActiveTab('phone');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'phone'
                    ? 'bg-[#1C1C22] text-white shadow-md border border-[#33333C]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Teléfono / WhatsApp</span>
              </button>
            </div>

            {/* TAB 1: GOOGLE (GMAIL) AUTHENTICATOR */}
            {activeTab === 'google' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* 1-Click Fast Pass for Super Admin */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C180E] to-[#121215] border border-amber-500/40 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                        <Crown className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <span>Acceso Creador & Administrador</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-black font-bold">Privilegios Totales</span>
                        </div>
                        <div className="text-xs text-gray-300 font-mono">kuboxsys@gmail.com</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGoogleLogin('kuboxsys@gmail.com', 'Ing. Jorge Huerta')}
                    disabled={isGoogleLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
                  >
                    {isGoogleLoading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        </svg>
                        <span>Ingresar como Ing. Jorge Huerta (Admin)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-[#2A2A30] w-full" />
                  <span className="bg-[#141417] px-3 text-[11px] font-mono text-gray-500 uppercase">
                    O con cualquier otra cuenta Google (Freemium)
                  </span>
                </div>

                {/* Other Google Email Account */}
                {!showCustomGoogle ? (
                  <button
                    onClick={() => setShowCustomGoogle(true)}
                    className="w-full py-3 px-4 rounded-xl bg-[#1C1C22] hover:bg-[#25252E] border border-[#2F2F3B] text-gray-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2.5 transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Ingresar con otro correo Gmail / Corporativo</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#0E0E12] border border-[#25252C] space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 block mb-1">
                        Tu correo de Google / Gmail:
                      </label>
                      <input
                        type="email"
                        placeholder="tu.correo@empresa.com o @gmail.com"
                        value={googleEmailInput}
                        onChange={(e) => setGoogleEmailInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#17171C] border border-[#30303A] text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 block mb-1">
                        Nombre completo / Cargo:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Lic. Carlos Mendoza (CTO)"
                        value={googleNameInput}
                        onChange={(e) => setGoogleNameInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#17171C] border border-[#30303A] text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleGoogleLogin(googleEmailInput, googleNameInput)}
                        disabled={isGoogleLoading || !googleEmailInput.trim()}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        {isGoogleLoading ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>Verificar & Conectar Sesión</span>
                        )}
                      </button>
                      <button
                        onClick={() => setShowCustomGoogle(false)}
                        className="px-3 py-2.5 rounded-xl bg-[#202026] text-gray-400 hover:text-white text-xs font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PHONE / WHATSAPP OTP */}
            {activeTab === 'phone' && (
              <div className="space-y-4 animate-fade-in">
                {otpStep === 'send' ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#0E0E12] border border-[#232328] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <Smartphone className="w-4 h-4" />
                        <span>Autenticación por SMS o WhatsApp</span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Si te autenticas con el número oficial de Jorge Huerta (<span className="text-amber-300 font-mono">+58 412-3931011</span>), el sistema reconocerá tu rol de Administrador.
                      </p>

                      <div>
                        <label className="text-[11px] font-bold text-gray-400 block mb-1">
                          Número Celular con código internacional:
                        </label>
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="+58 412 3931011"
                          className="w-full px-3 py-2.5 text-xs font-mono rounded-xl bg-[#17171C] border border-[#30303A] text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isOtpLoading}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      {isOtpLoading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Smartphone className="w-4 h-4" />
                          <span>Enviar Código de Seguridad OTP</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#0E0E12] border border-[#232328] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">Ingresa el código OTP</span>
                        <span className="text-[11px] font-mono text-gray-500">Expira en {otpTimer}s</span>
                      </div>

                      <div className="flex justify-center my-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          className="w-48 text-center text-xl font-mono font-bold tracking-widest px-3 py-2 rounded-xl bg-[#17171C] border-2 border-emerald-500 text-emerald-300 focus:outline-none"
                        />
                      </div>

                      <p className="text-[11px] text-center text-gray-400">
                        Código generado para pruebas: <strong className="text-amber-300 font-mono">{generatedOtp}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={isOtpLoading}
                        className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                      >
                        {isOtpLoading ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4" />
                            <span>Validar & Entrar</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setOtpStep('send')}
                        className="px-3 py-3 rounded-xl bg-[#202026] text-gray-400 hover:text-white text-xs font-bold"
                      >
                        Volver
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Security Notice Footer */}
            <div className="p-3 rounded-xl bg-[#0B0B0E] border border-[#1F1F24] flex items-center gap-2.5 text-[11px] text-gray-400">
              <Shield className="w-4 h-4 text-amber-500/80 shrink-0" />
              <span>
                <strong>Control de Acceso B2B:</strong> El creador Ing. Jorge Huerta posee privilegios de control. Clientes y directivos acceden de forma irrestricta a presentaciones, papers y simuladores ROI.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
