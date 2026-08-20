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
  Bot
} from 'lucide-react';
import { AudioSettings, PredictiveAlert } from '../types';
import { exportExecutivePdfReport } from '../services/pdfExporter';
import { exportPowerPointPresentation } from '../services/pptxExporter';
import { audioSynth } from '../services/audioSynth';

interface HeaderProps {
  audioSettings: AudioSettings;
  setAudioSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
  alerts: PredictiveAlert[];
  onOpenAlerts: () => void;
  onOpenCalculator: () => void;
  onOpenPortalModal: () => void;
  onOpenDossier: () => void;
  onOpenAiQna?: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  currentSlideIndex: number;
  totalSlides: number;
}

export const Header: React.FC<HeaderProps> = ({
  audioSettings,
  setAudioSettings,
  alerts,
  onOpenAlerts,
  onOpenCalculator,
  onOpenPortalModal,
  onOpenDossier,
  onOpenAiQna,
  isFullscreen,
  onToggleFullscreen,
  currentSlideIndex,
  totalSlides
}) => {
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);

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
    const vol = parseFloat(e.target.value);
    audioSynth.setVolume(vol);
    setAudioSettings(prev => ({ ...prev, volume: vol }));
  };

  const handleThemeChange = (theme: 'executive' | 'cyber' | 'minimal' | 'pulse') => {
    audioSynth.setTheme(theme);
    setAudioSettings(prev => ({ ...prev, theme }));
    audioSynth.playClickSound();
  };

  const toggleVoiceNarration = () => {
    setAudioSettings(prev => ({
      ...prev,
      voiceNarrationEnabled: !prev.voiceNarrationEnabled
    }));
    audioSynth.playClickSound();
  };

  const toggleLanguage = () => {
    setAudioSettings(prev => ({
      ...prev,
      voiceLanguage: prev.voiceLanguage === 'es' ? 'en' : 'es'
    }));
    audioSynth.playClickSound();
  };

  const handlePdfExport = async () => {
    audioSynth.playClickSound();
    setIsExporting(true);
    try {
      await exportExecutivePdfReport({ currentSlideIndex });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePptxExport = async () => {
    audioSynth.playClickSound();
    setIsExportingPptx(true);
    try {
      await exportPowerPointPresentation();
    } finally {
      setIsExportingPptx(false);
    }
  };

  return (
    <header className="w-full bg-[#0E0E10]/95 backdrop-blur-md border-b border-[#27272A] text-gray-200 z-50 sticky top-0 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-xl">
      {/* Left: Branding & Presenter Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#1A1A1C] border border-[#333335] text-white font-bold tracking-tighter text-xs shadow-sm">
          <span className="text-white">AI</span>
          <span className="text-amber-500 ml-0.5">$</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-sm sm:text-base text-white">
              AI Financial Architecture
            </span>
            <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#1A1A1C] text-gray-400 border border-[#333335]">
              CAPEX vs OPEX
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="text-amber-500 font-medium">Ing. Jorge Huerta</span>
            <span className="text-gray-600">•</span>
            <span className="text-[11px] text-gray-500 hidden sm:inline">LinkedIn Executive Briefing (Aug 2026)</span>
          </div>
        </div>
      </div>

      {/* Center: Slide Progress Indicator (desktop) */}
      <div className="hidden lg:flex items-center gap-2 bg-[#1A1A1C] px-3.5 py-1 rounded-full border border-[#333335]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Slide</span>
        <span className="text-xs font-mono font-bold text-white">{currentSlideIndex + 1}</span>
        <span className="text-gray-600 font-mono">/</span>
        <span className="text-[11px] font-mono text-gray-400">{totalSlides}</span>
      </div>

      {/* Right Controls: Audio, Live Predictions, ROI Simulator, PDF Export, Portal Web */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Market Predictions Alert Trigger */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onOpenAlerts();
          }}
          title="Predictive Market Signals"
          className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-amber-400 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <Bell className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Market Signals</span>
          <span className="text-[10px] bg-amber-950/60 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-800/40 font-bold">
            {alerts.length}
          </span>
        </button>

        {/* Interactive ROI Calculator Trigger */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onOpenCalculator();
          }}
          title="CFO Break-Even & ROI Simulator"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-gray-300 border border-[#333335] hover:text-white hover:border-gray-500 transition-all shadow-sm"
        >
          <Calculator className="w-3.5 h-3.5 text-gray-400" />
          <span className="hidden sm:inline">CFO Simulator</span>
        </button>

        {/* Audio & Ambient Music Controls Menu */}
        <div className="relative">
          <button
            onClick={toggleMusic}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowAudioMenu(!showAudioMenu);
            }}
            title={audioSettings.isPlaying ? 'Mute Ambient Music (Right click for settings)' : 'Play Ambient Soundtrack'}
            className={`flex items-center justify-center p-2 rounded-full text-xs font-medium border transition-all ${
              audioSettings.isPlaying
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-[#1A1A1C] hover:bg-[#27272A] text-gray-400 border-[#333335]'
            }`}
          >
            {audioSettings.isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Sound settings dropdown toggle */}
          <button
            onClick={() => setShowAudioMenu(!showAudioMenu)}
            title="Audio settings"
            className="hidden md:inline-flex absolute -top-1 -right-1 p-0.5 rounded-full bg-[#27272A] border border-[#333335] text-gray-400 hover:text-white text-[9px]"
          >
            <Sliders className="w-2.5 h-2.5" />
          </button>

          {showAudioMenu && (
            <div className="absolute right-0 mt-2 w-64 p-4 rounded-xl bg-[#161618] border border-[#27272A] shadow-2xl z-50 text-gray-200">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#27272A]">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Executive Soundscape
                </span>
                <button
                  onClick={() => setShowAudioMenu(false)}
                  className="text-xs text-gray-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Sound toggle */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-300">Ambient Music</span>
                <button
                  onClick={toggleMusic}
                  className={`px-3 py-1 text-xs rounded-full font-bold ${
                    audioSettings.isPlaying
                      ? 'bg-white text-black'
                      : 'bg-[#1A1A1C] text-gray-400 border border-[#333335]'
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

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Language</span>
                  <button
                    onClick={toggleLanguage}
                    className="px-2 py-0.5 bg-[#1A1A1C] hover:bg-[#27272A] text-gray-300 border border-[#333335] rounded font-semibold text-[10px] uppercase"
                  >
                    {audioSettings.voiceLanguage === 'es' ? 'Español' : 'English'}
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
            <span className="hidden sm:inline">AI Advisor</span>
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
          <span>{isExportingPptx ? 'Exportando PPTX...' : 'PowerPoint (.pptx)'}</span>
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
          <span>{isExporting ? 'Exporting PDF...' : 'Export to PDF'}</span>
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
