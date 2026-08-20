import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Sparkles,
  Flame,
  Globe2,
  Share2,
  X,
  Plus,
  Bot,
  Zap,
  Film,
  FlaskConical,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Language, TrendPlatform, TrendSector, TrendSignal, SlideData } from '../types';
import { TREND_SIGNALS } from '../data/slidesData';
import { audioSynth } from '../services/audioSynth';
import { UI_TRANSLATIONS } from '../services/i18n';

interface TrendRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddNewSlide: (newSlide: SlideData) => void;
}

export const TrendRadarModal: React.FC<TrendRadarModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAddNewSlide
}) => {
  const [selectedSector, setSelectedSector] = useState<TrendSector | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<TrendPlatform | 'all'>('all');
  const [activeSignal, setActiveSignal] = useState<TrendSignal>(TREND_SIGNALS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>(TREND_SIGNALS[0].samplePrompt[lang]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const t = UI_TRANSLATIONS[lang];

  if (!isOpen) return null;

  const filteredSignals = TREND_SIGNALS.filter((signal) => {
    const matchSector = selectedSector === 'all' || signal.sector === selectedSector;
    const matchPlatform = selectedPlatform === 'all' || signal.platform === selectedPlatform;
    return matchSector && matchPlatform;
  });

  const handleSelectSignal = (signal: TrendSignal) => {
    audioSynth.playClickSound();
    setActiveSignal(signal);
    setCustomPrompt(signal.samplePrompt[lang]);
  };

  const handleGenerateSlide = async () => {
    audioSynth.playTone(600, 0.1, 'sine', 0.1);
    setIsGenerating(true);

    try {
      // Call Gemini API to construct structured slide payload
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Genera una diapositiva ejecutiva completa y estructurada basada en este requerimiento: "${customPrompt}". 
Sector: ${activeSignal.sector}, Plataforma: ${activeSignal.platform}.
Idioma de respuesta: ${lang === 'es' ? 'Español' : lang === 'pt' ? 'Português' : 'English'}.
Devuelve un título de impacto, subtítulo con métricas financieras o técnicas, 3 métricas numéricas con colores (cyan, emerald, amber, rose), 3 puntos clave (bullets) y una conclusión estratégica (takeaway).`,
          slideContext: {
            title: activeSignal.title,
            subtitle: activeSignal.summary[lang]
          }
        })
      });

      let aiText = '';
      if (response.ok) {
        const data = await response.json();
        aiText = data.answer || '';
      }

      // Create new dynamic slide and inject into presentation
      const newSlideId = Date.now();
      const generatedSlide: SlideData = {
        id: newSlideId,
        slug: `trend-${activeSignal.id}`,
        variantNumber: `Dynamic Signal (${activeSignal.platform.toUpperCase()})`,
        badge: `${activeSignal.tag} • Live AI Signal`,
        title: activeSignal.title,
        subtitle: activeSignal.summary[lang],
        category: activeSignal.sector === 'entertainment' ? 'Strategic' : activeSignal.sector === 'science' ? 'Architecture' : 'Financial',
        durationSec: 15,
        type: 'dynamic_trend',
        takeaway: aiText ? aiText.slice(0, 220) : activeSignal.summary[lang],
        bullets: [
          `Análisis impulsado por tendencias en ${activeSignal.platform.toUpperCase()}`,
          `Sector: ${activeSignal.sector.toUpperCase()} con alto impacto de inversión`,
          'Despliegue local y soberanía computacional garantizada'
        ],
        metrics: [
          { label: 'Crecimiento de Señal', value: activeSignal.growth, color: 'emerald' },
          { label: 'Compromiso Digital', value: activeSignal.engagement, color: 'cyan' },
          { label: 'Eficiencia Estimada', value: '+68.5%', color: 'amber', highlight: true }
        ],
        narration: {
          es: `Nueva diapositiva generada a partir de tendencias en ${activeSignal.platform}: ${activeSignal.title}. ${activeSignal.summary.es}`,
          en: `New slide generated from trending topics on ${activeSignal.platform}: ${activeSignal.title}. ${activeSignal.summary.en}`,
          pt: `Nova lâmina gerada a partir de tendências no ${activeSignal.platform}: ${activeSignal.title}. ${activeSignal.summary.pt}`
        }
      };

      onAddNewSlide(generatedSlide);
      audioSynth.playAlertChime();
      onClose();
    } catch {
      // Fallback local injection
      const fallbackSlide: SlideData = {
        id: Date.now(),
        slug: `trend-${activeSignal.id}`,
        variantNumber: `Trend Signal (${activeSignal.platform.toUpperCase()})`,
        badge: `${activeSignal.tag} • AI Generated`,
        title: activeSignal.title,
        subtitle: activeSignal.summary[lang],
        category: 'Strategic',
        durationSec: 14,
        type: 'dynamic_trend',
        takeaway: activeSignal.summary[lang],
        bullets: [
          'Generado automáticamente por el Radar de Tendencias B2B',
          'Soberanía de hardware local y mitigación de costos de APIs públicas',
          'Optimización de infraestructura y aceleración de time-to-market'
        ],
        metrics: [
          { label: 'Impacto en Mercado', value: activeSignal.growth, color: 'emerald' },
          { label: 'Volumen Social', value: activeSignal.engagement, color: 'cyan' },
          { label: 'Retorno Estimado', value: '4.1x ROI', color: 'amber', highlight: true }
        ],
        narration: {
          es: activeSignal.summary.es,
          en: activeSignal.summary.en,
          pt: activeSignal.summary.pt
        }
      };
      onAddNewSlide(fallbackSlide);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-[#0E0E10] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#141416]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {t.trends_generator}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    LinkedIn • X • ArXiv
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {lang === 'es'
                    ? 'Genera nuevas diapositivas a partir del pulso en tiempo real de 3 sectores clave'
                    : lang === 'pt'
                    ? 'Gere novas lâminas a partir do pulso em tempo real de 3 setores estratégicos'
                    : 'Generate new presentation slides from live trending signals across 3 strategic sectors'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                audioSynth.playClickSound();
                onClose();
              }}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#27272A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sector & Platform Filter Tabs */}
          <div className="p-4 bg-[#111113] border-b border-[#27272A] flex flex-wrap gap-4 items-center justify-between">
            {/* 3 Sectors */}
            <div className="flex items-center gap-1.5 bg-[#18181B] p-1 rounded-xl border border-[#27272A]">
              <button
                onClick={() => setSelectedSector('all')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  selectedSector === 'all' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {lang === 'es' ? 'Todos' : lang === 'pt' ? 'Todos' : 'All'}
              </button>
              <button
                onClick={() => setSelectedSector('entertainment')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  selectedSector === 'entertainment' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                {t.sector_entertainment}
              </button>
              <button
                onClick={() => setSelectedSector('science')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  selectedSector === 'science' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                {t.sector_science}
              </button>
              <button
                onClick={() => setSelectedSector('ai_world')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  selectedSector === 'ai_world' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                {t.sector_ai_world}
              </button>
            </div>

            {/* Platforms */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
              <span className="hidden sm:inline text-[11px] uppercase font-bold text-gray-500">Platform:</span>
              {(['all', 'linkedin', 'x', 'hackernews', 'arxiv'] as const).map((plt) => (
                <button
                  key={plt}
                  onClick={() => setSelectedPlatform(plt)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                    selectedPlatform === plt
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'hover:text-white'
                  }`}
                >
                  {plt}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Signals List & AI Generator Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
            {/* Left: Signals Feed */}
            <div className="lg:col-span-5 border-r border-[#27272A] bg-[#111113] p-4 flex flex-col gap-2.5 overflow-y-auto max-h-[38vh] lg:max-h-full">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 px-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                {lang === 'es' ? 'Señales en Tendencia' : lang === 'pt' ? 'Sinais em Alta' : 'Trending Signals'}
              </span>

              {filteredSignals.map((sig) => {
                const isSelected = activeSignal.id === sig.id;
                return (
                  <button
                    key={sig.id}
                    onClick={() => handleSelectSignal(sig)}
                    className={`text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/60 text-white shadow-sm'
                        : 'bg-[#18181B]/70 border-[#27272A] text-gray-300 hover:bg-[#202024] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {sig.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-cyan-400 border border-cyan-500/30">
                        {sig.growth}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {sig.summary[lang]}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-1 border-t border-[#27272A]">
                      <span>{sig.platform.toUpperCase()}</span>
                      <span className="text-amber-400/90">{sig.engagement}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: AI Generator & Customizer */}
            <div className="lg:col-span-7 flex flex-col bg-[#0A0A0C] p-6 gap-4 overflow-y-auto">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider">
                  {lang === 'es' ? 'Configuración de Diapositiva con IA' : lang === 'pt' ? 'Configuração de Lâmina com IA' : 'AI Slide Configuration'}
                </span>
              </div>

              {/* Prompt Editor */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-300 font-medium">
                  {lang === 'es'
                    ? 'Prompt o Instrucción de Contenido:'
                    : lang === 'pt'
                    ? 'Prompt ou Instrução de Conteúdo:'
                    : 'Prompt / Content Instruction:'}
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-[#111114] border border-[#27272A] rounded-xl p-3.5 text-xs text-gray-200 focus:border-cyan-500 focus:outline-none leading-relaxed shadow-inner"
                  placeholder="Describe el enfoque de la diapositiva..."
                />
              </div>

              {/* Active Signal Summary Card */}
              <div className="p-4 rounded-xl bg-[#141417] border border-[#27272A] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {activeSignal.tag}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-mono">
                    {activeSignal.platform} • {activeSignal.sector}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {activeSignal.summary[lang]}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleGenerateSlide}
                  disabled={isGenerating || !customPrompt.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-black bg-cyan-400 hover:bg-cyan-300 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20"
                >
                  {isGenerating ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin" />
                      <span>{t.generating}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>{t.generate_slide}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
