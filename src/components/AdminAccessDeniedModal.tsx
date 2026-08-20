import React from 'react';
import {
  X,
  Lock,
  Crown,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

interface AdminAccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal: () => void;
  lang?: 'es' | 'en' | 'pt';
  targetFeatureName?: string;
}

export const AdminAccessDeniedModal: React.FC<AdminAccessDeniedModalProps> = ({
  isOpen,
  onClose,
  onOpenAuthModal,
  lang = 'es',
  targetFeatureName = 'Admin Dashboard & Community Bridge'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#141417] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-gray-200 my-auto">
        
        {/* Glowing Gold Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-500 animate-pulse" />

        {/* Modal Header */}
        <div className="p-6 pb-4 bg-[#0E0E11] border-b border-[#24242A] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-lg shadow-amber-950/50">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {lang === 'es' ? 'Acceso Exclusivo de Administrador' : 'Administrator Exclusive Access'}
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-mono font-bold inline-flex items-center gap-1 mt-1">
                <Crown className="w-3 h-3" />
                {lang === 'es' ? 'RESTRINGIDO A CREADOR' : 'RESTRICTED TO CREATOR'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#202025] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          
          <div className="p-4 rounded-2xl bg-[#0B0B0E] border border-[#232328] space-y-2">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>{targetFeatureName}</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {lang === 'es'
                ? 'Las consolas de administración, publicación de temas, base de datos de leads y el puente de despacho automatizado a WhatsApp están reservados estrictamente para el Ing. Jorge Huerta (Creador y Arquitecto del sistema).'
                : 'Administration consoles, topic publishing, leads databases, and the automated WhatsApp broadcast bridge are strictly reserved for Eng. Jorge Huerta (Platform Creator).'}
            </p>
          </div>

          {/* Freemium Privileges Available */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {lang === 'es' ? 'Funciones disponibles para ti en modo Freemium:' : 'Features available to you in Freemium mode:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 p-2 rounded-xl border border-emerald-800/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>15 Diapositivas C-Level</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 p-2 rounded-xl border border-emerald-800/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Calculadora ROI Interactiva</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 p-2 rounded-xl border border-emerald-800/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Papers Hub & Descarga PDF</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 p-2 rounded-xl border border-emerald-800/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Granja de Dinero (7 Modelos)</span>
              </div>
            </div>
          </div>

          {/* Admin Credentials Help */}
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200/90 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <Crown className="w-3.5 h-3.5" />
              <span>¿Eres el Ing. Jorge Huerta?</span>
            </div>
            <div className="text-[11px] text-gray-300">
              Inicia sesión con tu cuenta de Google (<span className="font-mono text-amber-300">kuboxsys@gmail.com</span>) o valida tu número celular (<span className="font-mono text-emerald-300">+58 412-3931011</span>) para desbloquear todos los privilegios.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1C1C22] hover:bg-[#25252E] text-gray-300 hover:text-white text-xs font-bold transition-all"
            >
              Continuar en Freemium
            </button>

            <button
              onClick={() => {
                onClose();
                audioSynth.playClickSound();
                onOpenAuthModal();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <span>Autenticar como Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
