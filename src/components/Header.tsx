import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Download, 
  Calculator, 
  ExternalLink, 
  Bell, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Share2,
  Radio,
  Sparkles,
  Mic,
  MicOff,
  Globe,
  Presentation,
  Bot,
  Flame,
  Terminal,
  Languages
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
  isFullscreen,
  onToggleFullscreen,
  currentSlideIndex,
  totalSlides
}) => {
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);

  const t = UI_TRANSLATIONS[lang];

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
    <header className="h-14 sm:h-16 px-3 sm:px-6 bg-[#0E0E10]/95 backdrop-blur-md border-b border-[#27272A] flex items-center justify-between z-30 sticky top-0">
      {/* Left: Author Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold font-mono text-sm shadow-md">
          JH
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">
              {t.author_name}
            </span>
            <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#27272A] text-amber-400 font-mono">
              Telecom & AI FinOps
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-normal truncate max-w-[200px] sm:max-w-[340px]">
            {t.author_sub}
          </span>
        </div>
      </div>

      {/* Center/Right Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            id="header-lang-btn"
            onClick={() => {
              audioSynth.playClickSound();
              setShowLangMenu(!showLangMenu);
            }}
            title="Cambiar Idioma / Change Language / Mudar Idioma"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-gray-200 border border-[#333335] hover:border-amber-500/50 transition-all shadow-sm"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-amber-300 uppercase">
              {lang === 'es' ? '🇪🇸 ES' : lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
            </span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-[#141416] border border-[#27272A] rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1">
              <button
                onClick={() => {
                  onSelectLang('es');
                  setShowLangMenu(false);
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
                  setShowLangMenu(false);
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
                  setShowLangMenu(false);
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

        {/* Trend Radar & Multi-Sector Generator Button */}
        {onOpenTrendRadar && (
          <button
            id="header-trend-radar-btn"
            onClick={() => {
              audioSynth.playClickSound();
              onOpenTrendRadar();
            }}
            title="Radar de Tendencias & Generador de Diapositivas (LinkedIn, X, ArXiv)"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.trends_generator}</span>
          </button>
        )}

        {/* Python Intelligence Suite Sandbox Button */}
        {onOpenPythonSuite && (
          <button
            id="header-python-suite-btn"
            onClick={() => {
              audioSynth.playClickSound();
              onOpenPythonSuite();
            }}
            title="Motor Python Sandbox (Monte Carlo, VRAM, Churn Predictor, LaTeX)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.python_suite}</span>
          </button>
        )}

        {/* Predictive Market Intelligence Radar */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onOpenAlerts();
          }}
          title="Live AI Hardware & Financial Market Alerts"
          className="relative p-2 text-gray-400 hover:text-amber-400 hover:bg-[#1A1A1C] rounded-full transition-colors"
        >
          <Bell className="w-4 h-4" />
          {alerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          )}
          {alerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          )}
        </button>

        {/* Interactive ROI Calculator Trigger */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onOpenCalculator();
          }}
          title="Interactive Cloud vs On-Premise ROI Calculator"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-gray-200 border border-[#333335] hover:border-cyan-500/50 transition-all shadow-sm"
        >
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{t.calculator_title}</span>
        </button>

        {/* Executive Dossier Trigger */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onOpenDossier();
          }}
          title="Executive Financial Dossier & Boardroom Memorandum"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-gray-200 border border-[#333335] hover:border-amber-500/50 transition-all shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.dossier_btn}</span>
        </button>

        {/* Audio / Ambient Music Control Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              audioSynth.playClickSound();
              setShowAudioMenu(!showAudioMenu);
            }}
            title="Executive Soundtrack & Ambient Audio Engine"
            className={`p-2 rounded-full transition-colors flex items-center gap-1 ${
              audioSettings.isPlaying 
                ? 'text-amber-400 bg-amber-950/30 border border-amber-700/50' 
                : 'text-gray-400 hover:text-white hover:bg-[#1A1A1C]'
            }`}
          >
            {audioSettings.isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {showAudioMenu && (
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
                <div className="flex items-center justify-between mb-2">
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

        {/* AI Advisor Q&A Trigger Button */}
        {onOpenAiQna && (
          <button
            id="header-ai-qna-btn"
            onClick={() => {
              audioSynth.playClickSound();
              onOpenAiQna();
            }}
            title="Ask AI Advisor about current slide financial data (Gemini)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-amber-400 border border-amber-500/40 hover:border-amber-500 transition-all shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.ask_ai}</span>
          </button>
        )}

        {/* Portal Web Advertising & Integration Modal */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onOpenPortalModal();
          }}
          title="Embed Dynamic Financial Widgets & Visit Portal"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-gray-200 border border-[#333335] hover:border-amber-500/50 hover:text-amber-300 transition-all shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline">KBOX HUB IA</span>
        </button>

        {/* Export to PowerPoint (PPTX) Button */}
        <button
          id="header-export-pptx-btn"
          onClick={handlePptxExport}
          disabled={isExportingPptx}
          title="Descargar presentación completa en formato PowerPoint (.pptx) con todas las láminas"
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-bold rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-all disabled:opacity-50"
        >
          <Presentation className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{isExportingPptx ? t.export_pptx_loading : t.export_pptx}</span>
        </button>

        {/* Export to PDF Button */}
        <button
          id="header-export-pdf-btn"
          onClick={handlePdfExport}
          disabled={isExporting}
          title="Export formatted executive PDF report of presentation slides & financial data"
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-bold rounded-full bg-white hover:bg-gray-200 text-black shadow-md transition-all disabled:opacity-50"
        >
          <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{isExporting ? t.export_pdf_loading : t.export_pdf}</span>
        </button>

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
