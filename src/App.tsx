/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SLIDES_DATA, PREDICTIVE_ALERTS } from './data/slidesData';
import { AudioSettings, PredictiveAlert, Language, SlideData } from './types';
import { Header } from './components/Header';
import { PresentationPlayer } from './components/PresentationPlayer';
import { InteractiveRoiCalculator } from './components/InteractiveRoiCalculator';
import { PredictiveNotifications } from './components/PredictiveNotifications';
import { PortalWidgetModal } from './components/PortalWidgetModal';
import { ExecutiveDossierModal } from './components/ExecutiveDossierModal';
import { AiQnaSidebar } from './components/AiQnaSidebar';
import { AiFloatingButton } from './components/AiFloatingButton';
import { TrendRadarModal } from './components/TrendRadarModal';
import { PythonSandboxModal } from './components/PythonSandboxModal';
import { audioSynth } from './services/audioSynth';
import { UI_TRANSLATIONS } from './services/i18n';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const [slides, setSlides] = useState<SlideData[]>(SLIDES_DATA);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Audio & Ambient Music State
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    isMuted: true,
    volume: 0.6,
    theme: 'executive',
    isPlaying: false,
    voiceNarrationEnabled: false,
    voiceLanguage: 'es',
    voiceVolume: 1.0
  });

  // Keep voice language in sync with main language
  useEffect(() => {
    setAudioSettings(prev => ({
      ...prev,
      voiceLanguage: lang
    }));
  }, [lang]);

  // Modals & Drawers
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isAiQnaOpen, setIsAiQnaOpen] = useState<boolean>(false);
  const [isTrendRadarOpen, setIsTrendRadarOpen] = useState<boolean>(false);
  const [isPythonSuiteOpen, setIsPythonSuiteOpen] = useState<boolean>(false);

  const t = UI_TRANSLATIONS[lang];

  // Fullscreen management
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleAddNewSlide = (newSlide: SlideData) => {
    setSlides(prev => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-200 flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Top Navigation & Executive Header */}
      <Header
        lang={lang}
        onSelectLang={(selectedLang) => setLang(selectedLang)}
        audioSettings={audioSettings}
        setAudioSettings={setAudioSettings}
        alerts={PREDICTIVE_ALERTS}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenPortalModal={() => setIsPortalModalOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onOpenAiQna={() => setIsAiQnaOpen(true)}
        onOpenTrendRadar={() => setIsTrendRadarOpen(true)}
        onOpenPythonSuite={() => setIsPythonSuiteOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        currentSlideIndex={currentSlideIndex}
        totalSlides={slides.length}
      />

      {/* Real-Time Market Telemetry Marquee Banner */}
      <div className="w-full bg-[#0E0E10] border-b border-[#27272A] py-1.5 px-4 text-xs flex items-center justify-between gap-4 overflow-hidden z-20">
        <div className="flex items-center gap-2 text-emerald-400 shrink-0 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold uppercase tracking-widest text-gray-400">
            {lang === 'es' ? 'Telemetría en Vivo:' : lang === 'pt' ? 'Telemetria ao Vivo:' : 'Live Telemetry:'}
          </span>
        </div>

        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee text-[11px] text-gray-300">
            {lang === 'es' ? (
              <>
                <span className="mx-4 text-amber-400 font-medium">⚡ Cluster NVIDIA L40S 48GB: entrega reducida a 14 días ($48k USD llave en mano).</span>
                <span className="mx-4 text-gray-300">⚠️ Costo de APIs Cloud: +18.4% proyectado para inferencia de alto rendimiento en Q4 2026.</span>
                <span className="mx-4 text-emerald-400 font-medium">📈 Inferencia On-Premise sub-50ms reduce el Churn en ISPs en +18.5% y caídas en 42%.</span>
                <span className="mx-4 text-white font-medium">💡 Veredicto CFO: Retorno de inversión en 3.4 meses sustituye $180k USD/año en SaaS.</span>
              </>
            ) : lang === 'pt' ? (
              <>
                <span className="mx-4 text-amber-400 font-medium">⚡ Cluster NVIDIA L40S 48GB: entrega reduzida para 14 dias ($48k USD turn-key).</span>
                <span className="mx-4 text-gray-300">⚠️ Custo de APIs em Nuvem: aumento projetado de +18.4% para endpoints de LLM no 4T 2026.</span>
                <span className="mx-4 text-emerald-400 font-medium">📈 Inferência local sub-50ms reduz o Churn de Provedores em +18.5% e quedas em 42%.</span>
                <span className="mx-4 text-white font-medium">💡 Veredito CFO: Retorno de investimento em 3.4 meses substitui $180k USD/ano em SaaS.</span>
              </>
            ) : (
              <>
                <span className="mx-4 text-amber-400 font-medium">⚡ NVIDIA L40S 48GB cluster: spot delivery compressed to 14 days ($48k USD turnkey).</span>
                <span className="mx-4 text-gray-300">⚠️ Cloud API price surge: +18.4% projected for high-throughput LLM endpoints in Q4 2026.</span>
                <span className="mx-4 text-emerald-400 font-medium">📈 Sub-50ms On-Premise inference reduces ISP churn by +18.5% and downtime by 42%.</span>
                <span className="mx-4 text-white font-medium">💡 CFO Verdict: 3.4-Month Break-Even replaces $180k/yr recurring SaaS with sovereign assets.</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            audioSynth.playClickSound();
            setIsPortalModalOpen(true);
          }}
          className="shrink-0 flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-white font-semibold transition-colors bg-[#1A1A1C] px-2.5 py-0.5 rounded-full border border-[#333335]"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="hidden sm:inline">KBOX HUB IA</span>
        </button>
      </div>

      {/* Main Interactive Video Presentation Player */}
      <main className="flex-1 flex flex-col relative bg-[#0A0A0B]">
        <PresentationPlayer
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onSlideChange={(newIdx) => setCurrentSlideIndex(newIdx)}
          audioSettings={audioSettings}
          setAudioSettings={setAudioSettings}
          lang={lang}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenPortalModal={() => setIsPortalModalOpen(true)}
        />
      </main>

      {/* Modals and Drawers */}
      <InteractiveRoiCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <PredictiveNotifications
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={PREDICTIVE_ALERTS}
        onSelectAlert={() => {
          setIsAlertsOpen(false);
          setIsCalculatorOpen(true);
        }}
      />

      <PortalWidgetModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
      />

      <ExecutiveDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      {/* Trend Radar & Multi-Sector Slide Generator Modal */}
      <TrendRadarModal
        isOpen={isTrendRadarOpen}
        onClose={() => setIsTrendRadarOpen(false)}
        lang={lang}
        onAddNewSlide={handleAddNewSlide}
      />

      {/* Python Intelligence Suite Modal */}
      <PythonSandboxModal
        isOpen={isPythonSuiteOpen}
        onClose={() => setIsPythonSuiteOpen(false)}
        lang={lang}
      />

      {/* Floating Action Button for AI Q&A */}
      <AiFloatingButton
        isOpen={isAiQnaOpen}
        onClick={() => setIsAiQnaOpen(prev => !prev)}
        currentSlide={slides[currentSlideIndex]}
      />

      {/* Slide-out AI Q&A Sidebar (Gemini Powered) */}
      <AiQnaSidebar
        isOpen={isAiQnaOpen}
        onClose={() => setIsAiQnaOpen(false)}
        currentSlide={slides[currentSlideIndex]}
        allSlides={slides}
      />

    </div>
  );
}
