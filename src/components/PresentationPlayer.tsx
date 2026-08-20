import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Maximize2, 
  Minimize2, 
  Grid, 
  FileText, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Gauge,
  MessageSquare,
  Presentation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData, AudioSettings, Language } from '../types';
import { SlideViewer } from './SlideViewer';
import { audioSynth } from '../services/audioSynth';
import { speechService } from '../services/speechService';
import { exportPowerPointPresentation } from '../services/pptxExporter';
import { UI_TRANSLATIONS } from '../services/i18n';

interface PresentationPlayerProps {
  slides: SlideData[];
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  audioSettings: AudioSettings;
  setAudioSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
  lang: Language;
  onOpenCalculator: () => void;
  onOpenPortalModal: () => void;
}

export type TransitionEffect = 'slide' | 'fade' | 'zoom';

export const PresentationPlayer: React.FC<PresentationPlayerProps> = ({
  slides,
  currentSlideIndex,
  onSlideChange,
  audioSettings,
  setAudioSettings,
  lang = 'es',
  onOpenCalculator,
  onOpenPortalModal
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [slideProgress, setSlideProgress] = useState<number>(0); // 0 to 100%
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [showPresenterNotes, setShowPresenterNotes] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isExportingPptx, setIsExportingPptx] = useState<boolean>(false);
  const [transitionEffect, setTransitionEffect] = useState<TransitionEffect>('slide');
  const [direction, setDirection] = useState<number>(1); // 1 = forward, -1 = backward
  const prevSlideIndexRef = useRef<number>(currentSlideIndex);

  const t = UI_TRANSLATIONS[lang];

  // Track direction when slide changes
  useEffect(() => {
    if (currentSlideIndex !== prevSlideIndexRef.current) {
      if (currentSlideIndex === 0 && prevSlideIndexRef.current === slides.length - 1) {
        setDirection(1); // loop forward
      } else if (currentSlideIndex === slides.length - 1 && prevSlideIndexRef.current === 0) {
        setDirection(-1);
      } else {
        setDirection(currentSlideIndex > prevSlideIndexRef.current ? 1 : -1);
      }
      prevSlideIndexRef.current = currentSlideIndex;
    }
  }, [currentSlideIndex, slides.length]);

  const handlePptxExport = async () => {
    audioSynth.playClickSound();
    setIsExportingPptx(true);
    try {
      await exportPowerPointPresentation(lang as Language);
    } finally {
      setIsExportingPptx(false);
    }
  };

  const currentSlide = slides[currentSlideIndex];
  const slideDurationMs = (currentSlide.durationSec * 1000) / playbackSpeed;
  const progressIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Handle Speech Narration when slide changes or language changes
  useEffect(() => {
    if (audioSettings.voiceNarrationEnabled) {
      const activeLang = (lang || 'es') as Language;
      const script = currentSlide.narration?.[activeLang] || currentSlide.narration?.es || currentSlide.subtitle;
      speechService.speak(script, activeLang);
    } else {
      speechService.stop();
    }
  }, [currentSlideIndex, audioSettings.voiceNarrationEnabled, lang]);

  // Video Presentation Auto-Advancement & Progress Loop
  useEffect(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    if (!isPlaying) return;

    startTimeRef.current = Date.now() - (slideProgress / 100) * slideDurationMs;

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(100, (elapsed / slideDurationMs) * 100);
      setSlideProgress(progress);

      if (progress >= 100) {
        // Advance to next slide
        if (currentSlideIndex < slides.length - 1) {
          audioSynth.playSlideTransitionSound();
          onSlideChange(currentSlideIndex + 1);
          setSlideProgress(0);
        } else if (isLooping) {
          audioSynth.playSlideTransitionSound();
          onSlideChange(0);
          setSlideProgress(0);
        } else {
          setIsPlaying(false);
          setSlideProgress(100);
        }
      }
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, currentSlideIndex, slideDurationMs, isLooping, slides.length]);

  // Reset slide progress on manual slide change
  const handleSelectSlide = (idx: number) => {
    audioSynth.playSlideTransitionSound();
    setSlideProgress(0);
    onSlideChange(idx);
  };

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      handleSelectSlide(currentSlideIndex + 1);
    } else if (isLooping) {
      handleSelectSlide(0);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      handleSelectSlide(currentSlideIndex - 1);
    }
  };

  const togglePlay = () => {
    audioSynth.playClickSound();
    setIsPlaying(prev => !prev);
    // Start ambient background music automatically if not playing
    if (!audioSettings.isPlaying) {
      audioSynth.startBackgroundMusic(audioSettings.theme);
      setAudioSettings(s => ({ ...s, isPlaying: true, isMuted: false }));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, isPlaying]);

  // Executive Motion Transition Variants
  const slideVariants = {
    enter: (dir: number) => {
      if (transitionEffect === 'fade') {
        return { opacity: 0, scale: 0.99, y: 4, filter: 'blur(4px)' };
      }
      if (transitionEffect === 'zoom') {
        return { opacity: 0, scale: 0.95, filter: 'blur(4px)' };
      }
      // Default: directional executive slide + subtle cross-fade + blur
      return {
        opacity: 0,
        x: dir > 0 ? 36 : -36,
        scale: 0.994,
        filter: 'blur(3px)'
      };
    },
    center: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.3, ease: 'easeOut' },
        filter: { duration: 0.25 }
      }
    },
    exit: (dir: number) => {
      if (transitionEffect === 'fade') {
        return {
          opacity: 0,
          scale: 0.99,
          y: -4,
          filter: 'blur(4px)',
          transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
        };
      }
      if (transitionEffect === 'zoom') {
        return {
          opacity: 0,
          scale: 1.03,
          filter: 'blur(4px)',
          transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
        };
      }
      // Default: directional exit
      return {
        opacity: 0,
        x: dir > 0 ? -36 : 36,
        scale: 0.994,
        filter: 'blur(3px)',
        transition: {
          x: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.22 },
          filter: { duration: 0.2 }
        }
      };
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between bg-[#0A0A0B] overflow-hidden select-none">
      
      {/* Active Slide Canvas with smooth minimal animated transitions */}
      <div className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">
        <div className="w-full max-w-7xl h-full max-h-[820px] bg-[#161618] rounded-xl border border-[#27272A] shadow-2xl relative flex flex-col overflow-hidden">
          
          {/* Top Per-Slide Video Progress Bar */}
          <div className="w-full h-1 bg-[#0E0E10] relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-white transition-all duration-75"
              style={{ width: `${slideProgress}%` }}
            />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col"
            >
              <SlideViewer
                slide={currentSlide}
                lang={lang}
                onOpenCalculator={onOpenCalculator}
                onOpenPortalModal={onOpenPortalModal}
              />
            </motion.div>
          </AnimatePresence>

          {/* Quick Floating Navigation Chevrons */}
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0E0E10]/80 hover:bg-white hover:text-black border border-[#27272A] text-gray-400 disabled:opacity-20 disabled:hover:bg-[#0E0E10]/80 disabled:hover:text-gray-400 transition-all shadow-lg hidden sm:flex"
            title="Previous Slide (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0E0E10]/80 hover:bg-white hover:text-black border border-[#27272A] text-gray-400 transition-all shadow-lg hidden sm:flex"
            title="Next Slide (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Drawer */}
      {showThumbnails && (
        <div className="w-full bg-[#0E0E10] border-t border-[#27272A] p-3 overflow-x-auto shadow-2xl z-40 animate-slide-up">
          <div className="max-w-7xl mx-auto flex items-center gap-2.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleSelectSlide(idx)}
                className={`flex-shrink-0 w-36 p-2.5 rounded-lg border text-left transition-all ${
                  idx === currentSlideIndex
                    ? 'bg-[#1A1A1C] border-white text-white shadow-md'
                    : 'bg-[#161618] border-[#27272A] hover:border-[#333335] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1">
                  <span className="font-bold text-amber-500">Slide {idx + 1}</span>
                  <span className="font-mono">{s.durationSec}s</span>
                </div>
                <div className="text-[11px] font-medium text-gray-200 truncate">
                  {s.title}
                </div>
                <div className="text-[9px] text-gray-500 truncate mt-0.5">
                  {s.category}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Presenter Notes & Executive Talking Points Drawer */}
      {showPresenterNotes && (
        <div className="w-full bg-[#0E0E10] border-t border-[#27272A] p-4 shadow-2xl z-40 animate-slide-up text-gray-200">
          <div className="max-w-5xl mx-auto space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                {t.presenter_notes} (Slide {currentSlideIndex + 1})
              </span>
              <button
                onClick={() => setShowPresenterNotes(false)}
                className="text-xs text-gray-500 hover:text-white"
              >
                {t.close}
              </button>
            </div>
            
            <p className="text-xs text-gray-300 leading-relaxed bg-[#161618] p-3.5 rounded-lg border border-[#27272A]">
              <strong className="text-white">{t.key_takeaway}: </strong>
              {currentSlide.narration?.[lang] || currentSlide.narration?.es || currentSlide.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Video & Interactive Playback Controller */}
      <div className="w-full bg-[#0E0E10] border-t border-[#27272A] px-4 py-3 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left: Play/Pause, Previous, Next & Time Indicators */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              title="Previous Slide (←)"
              className="p-2 rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-gray-300 border border-[#333335] disabled:opacity-20 transition-colors"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause Auto-Presentation (Space)' : 'Play Presentation (Space)'}
              className="p-2.5 rounded-full bg-white hover:bg-gray-200 text-black font-bold shadow-md transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={handleNext}
              title="Next Slide (→)"
              className="p-2 rounded-full bg-[#1A1A1C] hover:bg-[#27272A] text-gray-300 border border-[#333335] transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 text-xs text-gray-400 font-mono ml-2">
              <span className="text-white font-bold">{currentSlideIndex + 1}</span>
              <span className="text-gray-600">/</span>
              <span>{slides.length}</span>
            </div>
          </div>

          {/* Center: Global Presentation Timeline Scrubber */}
          <div className="flex-1 max-w-xl w-full flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSlide(idx)}
                  title={`${s.id}. ${s.title}`}
                  className={`h-1.5 rounded-full transition-all flex-1 ${
                    idx === currentSlideIndex
                      ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                      : idx < currentSlideIndex
                      ? 'bg-amber-500'
                      : 'bg-[#27272A] hover:bg-[#3F3F46]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Presentation Utilities (Speed, Notes, Thumbnails, Looping, Transitions) */}
          <div className="flex items-center gap-2">
            {/* Transition Effect Selector */}
            <div className="hidden sm:flex items-center bg-[#1A1A1C] rounded-full p-0.5 border border-[#333335] text-[10px]">
              <span className="px-2 py-0.5 text-[9px] text-amber-400/80 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                FX
              </span>
              {(['slide', 'fade', 'zoom'] as TransitionEffect[]).map((fx) => (
                <button
                  key={fx}
                  onClick={() => {
                    audioSynth.playClickSound();
                    setTransitionEffect(fx);
                  }}
                  title={`Motion Transition: ${fx.toUpperCase()}`}
                  className={`px-2 py-0.5 rounded-full capitalize font-medium transition-all ${
                    transitionEffect === fx
                      ? 'bg-amber-500 text-black font-bold shadow-xs'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {fx}
                </button>
              ))}
            </div>

            {/* Speed Multiplier */}
            <div className="flex items-center bg-[#1A1A1C] rounded-full p-0.5 border border-[#333335] text-[10px]">
              {[0.75, 1.0, 1.25, 1.5].map(spd => (
                <button
                  key={spd}
                  onClick={() => {
                    audioSynth.playClickSound();
                    setPlaybackSpeed(spd);
                  }}
                  className={`px-2 py-0.5 rounded-full font-mono transition-all ${
                    playbackSpeed === spd
                      ? 'bg-white text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Loop Toggle */}
            <button
              onClick={() => {
                audioSynth.playClickSound();
                setIsLooping(!isLooping);
              }}
              title={isLooping ? 'Looping Enabled' : 'Looping Disabled'}
              className={`p-2 rounded-full text-xs transition-colors ${
                isLooping ? 'bg-[#1A1A1C] text-amber-400 border border-amber-500/40' : 'bg-[#1A1A1C] text-gray-500 border border-[#333335]'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>

            {/* Speaker Notes Toggle */}
            <button
              onClick={() => {
                audioSynth.playClickSound();
                setShowPresenterNotes(!showPresenterNotes);
              }}
              title="Toggle C-Level Notes & Voice Script"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                showPresenterNotes
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-[#1A1A1C] text-gray-300 border-[#333335] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Notes</span>
            </button>

            {/* PowerPoint PPTX Export Button */}
            <button
              onClick={handlePptxExport}
              disabled={isExportingPptx}
              title="Descargar presentación completa en formato PowerPoint (.pptx)"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-sm disabled:opacity-50"
            >
              <Presentation className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isExportingPptx ? 'Exportando...' : 'Descargar PPTX'}</span>
            </button>

            {/* Thumbnails Grid Toggle */}
            <button
              onClick={() => {
                audioSynth.playClickSound();
                setShowThumbnails(!showThumbnails);
              }}
              title="Toggle Slides Carousel"
              className={`p-2 rounded-full text-xs border transition-colors ${
                showThumbnails
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-[#1A1A1C] text-gray-300 border-[#333335] hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
