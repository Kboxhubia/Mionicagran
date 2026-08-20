import React from 'react';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import { SlideData } from '../types';

interface AiFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  currentSlide: SlideData;
}

export const AiFloatingButton: React.FC<AiFloatingButtonProps> = ({
  onClick,
  isOpen,
  currentSlide
}) => {
  const handleClick = () => {
    audioSynth.playClickSound();
    onClick();
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 group">
      {/* Contextual Slide Pill */}
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E0E10]/95 backdrop-blur-md border border-[#27272A] text-gray-300 text-xs shadow-xl transition-all group-hover:border-amber-500/50">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-mono text-amber-400 font-bold">Slide {currentSlide.id}:</span>
        <span className="truncate max-w-[160px] text-[11px] text-gray-300 font-medium">
          {currentSlide.title}
        </span>
      </div>

      {/* Main Floating Action Button */}
      <button
        id="ai-floating-qna-btn"
        onClick={handleClick}
        title={`Ask AI Executive Advisor about Slide ${currentSlide.id} (${currentSlide.title})`}
        className={`relative flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 ${
          isOpen
            ? 'bg-amber-500 text-black ring-4 ring-amber-500/30'
            : 'bg-white hover:bg-gray-100 text-black hover:shadow-[0_0_25px_rgba(245,158,11,0.35)]'
        }`}
      >
        {/* Pulsating Ping Effect */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-black"></span>
        </span>

        <Bot className="w-5 h-5 stroke-[2.5]" />
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-tight leading-none">
            {isOpen ? 'Close AI Advisor' : 'Ask AI Advisor'}
          </span>
          <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-wider font-mono">
            Gemini • Slide {currentSlide.id}
          </span>
        </div>
      </button>
    </div>
  );
};
