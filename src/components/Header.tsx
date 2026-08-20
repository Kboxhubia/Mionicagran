import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Calculator, 
  Bell, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Radio, 
  Sparkles, 
  Mic, 
  MicOff, 
  Globe, 
  Presentation, 
  Bot, 
  Flame, 
  Terminal, 
  Languages,
  ChevronDown,
  Building2,
  Cpu,
  Share2,
  MessageSquareText,
  DollarSign,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { AudioSettings, PredictiveAlert, Language } from '../types';
import { exportExecutivePdfReport } from '../services/pdfExporter';
import { exportPowerPointPresentation } from '../services/pptxExporter';
import { audioSynth } from '../services/audioSynth';
import { UI_TRANSLATIONS } from '../services/i18n';

interface HeaderProps {
  lang: Language;
  onSelectLang: (lang: Language) => void;
  audioSettings: AudioSettings;
  setAudioSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
  alerts: PredictiveAlert[];
  onOpenAlerts: () => void;
  onOpenCalculator: () => void;
  onOpenPortalModal: () => void;
  onOpenDossier: () => void;
  onOpenAiQna?: () => void;
  onOpenTrendRadar?: () => void;
  onOpenPythonSuite?: () => void;
  onOpenFeedback?: () => void;
  onOpenCommunity?: () => void;
  onOpenCommunityBridge?: () => void;
  onOpenAdmin?: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  currentSlideIndex: number;
  totalSlides: number;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onSelectLang,
  audioSettings,
  setAudioSettings,
  alerts,
  onOpenAlerts,
  onOpenCalculator,
  onOpenPortalModal,
  onOpenDossier,
  onOpenAiQna,
  onOpenTrendRadar,
  onOpenPythonSuite,
  onOpenFeedback,
  onOpenCommunity,
  onOpenCommunityBridge,
  onOpenAdmin,
  isFullscreen,
  onToggleFullscreen,
  currentSlideIndex,
  totalSlides
}) => {
  // Dropdown states for the 3 master blocks
  const [openDropdown, setOpenDropdown] = useState<'finance' | 'compute' | 'publish' | 'audio' | 'lang' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const t = UI_TRANSLATIONS[lang];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: 'finance' | 'compute' | 'publish' | 'audio' | 'lang') => {
    audioSynth.playClickSound();
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  const toggleMusic = () => {
    const isNowPlaying = audioSynth.togglePlay(audioSettings.theme);
    setAudioSettings(prev => ({
      ...prev,
      isPlaying: isNowPlaying,
      isMuted: !isNowPlaying
    }));
    audioSynth.playClickSound();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    audioSynth.setVolume(newVol);
    setAudioSettings(prev => ({ ...prev, volume: newVol }));
  };

  const handleThemeChange = (theme: 'executive' | 'cyber' | 'minimal' | 'pulse') => {
    audioSynth.setTheme(theme);
    setAudioSettings(prev => ({ ...prev, theme }));
    audioSynth.playClickSound();
  };

  const toggleVoiceNarration = () => {
    audioSynth.playClickSound();
    setAudioSettings(prev => ({
      ...prev,
      voiceNarrationEnabled: !prev.voiceNarrationEnabled
    }));
  };

  const handlePdfExport = async () => {
    setOpenDropdown(null);
    audioSynth.playClickSound();
    setIsExporting(true);
    try {
      await exportExecutivePdfReport();
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePptxExport = async () => {
    setOpenDropdown(null);
    audioSynth.playClickSound();
    setIsExportingPptx(true);
    try {
      await exportPowerPointPresentation(lang);
    } catch (err) {
      console.error('PPTX export error:', err);
    } finally {
      setIsExportingPptx(false);
    }
  };

  return (
    <header ref={headerRef} className="h-14 sm:h-16 px-3 sm:px-6 bg-[#0E0E10]/95 backdrop-blur-md border-b border-[#27272A] flex items-center justify-between z-30 sticky top-0">
      
      {/* Left: Author Brand & Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold font-mono text-sm shadow-md">
          JH
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">
              {t.author_name}
            </span>
            <span className="hidden xl:inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#27272A] text-amber-400 font-mono">
              Telecom & AI FinOps
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-normal truncate max-w-[140px] sm:max-w-[260px]">
            {t.author_sub}
          </span>
        </div>
      </div>

      {/* Center: THE 3 MASTER EXECUTIVE BLOCKS */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        
        {/* ======================================================== */}
        {/* BLOCK 1: FINANZAS & ESTRATEGIA (CFO / CEO) */}
        {/* ======================================================== */}
        <div className="relative">
          <button
            id="header-block-finance"
            onClick={() => toggleDropdown('finance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border transition-all shadow-sm ${
              openDropdown === 'finance'
                ? 'bg-amber-500 text-black border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-[#1A1A1C] hover:bg-[#27272A] text-gray-200 border-[#333335] hover:border-amber-500/50'
            }`}
          >
            <DollarSign className={`w-3.5 h-3.5 ${openDropdown === 'finance' ? 'text-black' : 'text-amber-400'}`} />
            <span className="tracking-tight">
              {lang === 'es' ? 'Finanzas & Estrategia' : lang === 'pt' ? 'Finanças & Estratégia' : 'Finance & Strategy'}
            </span>
            {alerts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'finance' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'finance' && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 bg-[#141416] border border-[#2B2B30] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-[#27272A] text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                <span>{lang === 'es' ? 'Herramientas de Capital & Retorno' : 'Capital & ROI Suite'}</span>
                <span className="text-gray-500">CFO • CEO</span>
              </div>

              {/* 1.1 Calculadora ROI */}
              <button
                onClick={() => {
                  setOpenDropdown(null);
                  audioSynth.playClickSound();
                  onOpenCalculator();
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-700/50 text-cyan-400 group-hover:scale-105 transition-transform">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{t.calculator_title}</span>
                    <span className="text-[9px] px-1 rounded bg-cyan-950 text-cyan-300 font-mono">3.4m ROI</span>
                  </div>
                  <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                    {lang === 'es' ? 'Simulador dinámico CAPEX vs OPEX y punto de equilibrio' : 'Dynamic CAPEX vs OPEX TCO break-even simulator'}
                  </div>
                </div>
              </button>

              {/* 1.2 Dossier Ejecutivo & Diagnóstico 48h */}
              <button
                onClick={() => {
                  setOpenDropdown(null);
                  audioSynth.playClickSound();
                  onOpenDossier();
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-700/50 text-amber-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{t.dossier_btn}</span>
                    <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300 font-mono">48h Delivery</span>
                  </div>
                  <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                    {lang === 'es' ? 'Memoria técnica de inversión y solicitud de auditoría' : 'Executive memorandum and 48-hour audit request'}
                  </div>
                </div>
              </button>

              {/* 1.3 Widgets Financieros Embebibles (KBOX HUB IA) */}
              <button
                onClick={() => {
                  setOpenDropdown(null);
                  audioSynth.playClickSound();
                  onOpenPortalModal();
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-700/50 text-purple-400 group-hover:scale-105 transition-transform">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Widgets Web (KBOX HUB IA)</span>
                    <span className="text-[9px] px-1 rounded bg-purple-950 text-purple-300 font-mono">Embed</span>
                  </div>
                  <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                    {lang === 'es' ? 'Snippets de calculadoras financieras para tu intranet' : 'Embeddable financial ROI widgets for corporate portals'}
                  </div>
                </div>
              </button>

              {/* 1.4 Alertas Predictivas de Mercado */}
              <button
                onClick={() => {
                  setOpenDropdown(null);
                  audioSynth.playClickSound();
                  onOpenAlerts();
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-700/50 text-rose-400 group-hover:scale-105 transition-transform relative">
                  <Bell className="w-4 h-4" />
                  {alerts.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{lang === 'es' ? 'Telemetría & Alertas de Mercado' : 'Market Telemetry & Alerts'}</span>
                    <span className="text-[9px] px-1 rounded bg-rose-950 text-rose-300 font-mono">{alerts.length} Live</span>
                  </div>
                  <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                    {lang === 'es' ? 'Precios de GPUs, inflación en nube y alertas de riesgo' : 'GPU spot prices, cloud API inflation & risk telemetry'}
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* BLOCK 2: CÓMPUTO & MLOPS (CTO / INGENIERÍA) */}
        {/* ======================================================== */}
        <div className="relative">
          <button
            id="header-block-compute"
            onClick={() => toggleDropdown('compute')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border transition-all shadow-sm ${
              openDropdown === 'compute'
                ? 'bg-cyan-500 text-black border-cyan-400 ring-2 ring-cyan-400/30'
                : 'bg-[#1A1A1C] hover:bg-[#27272A] text-gray-200 border-[#333335] hover:border-cyan-500/50'
            }`}
          >
            <Cpu className={`w-3.5 h-3.5 ${openDropdown === 'compute' ? 'text-black' : 'text-cyan-400'}`} />
            <span className="tracking-tight">
              {lang === 'es' ? 'Cómputo & MLOps' : lang === 'pt' ? 'Computação & MLOps' : 'Compute & MLOps'}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'compute' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'compute' && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 bg-[#141416] border border-[#2B2B30] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-[#27272A] text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                <span>{lang === 'es' ? 'Motores Determinísticos & IA' : 'Deterministic Engines & AI'}</span>
                <span className="text-gray-500">CTO • Tech</span>
              </div>

              {/* 2.1 Suite Python 7 Motores */}
              {onOpenPythonSuite && (
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    audioSynth.playClickSound();
                    onOpenPythonSuite();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{t.python_suite}</span>
                      <span className="text-[9px] px-1 rounded bg-emerald-950 text-emerald-300 font-mono">7 Engines</span>
                    </div>
                    <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                      {lang === 'es' ? 'Monte Carlo 10k, VRAM/KV-Cache, Churn y LaTeX IEEE' : 'Monte Carlo 10k, VRAM sizing, Telecom churn & LaTeX'}
                    </div>
                  </div>
                </button>
              )}

              {/* 2.2 Radar de Tendencias B2B & Generador */}
              {onOpenTrendRadar && (
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    audioSynth.playClickSound();
                    onOpenTrendRadar();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-orange-950/60 border border-orange-700/50 text-orange-400 group-hover:scale-105 transition-transform">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{t.trends_generator}</span>
                      <span className="text-[9px] px-1 rounded bg-orange-950 text-orange-300 font-mono">LinkedIn / X</span>
                    </div>
                    <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                      {lang === 'es' ? 'Scoring de señales B2B y generador de láminas' : 'Real-time B2B topic radar & AI presentation generator'}
                    </div>
                  </div>
                </button>
              )}

              {/* 2.3 Asesor Ejecutivo IA (Gemini 3.7) */}
              {onOpenAiQna && (
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    audioSynth.playClickSound();
                    onOpenAiQna();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-700/50 text-amber-400 group-hover:scale-105 transition-transform">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{t.ask_ai}</span>
                      <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300 font-mono">Gemini 3.7</span>
                    </div>
                    <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                      {lang === 'es' ? 'Consultas financieras y técnicas sobre la lámina activa' : 'Live contextual AI assistant for slide TCO metrics'}
                    </div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* BLOCK 3: PUBLICACIÓN & FEEDBACK (COMITÉ & COMUNIDAD) */}
        {/* ======================================================== */}
        <div className="relative">
          <button
            id="header-block-publish"
            onClick={() => toggleDropdown('publish')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border transition-all shadow-sm ${
              openDropdown === 'publish'
                ? 'bg-emerald-500 text-black border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-[#1A1A1C] hover:bg-[#27272A] text-gray-200 border-[#333335] hover:border-emerald-500/50'
            }`}
          >
            <Share2 className={`w-3.5 h-3.5 ${openDropdown === 'publish' ? 'text-black' : 'text-emerald-400'}`} />
            <span className="tracking-tight">
              {lang === 'es' ? 'Publicación & Feedback' : lang === 'pt' ? 'Publicação & Feedback' : 'Export & Feedback'}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'publish' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'publish' && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#141416] border border-[#2B2B30] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-[#27272A] text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                <span>{lang === 'es' ? 'Entrega & Diálogo Ejecutivo' : 'Deliverables & C-Suite Forum'}</span>
                <span className="text-gray-500">Boardroom</span>
              </div>

              {/* 3.1 Descargar PDF Ejecutivo */}
              <button
                onClick={handlePdfExport}
                disabled={isExporting}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group disabled:opacity-50"
              >
                <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-700/50 text-blue-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{isExporting ? t.export_pdf_loading : t.export_pdf}</span>
                    <span className="text-[9px] px-1 rounded bg-blue-950 text-blue-300 font-mono">PDF Doc</span>
                  </div>
                  <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                    {lang === 'es' ? 'Memoria ejecutiva completa con métricas para comités' : 'Full executive financial report with tables & metrics'}
                  </div>
                </div>
              </button>

              {/* 3.2 Exportar PowerPoint PPTX */}
              <button
                onClick={handlePptxExport}
                disabled={isExportingPptx}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group disabled:opacity-50"
              >
                <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-700/50 text-amber-400 group-hover:scale-105 transition-transform">
                  <Presentation className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{isExportingPptx ? t.export_pptx_loading : t.export_pptx}</span>
                    <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300 font-mono">16:9 .pptx</span>
                  </div>
                  <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                    {lang === 'es' ? 'Presentación editable en PowerPoint con todas las láminas' : 'Editable 16:9 presentation deck for executive boards'}
                  </div>
                </div>
              </button>

              {/* 3.3 Comunidad Kboxhubia & White Papers */}
              {onOpenCommunity && (
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    audioSynth.playClickSound();
                    onOpenCommunity();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{lang === 'es' ? 'Comunidad & White Papers' : 'Community & White Papers'}</span>
                      <span className="text-[9px] px-1 rounded bg-emerald-950 text-emerald-300 font-mono">9 Papers</span>
                    </div>
                    <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                      {lang === 'es' ? 'Granja de dinero, encuestas C-Suite y repositorio' : 'Money Farm, C-Suite surveys & papers hub'}
                    </div>
                  </div>
                </button>
              )}

              {/* 3.4 Community Bridge: WhatsApp & Auto-Learning */}
              {onOpenCommunityBridge && (
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    audioSynth.playClickSound();
                    onOpenCommunityBridge();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group bg-emerald-950/20 border border-emerald-800/30"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 group-hover:scale-105 transition-transform">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>{lang === 'es' ? 'Community Bridge (WhatsApp)' : 'Community Bridge (WhatsApp)'}</span>
                      <span className="text-[9px] px-1 rounded bg-emerald-500 text-black font-mono font-bold">Auto-Sync</span>
                    </div>
                    <div className="text-[11px] text-gray-300 leading-tight mt-0.5">
                      {lang === 'es' ? 'Difusión de tendencias y funnel de consultas al cerebro IA' : 'Trend distribution & query learning funnel into AI brain'}
                    </div>
                  </div>
                </button>
              )}

              {/* 3.5 Foro / Área de Preguntas & Comentarios */}
              <button
                onClick={() => {
                  setOpenDropdown(null);
                  audioSynth.playClickSound();
                  if (onOpenFeedback) onOpenFeedback();
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-700/50 text-purple-400 group-hover:scale-105 transition-transform">
                  <MessageSquareText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{lang === 'es' ? 'Foro & Preguntas C-Suite' : 'Executive Q&A & Feedback'}</span>
                    <span className="text-[9px] px-1 rounded bg-purple-950 text-purple-300 font-mono">Interact</span>
                  </div>
                  <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                    {lang === 'es' ? 'Respuestas a objeciones, canal de dudas y comentarios' : 'C-Level objection handling matrix & feedback forum'}
                  </div>
                </div>
              </button>

              {/* 3.5 Admin Dashboard */}
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    audioSynth.playClickSound();
                    onOpenAdmin();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#202024] text-gray-200 hover:text-white transition-all flex items-start gap-3 group border-t border-[#222228] mt-1"
                >
                  <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-700/50 text-amber-400 group-hover:scale-105 transition-transform">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{lang === 'es' ? 'Admin Dashboard (15 Temas)' : 'Admin Dashboard'}</span>
                      <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300 font-mono">Master</span>
                    </div>
                    <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                      {lang === 'es' ? 'Autorizar temas, base de leads y memoria RAG' : 'Authorize topics, leads database & RAG memory'}
                    </div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dedicated Community Bridge Button */}
        {onOpenCommunityBridge && (
          <button
            onClick={() => {
              audioSynth.playClickSound();
              onOpenCommunityBridge();
            }}
            title="Kbox Community Bridge • WhatsApp Autonomous Distribution & AI Learning"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-sm group"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="tracking-tight">WhatsApp Bridge</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>
        )}

      </div>

      {/* Right Toolbar: Language, Audio Engine, Fullscreen */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            id="header-lang-btn"
            onClick={() => toggleDropdown('lang')}
            title="Cambiar Idioma / Change Language / Mudar Idioma"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-bold rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-gray-200 border border-[#333335] hover:border-amber-500/50 transition-all shadow-sm"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-amber-300 uppercase text-[11px]">
              {lang === 'es' ? 'ES' : lang === 'pt' ? 'PT' : 'EN'}
            </span>
          </button>

          {openDropdown === 'lang' && (
            <div className="absolute right-0 mt-2 w-44 bg-[#141416] border border-[#27272A] rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1">
              <button
                onClick={() => {
                  onSelectLang('es');
                  setOpenDropdown(null);
                  audioSynth.playClickSound();
                }}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all ${
                  lang === 'es'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-gray-300 hover:bg-[#202024] hover:text-white'
                }`}
              >
                <span>🇪🇸 Español (Principal)</span>
                {lang === 'es' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
              </button>

              <button
                onClick={() => {
                  onSelectLang('en');
                  setOpenDropdown(null);
                  audioSynth.playClickSound();
                }}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-gray-300 hover:bg-[#202024] hover:text-white'
                }`}
              >
                <span>🇺🇸 English (Global)</span>
                {lang === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
              </button>

              <button
                onClick={() => {
                  onSelectLang('pt');
                  setOpenDropdown(null);
                  audioSynth.playClickSound();
                }}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all ${
                  lang === 'pt'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-gray-300 hover:bg-[#202024] hover:text-white'
                }`}
              >
                <span>🇧🇷 Português (Brasil)</span>
                {lang === 'pt' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
              </button>
            </div>
          )}
        </div>

        {/* Audio Engine Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('audio')}
            title="Executive Soundtrack & Ambient Audio Engine"
            className={`p-2 rounded-full transition-colors flex items-center gap-1 ${
              audioSettings.isPlaying 
                ? 'text-amber-400 bg-amber-950/30 border border-amber-700/50' 
                : 'text-gray-400 hover:text-white hover:bg-[#1A1A1C]'
            }`}
          >
            {audioSettings.isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {openDropdown === 'audio' && (
            <div className="absolute right-0 mt-2 w-64 bg-[#141416] border border-[#27272A] rounded-xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#27272A]">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  Executive Audio Engine
                </span>
                <button
                  onClick={toggleMusic}
                  className={`px-2 py-0.5 text-xs rounded font-mono font-bold ${
                    audioSettings.isPlaying
                      ? 'bg-amber-500 text-black'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {audioSettings.isPlaying ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="mb-3">
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span>Sound Volume</span>
                  <span className="font-mono">{Math.round(audioSettings.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Ambient Themes */}
              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Audio Theme</span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {(['executive', 'cyber', 'minimal', 'pulse'] as const).map(th => (
                    <button
                      key={th}
                      onClick={() => handleThemeChange(th)}
                      className={`px-2.5 py-1.5 rounded-lg capitalize text-left text-[11px] transition-all ${
                        audioSettings.theme === th
                          ? 'bg-[#1A1A1C] text-amber-400 border border-amber-500/40 font-semibold'
                          : 'bg-[#0E0E10] text-gray-400 hover:bg-[#27272A] border border-[#27272A]'
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Narration */}
              <div className="pt-2 border-t border-[#27272A]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300 flex items-center gap-1">
                    {audioSettings.voiceNarrationEnabled ? <Mic className="w-3 h-3 text-emerald-400" /> : <MicOff className="w-3 h-3 text-gray-500" />}
                    Voice Narration
                  </span>
                  <button
                    onClick={toggleVoiceNarration}
                    className={`px-2.5 py-0.5 text-xs rounded-full ${
                      audioSettings.voiceNarrationEnabled
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
                        : 'bg-[#1A1A1C] text-gray-500 border border-[#333335]'
                    }`}
                  >
                    {audioSettings.voiceNarrationEnabled ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onToggleFullscreen();
          }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Presentation Mode'}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#1A1A1C] rounded-full transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

      </div>
    </header>
  );
};
