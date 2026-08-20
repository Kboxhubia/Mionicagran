import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award,
  Lock,
  Search,
  CheckCircle2,
  FileText,
  ExternalLink,
  MessageCircle,
  BarChart3,
  Bot,
  Layers,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ResearchTopic, MoneyFarmTrend } from '../types/communityTypes';
import { MONEY_FARM_TRENDS, ADMIN_PHONE_NUMBER, WHATSAPP_GROUP_NAME, WHATSAPP_DIRECT_LINK, INITIAL_SURVEY_QUESTIONS } from '../data/communityData';
import { agentEngine, AgentQueryResult } from '../services/agentEngine';
import { audioSynth } from '../services/audioSynth';

interface CommunityHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'es' | 'en' | 'pt';
  onOpenAdmin: () => void;
  onOpenCommunityBridge?: () => void;
}

export const CommunityHubModal: React.FC<CommunityHubModalProps> = ({
  isOpen,
  onClose,
  lang = 'es',
  onOpenAdmin,
  onOpenCommunityBridge
}) => {
  const [activeTab, setActiveTab] = useState<'whitepapers' | 'moneyfarm' | 'surveys' | 'agent_qna'>('whitepapers');
  const [selectedTopic, setSelectedTopic] = useState<ResearchTopic | null>(null);
  const [topics, setTopics] = useState<ResearchTopic[]>(() => agentEngine.getTopics().filter(t => t.isPublished));
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Surveys state
  const [surveyResponses, setSurveyResponses] = useState<{ [key: string]: string }>({});
  const [suggestedTopicInput, setSuggestedTopicInput] = useState<string>('');
  const [surveySubmitted, setSurveySubmitted] = useState<boolean>(false);

  // Agent Direct Search State (Knowledge-First Dual Query)
  const [agentQuery, setAgentQuery] = useState<string>('');
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const [agentResult, setAgentResult] = useState<AgentQueryResult | null>(null);

  if (!isOpen) return null;

  const categories = ['Todos', 'Finanzas', 'Telecom', 'MLOps', 'Monetizacion', 'Seguridad', 'Banca'];

  const filteredTopics = topics.filter(t => {
    const matchesCategory = selectedCategory === 'Todos' || t.category === selectedCategory;
    const titleText = t.title[lang] || t.title.es;
    const summaryText = t.summary[lang] || t.summary.es;
    const matchesSearch = !searchQuery || titleText.toLowerCase().includes(searchQuery.toLowerCase()) || summaryText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAskAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentQuery.trim() || agentLoading) return;

    setAgentLoading(true);
    audioSynth.playClickSound();
    try {
      const validLang: 'es' | 'en' | 'pt' = lang === 'pt' ? 'pt' : lang === 'en' ? 'en' : 'es';
      const res = await agentEngine.queryAgentWithDualKnowledge(agentQuery.trim(), validLang);
      setAgentResult(res);
      audioSynth.playClickSound();
    } catch (err) {
      console.error('Agent query error:', err);
    } finally {
      setAgentLoading(false);
    }
  };

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSurveySubmitted(true);
    audioSynth.playSlideTransitionSound();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#141417] border border-[#2B2B30] rounded-3xl shadow-2xl overflow-hidden text-gray-200 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0D0D10] border-b border-[#232328] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Comunidad Kboxhubia & White Papers Científicos
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {topics.length} Temas Autorizados
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Dirección Técnica y Científica: Ing. Jorge Huerta • WhatsApp: {ADMIN_PHONE_NUMBER}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCommunityBridge && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCommunityBridge();
                }}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Bridge</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-[#1F1F24] hover:bg-[#2A2A30] text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#232328] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-[#101013] border-b border-[#232328] flex gap-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('whitepapers'); setSelectedTopic(null); }}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'whitepapers'
                ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>9 White Papers Autorizados (IEEE/arXiv)</span>
          </button>

          <button
            onClick={() => setActiveTab('moneyfarm')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'moneyfarm'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>🌾 Granja de Cultivo de Dinero con IA (7 Modelos)</span>
          </button>

          <button
            onClick={() => setActiveTab('agent_qna')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'agent_qna'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>🧠 Agente Investigador & Base de Conocimiento</span>
          </button>

          <button
            onClick={() => setActiveTab('surveys')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'surveys'
                ? 'border-purple-400 text-purple-300 bg-purple-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Encuestas C-Suite & Proponer Temas</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: WHITEPAPERS SCIENTIFIC REPOSITORY */}
          {activeTab === 'whitepapers' && (
            <div className="space-y-6">
              
              {!selectedTopic ? (
                <>
                  {/* Category Filter & Search Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            selectedCategory === cat
                              ? 'bg-amber-500 text-black font-bold shadow-md'
                              : 'bg-[#18181C] text-gray-400 hover:text-white border border-[#27272A]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="relative min-w-[240px]">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar papers, IEEE, telecom, ROI..."
                        className="w-full bg-[#0D0D10] border border-[#2B2B30] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  {/* Papers Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTopics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopic(topic);
                          audioSynth.playClickSound();
                        }}
                        className="p-5 rounded-2xl bg-[#0D0D10] border border-[#232328] hover:border-amber-500/50 hover:bg-[#121216] transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              Topic #{topic.topicNumber} • {topic.category}
                            </span>
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                              ⭐ {topic.rating} ({topic.readsCount} lecturas)
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                            {topic.title[lang] || topic.title.es}
                          </h4>

                          <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                            {topic.summary[lang] || topic.summary.es}
                          </p>
                        </div>

                        <div className="pt-4 mt-3 border-t border-[#1C1C22] flex items-center justify-between text-xs">
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            Leer Paper Completo
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Selected White Paper Detailed Reading View */
                <div className="space-y-6 bg-[#0E0E12] p-6 sm:p-8 rounded-3xl border border-[#27272C] text-gray-300">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-[#232328]">
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1.5 font-semibold"
                    >
                      ← Volver a la lista de White Papers
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {selectedTopic.category} • Paper #{selectedTopic.topicNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1E1E24] text-gray-400">
                        Modo Freemium: Solo Lectura
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                      {selectedTopic.title[lang] || selectedTopic.title.es}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">
                      Investigador Principal: <strong className="text-white">Ing. Jorge Huerta</strong> • Kboxhubia Autonomous Research Group • 2026
                    </p>
                  </div>

                  {/* Abstract */}
                  <div className="p-4 rounded-2xl bg-[#09090C] border border-[#232328] space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Abstract / Resumen Científico
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      "{selectedTopic.abstract[lang] || selectedTopic.abstract.es}"
                    </p>
                  </div>

                  {/* Methodology */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      Metodología Matemática y de Ingeniería
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {selectedTopic.methodology[lang] || selectedTopic.methodology.es}
                    </p>
                  </div>

                  {/* Sources & Citations */}
                  <div className="p-4 rounded-2xl bg-[#09090C] border border-[#232328] space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Fuentes Verificadas & Normas de Fiel Cumplimiento
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {selectedTopic.sources.map((src, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-gray-300">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#1C1C22] text-amber-300 border border-[#333]">
                            {src.type}
                          </span>
                          <span className="text-[11px] font-mono">{src.citation}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Protected Freemium Notice */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#1A1A22] to-emerald-950/30 border border-amber-500/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-white block">
                          Documento Protegido en Fase Freemium (1 Mes Gratis)
                        </span>
                        <span className="text-gray-400 text-[11px]">
                          La descarga física en PDF y la exportación de datasets estarán reservadas para miembros de la Plataforma Digital.
                        </span>
                      </div>
                    </div>

                    <a
                      href={WHATSAPP_DIRECT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 shrink-0 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Debatir en WhatsApp</span>
                    </a>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 2: GRANJA DE CULTIVO DE DINERO CON IA */}
          {activeTab === 'moneyfarm' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#12241b] via-[#0b1712] to-[#060c09] border border-emerald-500/40 text-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      🌾 Granja de Cultivos de Dinero con IA (Las 7 Tendencias de Monetización)
                    </h3>
                    <p className="text-xs text-emerald-300/80">
                      Modelos comprobados de generación de flujo de caja y rendimiento financiero con Inteligencia Artificial
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MONEY_FARM_TRENDS.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-4 hover:border-emerald-500/40 transition-all shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          Modelo #{item.number}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          ROI: {item.projectedRoi}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">
                        {item.title[lang] || item.title.es}
                      </h4>

                      <p className="text-xs font-semibold text-emerald-400">
                        {item.headline[lang] || item.headline.es}
                      </p>

                      <p className="text-xs text-gray-400 leading-relaxed">
                        {item.description[lang] || item.description.es}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1C1C22] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-500">Capital Requerido:</span>
                        <span className="font-mono font-bold text-white">{item.capitalRequired}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-500">Punto de Retorno:</span>
                        <span className="font-mono font-bold text-emerald-400">{item.timeToProfit}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.techStack.map((tech, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#18181D] text-gray-300 border border-[#2B2B32]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: AGENTE INVESTIGADOR & BASE DE CONOCIMIENTO */}
          {activeTab === 'agent_qna' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-3xl bg-[#0D0D10] border border-[#232328] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Kbox-Director AI: Consulta la Base de Conocimiento o Investiga en Vivo
                    </h3>
                    <p className="text-xs text-gray-400">
                      El agente consulta primero nuestra base local indexada. Si no existe, investiga en internet y guarda el nuevo conocimiento automáticamente.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAskAgent} className="flex gap-2">
                  <input
                    type="text"
                    value={agentQuery}
                    onChange={(e) => setAgentQuery(e.target.value)}
                    placeholder="Haz cualquier pregunta técnica, financiera, sobre GPON, L40S, Churn o ROI..."
                    className="flex-1 bg-[#141418] border border-[#2B2B30] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={agentLoading || !agentQuery.trim()}
                    className="px-5 py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-black flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {agentLoading ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Investigando...
                      </span>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Consultar Agente</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Pre-built Suggestion Pills */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="text-gray-500 mr-1">Preguntas sugeridas:</span>
                  {[
                    '¿Por qué 4x L40S es superior a H100?',
                    '¿Cómo funciona el escudo fiscal MACRS?',
                    '¿Cómo reducir el Churn en fibra óptica con IA?',
                    '¿Cuál es la fórmula del Payback exacto?'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAgentQuery(preset)}
                      className="px-2.5 py-1 rounded-lg bg-[#18181D] hover:bg-[#222228] text-gray-300 border border-[#2B2B32] transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agent Answer Card */}
              {agentResult && (
                <div className="p-6 rounded-3xl bg-[#0E0E12] border border-cyan-500/40 space-y-4 animate-fade-in shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#232328]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {agentResult.subagentUsed}
                      </span>
                      {agentResult.wasLearnedNow && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✨ Guardado en Base de Conocimiento
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-gray-400">
                      Confianza: {(agentResult.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                    {agentResult.answer}
                  </div>

                  <div className="pt-3 border-t border-[#1F1F26] flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-semibold">Fuentes:</span>
                      {agentResult.sourcesCited.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-[#18181D] text-cyan-400 border border-[#2A2A30]">
                          {s}
                        </span>
                      ))}
                    </div>

                    <a
                      href={WHATSAPP_DIRECT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Consultar con Ing. Jorge Huerta
                    </a>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: SURVEYS & CO-CREATION */}
          {activeTab === 'surveys' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              <div className="p-5 rounded-3xl bg-[#0D0D10] border border-[#232328] space-y-2 text-center">
                <h3 className="text-base font-bold text-white">
                  📊 Encuestas Ejecutivas & Solicitud de Nuevos Temas
                </h3>
                <p className="text-xs text-gray-400">
                  Ayúdanos a priorizar los próximos White Papers y análisis matemáticos que desarrollará el equipo técnico.
                </p>
              </div>

              {!surveySubmitted ? (
                <form onSubmit={handleSurveySubmit} className="space-y-6">
                  {INITIAL_SURVEY_QUESTIONS.map((q) => (
                    <div key={q.id} className="p-5 rounded-2xl bg-[#0E0E12] border border-[#232328] space-y-3">
                      <span className="text-xs font-bold text-amber-400 block">
                        {q.question[lang] || q.question.es}
                      </span>

                      <div className="space-y-2">
                        {q.options.map((opt) => (
                          <label
                            key={opt.id}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                              surveyResponses[q.id] === opt.id
                                ? 'bg-amber-500/10 border-amber-500/50 text-white'
                                : 'bg-[#141418] border-[#25252A] text-gray-300 hover:bg-[#1A1A20]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 text-xs">
                              <input
                                type="radio"
                                name={q.id}
                                value={opt.id}
                                checked={surveyResponses[q.id] === opt.id}
                                onChange={() => setSurveyResponses({ ...surveyResponses, [q.id]: opt.id })}
                                className="accent-amber-500"
                              />
                              <span>{opt.label}</span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">
                              {opt.votes} votos
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Suggest a Topic Field */}
                  <div className="p-5 rounded-2xl bg-[#0E0E12] border border-[#232328] space-y-2">
                    <label className="text-xs font-bold text-white block">
                      ¿Qué otro tema técnico o financiero te gustaría que desarrollemos?
                    </label>
                    <textarea
                      rows={3}
                      value={suggestedTopicInput}
                      onChange={(e) => setSuggestedTopicInput(e.target.value)}
                      placeholder="Ej: Análisis de costos de interconexión BGP con IA, modelos para optimización de routers MikroTik..."
                      className="w-full bg-[#141418] border border-[#2B2B30] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enviar Votos y Registrar Sugerencia</span>
                  </button>
                </form>
              ) : (
                <div className="p-8 rounded-3xl bg-[#0E0E12] border border-emerald-500/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    ¡Gracias por tu participación!
                  </h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Tu voto ha sido registrado por el Subagente de Analytics B2B y será evaluado por el Ing. Jorge Huerta para el próximo ciclo de publicaciones.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
