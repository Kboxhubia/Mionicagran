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
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Linkedin,
  Twitter
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
  currentSlide?: SlideData;
}

export const TrendRadarModal: React.FC<TrendRadarModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAddNewSlide,
  currentSlide
}) => {
  const [selectedSector, setSelectedSector] = useState<TrendSector | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<TrendPlatform | 'all'>('all');
  const [activeSignal, setActiveSignal] = useState<TrendSignal>(TREND_SIGNALS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>(TREND_SIGNALS[0].samplePrompt[lang]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Social Share Drawer / State
  const [isSocialShareOpen, setIsSocialShareOpen] = useState<boolean>(false);
  const [shareSource, setShareSource] = useState<'current_slide' | 'active_trend'>('current_slide');
  const [socialTone, setSocialTone] = useState<'executive' | 'technical' | 'viral'>('executive');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

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

  // Pre-formatted promotional text generation based on topic
  const generatePromotionalText = (): string => {
    const isSlide = shareSource === 'current_slide' && currentSlide;
    const title = isSlide ? currentSlide.title : activeSignal.title;
    const subtitle = isSlide ? (currentSlide.subtitle || currentSlide.takeaway) : activeSignal.summary[lang];
    const category = isSlide ? currentSlide.category : activeSignal.sector.toUpperCase();
    const appUrl = window.location.origin || 'https://kuboxhubia.ai';

    if (socialTone === 'executive') {
      if (lang === 'en') {
        return `🚀 Strategic AI & DeepTech Insight | ${title}\n\n` +
          `Key Industry Observation:\n"${subtitle}"\n\n` +
          `📊 Strategic Focus: ${category}\n` +
          `💡 Autonomous orchestration and local hardware compute deliver up to 4.5x ROI while maintaining 100% data sovereignty.\n\n` +
          `👉 Explore the live interactive briefing & architectural models:\n${appUrl}\n\n` +
          `#AIInfrastructure #EnterpriseAI #DeepTech #CFO #Innovation #OnPremisesAI #Kuboxhubia`;
      } else if (lang === 'pt') {
        return `🚀 Insight Estratégico em IA & DeepTech | ${title}\n\n` +
          `Observação Executiva:\n"${subtitle}"\n\n` +
          `📊 Foco Estratégico: ${category}\n` +
          `💡 A orquestração autônoma e computação local garantem até 4.5x de ROI com 100% de soberania dos dados.\n\n` +
          `👉 Explore a apresentação executiva interativa:\n${appUrl}\n\n` +
          `#InteligenciaArtificial #DeepTech #Inovacao #InfraestruturaIA #Kuboxhubia #Lideranca`;
      } else {
        return `🚀 Perspectiva Estratégica de IA & DeepTech | ${title}\n\n` +
          `Insight Clave del Mercado:\n"${subtitle}"\n\n` +
          `📊 Enfoque: ${category}\n` +
          `💡 La soberanía computacional On-Premises y la orquestación multi-agente reducen costos operativos hasta un 68% garantizando máxima privacidad.\n\n` +
          `👉 Conoce la plataforma interactiva y simula el ROI en vivo:\n${appUrl}\n\n` +
          `#InteligenciaArtificial #AIInfrastructure #DeepTech #SoberaniaDigital #Kuboxhubia #CSuite #TransformacionDigital`;
      }
    } else if (socialTone === 'technical') {
      if (lang === 'en') {
        return `⚡ Tech Deep-Dive: ${title}\n\n` +
          `🔬 Core Thesis: ${subtitle}\n\n` +
          `⚙️ Architecture Highlights:\n` +
          `• Local Multi-Agent RAG with quantized SLM/LLM inference\n` +
          `• Zero latency data-pipeline and custom vector database indexing\n` +
          `• Hardware acceleration on high-throughput GPU clusters\n\n` +
          `🔗 Full interactive architecture specs:\n${appUrl}\n\n` +
          `#MachineLearning #LLMOps #GPUComputing #LocalAI #SystemArchitecture #TechTrends`;
      } else {
        return `⚡ Análisis Técnico de Arquitectura: ${title}\n\n` +
          `🔬 Tesis Principal: ${subtitle}\n\n` +
          `⚙️ Puntos Clave de Implementación:\n` +
          `• Orquestación Multi-Agente RAG con inferencia local optimizada\n` +
          `• Cero latencia y base de vectores dedicada sin fuga de datos\n` +
          `• Clústeres acelerados de GPU (L40S / H100) con amortización transparente\n\n` +
          `🔗 Arquitectura técnica e interactiva en:\n${appUrl}\n\n` +
          `#MachineLearning #LLMOps #ArquitecturaIA #GPU #DeepTech #Kuboxhubia`;
      }
    } else {
      // Viral / Social
      if (lang === 'en') {
        return `🔥 Why ${title} is shifting the entire AI landscape right now:\n\n` +
          `"${subtitle}"\n\n` +
          `The future isn't renting compute forever—it's owning your intelligence stack. 💡\n\n` +
          `Check out the live interactive dashboard: ${appUrl}\n\n` +
          `#FutureOfAI #TrendingTech #ArtificialIntelligence #Startups #TechInnovation`;
      } else {
        return `🔥 Por qué "${title}" está transformando el panorama de la IA ahora mismo:\n\n` +
          `"${subtitle}"\n\n` +
          `El verdadero cambio no es rentar APIs a ciegas: es ser dueño de tu propia soberanía computacional. 💡\n\n` +
          `Revisa la plataforma interactiva en vivo aquí: ${appUrl}\n\n` +
          `#TendenciasIA #Innovacion #InteligenciaArtificial #TechNews #Kuboxhubia`;
      }
    }
  };

  const handleCopyToClipboard = async () => {
    audioSynth.playClickSound();
    const text = generatePromotionalText();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleShareNative = async () => {
    audioSynth.playClickSound();
    const text = generatePromotionalText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentSlide ? currentSlide.title : activeSignal.title,
          text: text,
          url: window.location.origin
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyToClipboard();
    }
  };

  const getLinkedInShareUrl = () => {
    const text = generatePromotionalText();
    return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
  };

  const getTwitterShareUrl = () => {
    const text = generatePromotionalText();
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  };

  const getWhatsAppShareUrl = () => {
    const text = generatePromotionalText();
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-[#0E0E10] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A] bg-[#141416]">
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
                    ? 'Genera diapositivas y difunde tendencias de alto impacto en redes profesionales'
                    : lang === 'pt'
                    ? 'Gere lâminas e compartilhe tendências de alto impacto em redes profissionais'
                    : 'Generate slides and distribute high-impact trend insights on professional networks'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Share on Social Action Button in Header */}
              <button
                id="btn-trend-share-social-toggle"
                onClick={() => {
                  audioSynth.playClickSound();
                  setIsSocialShareOpen(prev => !prev);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                  isSocialShareOpen
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-purple-900/40'
                    : 'bg-[#1D1D22] hover:bg-[#282830] text-purple-300 border-purple-500/30 hover:border-purple-400'
                }`}
                title="Generar y compartir publicación profesional en redes sociales"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{lang === 'es' ? 'Share on Social' : lang === 'pt' ? 'Compartilhar' : 'Share on Social'}</span>
              </button>

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
          </div>

          {/* Social Share Drawer Panel */}
          {isSocialShareOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#121217] border-b border-purple-500/30 p-4 sm:p-5 flex flex-col gap-4 text-gray-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {lang === 'es' ? 'Generador de Publicación Profesional (Copy Social)' : 'Social Media Promo Generator'}
                  </span>
                </div>

                {/* Source and Tone Selectors */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Topic Source */}
                  <div className="flex items-center bg-[#1B1B22] p-1 rounded-xl border border-[#2D2D35]">
                    <button
                      onClick={() => {
                        audioSynth.playClickSound();
                        setShareSource('current_slide');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        shareSource === 'current_slide'
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {lang === 'es' ? 'Diapositiva Actual' : 'Current Slide'}
                    </button>
                    <button
                      onClick={() => {
                        audioSynth.playClickSound();
                        setShareSource('active_trend');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        shareSource === 'active_trend'
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {lang === 'es' ? 'Tendencia Seleccionada' : 'Active Trend'}
                    </button>
                  </div>

                  {/* Tone Selector */}
                  <div className="flex items-center bg-[#1B1B22] p-1 rounded-xl border border-[#2D2D35]">
                    {(['executive', 'technical', 'viral'] as const).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => {
                          audioSynth.playClickSound();
                          setSocialTone(tone);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                          socialTone === tone
                            ? 'bg-amber-500 text-black'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {tone === 'executive' ? (lang === 'es' ? 'Ejecutivo' : 'Executive') : tone === 'technical' ? (lang === 'es' ? 'Técnico' : 'Technical') : 'Viral'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pre-formatted Textarea Preview */}
              <div className="relative">
                <textarea
                  readOnly
                  value={generatePromotionalText()}
                  rows={5}
                  className="w-full bg-[#0A0A0D] border border-purple-500/30 rounded-xl p-3.5 text-xs text-gray-200 font-mono leading-relaxed focus:outline-none select-all"
                />
                {copiedSuccess && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg animate-fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? '¡Copiado al portapapeles!' : 'Copied to clipboard!'}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons for 1-Click Sharing */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-[11px] text-gray-400">
                  {lang === 'es'
                    ? 'Listo para publicar con hashtags y llamada a la acción optimizada.'
                    : 'Ready-to-publish post with structured tags and engagement call-to-action.'}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyToClipboard}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#25252E] hover:bg-[#32323D] text-gray-200 flex items-center gap-1.5 transition-all border border-[#3A3A45]"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{copiedSuccess ? (lang === 'es' ? 'Copiado' : 'Copied') : (lang === 'es' ? 'Copiar Texto' : 'Copy Text')}</span>
                  </button>

                  <a
                    href={getLinkedInShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => audioSynth.playClickSound()}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0A66C2] hover:bg-[#084e96] text-white flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={getTwitterShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => audioSynth.playClickSound()}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1D9BF0] hover:bg-[#187ec4] text-white flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>X (Twitter)</span>
                  </a>

                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => audioSynth.playClickSound()}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={handleShareNative}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-sm hover:scale-105"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? 'Compartir' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

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

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  id="btn-trend-share-social-footer"
                  onClick={() => {
                    audioSynth.playClickSound();
                    setIsSocialShareOpen(true);
                    setShareSource('active_trend');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 hover:border-purple-400 transition-all"
                >
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span>{lang === 'es' ? 'Share on Social' : lang === 'pt' ? 'Compartilhar' : 'Share on Social'}</span>
                </button>

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
