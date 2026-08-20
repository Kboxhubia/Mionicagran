import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Clock,
  Gift,
  Sparkles,
  MessageCircle,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Download,
  Flame,
  Bot
} from 'lucide-react';
import { ADMIN_PHONE_NUMBER, WHATSAPP_GROUP_NAME, WHATSAPP_DIRECT_LINK } from '../data/communityData';
import { agentEngine } from '../services/agentEngine';
import { audioSynth } from '../services/audioSynth';
import { exportExecutivePdfReport } from '../services/pdfExporter';

interface FreemiumRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUnlock: () => void;
  lang?: 'es' | 'en' | 'pt';
}

export const FreemiumRegistrationModal: React.FC<FreemiumRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccessUnlock,
  lang = 'es'
}) => {
  const [contactInput, setContactInput] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('CFO / Finanzas');
  const [countdown, setCountdown] = useState<number>(15);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 15 seconds countdown timer
  useEffect(() => {
    if (!isOpen || isRegistered) return;

    setCountdown(15);
    setIsLocked(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(true);
          audioSynth.playSlideTransitionSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isRegistered]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim() || contactInput.trim().length < 5) {
      setErrorMessage(
        lang === 'es'
          ? 'Por favor ingresa un correo electrónico o número celular válido.'
          : lang === 'en'
          ? 'Please provide a valid email or phone number.'
          : 'Por favor, insira um e-mail ou telefone válido.'
      );
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    audioSynth.playClickSound();

    try {
      // 1. Register in Agent Engine Lead Registry
      agentEngine.registerLead(contactInput.trim(), selectedRole, 'Modal Freemium 7s Avatar');

      // 2. Mark registered
      setIsRegistered(true);
      setIsLocked(false);
      onSuccessUnlock();

      // 3. Dispatch Gift PDF automatically
      try {
        await exportExecutivePdfReport();
      } catch (err) {
        console.warn('Auto PDF trigger fallback:', err);
      }
    } catch (err) {
      console.error('Error during registration:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#141417] border border-[#2B2B30] rounded-3xl shadow-2xl overflow-hidden text-gray-200 my-auto">
        
        {/* Top Glowing Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 animate-pulse" />

        {/* Modal Header with Avatars */}
        <div className="p-6 pb-4 bg-[#0D0D10] border-b border-[#232328]">
          <div className="flex items-start justify-between gap-4">
            
            {/* Avatars Header: DeepTech Lizard + Mionica Robot */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Avatar 1: DeepTech Lizard */}
              <div className="relative group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-950 via-[#0a2016] to-[#04120c] border-2 border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-950/60 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.3),transparent_70%)] animate-pulse" />
                  <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transform -rotate-6 group-hover:scale-110 transition-transform">
                    🦎
                  </span>
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0D0D10] animate-ping" />
                </div>
                <div className="text-center mt-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                    Kbox-Lizard
                  </span>
                  <span className="text-[8px] text-gray-500">DeepTech Core</span>
                </div>
              </div>

              {/* Linking Synaptic Line */}
              <div className="hidden sm:flex items-center text-amber-500/60 font-mono text-xs">
                ⚡
              </div>

              {/* Avatar 2: Friendly Mionica-Bot */}
              <div className="relative group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-950 via-[#0c2430] to-[#05141c] border-2 border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-950/60 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.3),transparent_70%)] animate-pulse" />
                  <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transform rotate-6 group-hover:scale-110 transition-transform">
                    🤖
                  </span>
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#0D0D10]" />
                </div>
                <div className="text-center mt-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                    Mionica-Bot
                  </span>
                  <span className="text-[8px] text-gray-500">Host Amigable</span>
                </div>
              </div>

              {/* Headline Title */}
              <div className="pl-1 sm:pl-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Freemium VIP • 1 Mes Gratis
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                  ¡Hola! Suscríbete para Acceso Completo
                </h3>
                <p className="text-xs text-gray-400">
                  Desbloquea simuladores, calculadoras y láminas ejecutivas
                </p>
              </div>

            </div>

            {/* Close Button (Enabled only after register or in normal mode) */}
            {isRegistered && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#232328] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">

          {!isRegistered ? (
            <>
              {/* Countdown Warning Bar */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                countdown <= 5
                  ? 'bg-rose-950/40 border-rose-600/50 text-rose-300 animate-pulse'
                  : 'bg-amber-950/30 border-amber-600/40 text-amber-300'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${countdown <= 5 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {countdown === 0 ? <Lock className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      {countdown === 0
                        ? 'Acceso Bloqueado Temporalmente'
                        : `El acceso a todas las funciones se bloqueará en ${countdown} segundos`}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Ingresa tu correo o teléfono celular para continuar explorando sin límites
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-mono font-extrabold tracking-wider">
                    00:{countdown < 10 ? `0${countdown}` : countdown}
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Role Selector */}
                  <div className="sm:col-span-1">
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                      Tu Rol / Sector
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-[#0D0D10] border border-[#2B2B30] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="CFO / Finanzas">CFO / Finanzas</option>
                      <option value="CTO / Tecnología">CTO / Tecnología</option>
                      <option value="CEO / Dirección">CEO / Dirección</option>
                      <option value="Telecom / ISP">Telecom / ISP</option>
                      <option value="Ingeniero / MLOps">Ingeniero / MLOps</option>
                      <option value="Inversionista">Inversionista</option>
                    </select>
                  </div>

                  {/* Email or Phone Input */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center justify-between">
                      <span>Correo Electrónico o Celular WhatsApp</span>
                      <span className="text-[10px] text-amber-400 font-normal">Acceso inmediato</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={contactInput}
                        onChange={(e) => setContactInput(e.target.value)}
                        placeholder="ejemplo@empresa.com o +58412..."
                        className="w-full bg-[#0D0D10] border border-[#2B2B30] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        autoFocus
                      />
                      <div className="absolute left-3 top-2.5 text-gray-400">
                        {contactInput.includes('@') ? (
                          <Mail className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Phone className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
                    {errorMessage}
                  </p>
                )}

                {/* Free Gifts & Promises */}
                <div className="p-3 bg-[#0D0D10] rounded-xl border border-[#232328] space-y-1.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <Gift className="w-4 h-4" />
                    <span>Regalos incluidos con tu suscripción gratuita:</span>
                  </div>
                  <ul className="text-[11px] space-y-1 text-gray-400 pl-6 list-disc">
                    <li>Descarga inmediata del <strong className="text-white">Dossier Ejecutivo en PDF</strong> con la memoria técnica y financiera.</li>
                    <li>Acceso al compendio de <strong className="text-white">15 Temas de Tendencia</strong> y la <strong className="text-white">Granja de Cultivo de Dinero con IA</strong>.</li>
                    <li>Soporte y canal directo con el <strong className="text-white">Ing. Jorge Huerta</strong>.</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-400 hover:to-emerald-400 text-black shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transform active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Desbloqueando y Generando Dossier...
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Suscribirme Gratis y Desbloquear Plataforma</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4 space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/60">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">
                  ¡Registro Exitoso! Plataforma 100% Desbloqueada
                </h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
                  Tu pase Freemium de 30 días está activo. Hemos iniciado la descarga de tu Dossier Ejecutivo en PDF.
                </p>
              </div>

              {/* WhatsApp Community VIP Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0b291b] to-[#04140c] border border-emerald-500/40 text-left space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">
                        Comunidad Oficial de WhatsApp
                      </span>
                      <span className="text-sm font-bold text-white">
                        {WHATSAPP_GROUP_NAME}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Admin: Ing. Jorge Huerta
                  </span>
                </div>

                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Únete a nuestro grupo exclusivo para debatir sobre infraestructura soberana, clusters de GPUs, reducción de churn en telecomunicaciones y nuevas oportunidades financieras con IA.
                </p>

                <div className="pt-1 flex flex-wrap gap-2">
                  <a
                    href={WHATSAPP_DIRECT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Unirme al Grupo de WhatsApp (+58 412-3931011)</span>
                  </a>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-[#1F1F24] hover:bg-[#2A2A30] text-white transition-colors"
              >
                Comenzar a Explorar la Plataforma
              </button>
            </div>
          )}

          {/* WhatsApp Direct Banner Footer */}
          {!isRegistered && (
            <div className="p-3 rounded-xl bg-[#0D0D10] border border-[#232328] flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-emerald-400 font-bold">WhatsApp Admin:</span>
                <span className="font-mono text-white">{ADMIN_PHONE_NUMBER}</span>
                <span className="text-gray-500 text-[11px] hidden sm:inline">(Ing. Jorge Huerta)</span>
              </div>
              <a
                href={WHATSAPP_DIRECT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Contactar Directo
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
