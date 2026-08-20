import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  HelpCircle,
  Briefcase,
  ShieldCheck,
  Cpu,
  DollarSign,
  Send,
  Sparkles,
  CheckCircle2,
  X,
  User,
  Building2,
  Mail,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  MessageCircleQuestion,
  Filter
} from 'lucide-react';
import { Language } from '../types';
import { audioSynth } from '../services/audioSynth';

interface ExecutiveFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface ExecutiveQnA {
  id: string;
  role: 'CFO' | 'CTO' | 'CEO' | 'Telecom';
  question: {
    es: string;
    en: string;
    pt: string;
  };
  answer: {
    es: string;
    en: string;
    pt: string;
  };
  highlight: string;
}

interface UserComment {
  id: string;
  author: string;
  role: string;
  organization: string;
  category: 'CFO' | 'CTO' | 'CEO' | 'Telecom' | 'General';
  content: string;
  date: string;
  likes: number;
}

const PRESET_QNA: ExecutiveQnA[] = [
  {
    id: 'cfo-obsolescence',
    role: 'CFO',
    question: {
      es: '¿Comprar hardware no añade riesgos de obsolescencia rápida frente al avance de la IA?',
      en: 'Does buying on-premise hardware introduce rapid obsolescence risks as AI evolves?',
      pt: 'Comprar hardware local não adiciona risco de obsolescência rápida com o avanço da IA?'
    },
    answer: {
      es: 'Los clústeres NVIDIA L40S con 192 GB VRAM y precisión FP8/INT4 están diseñados para arquitecturas de inferencia de 4 a 5 años. Dado que el clúster alcanza su punto de equilibrio en solo 3.4 meses (o 2.38 meses con el escudo fiscal MACRS), los siguientes 32 meses operan con costo marginal cero. Incluso si renuevas al 3er año, la empresa habrá ahorrado más de $130,000 USD netos.',
      en: 'NVIDIA L40S clusters with 192 GB VRAM and FP8/INT4 support are built for 4-to-5 year inference cycles. Because the hardware pays for itself in 3.4 months (2.38 months net of MACRS tax credits), the remaining 32 months run at near-zero marginal cost, netting over $130k USD in savings.',
      pt: 'Os clusters NVIDIA L40S com 192 GB VRAM e FP8/INT4 foram projetados para ciclos de 4 a 5 anos. Com payback em 3.4 meses (2.38 meses com crédito fiscal MACRS), os 32 meses restantes operam com custo marginal zero, gerando economia líquida acima de $130k USD.'
    },
    highlight: 'Payback 3.4 Meses • $130k USD Ahorro Neto'
  },
  {
    id: 'cfo-hidden-costs',
    role: 'CFO',
    question: {
      es: '¿Qué costos ocultos de operación (OPEX local como energía y datacenter) estamos asumiendo?',
      en: 'What hidden operational costs (PUE, datacenter power, cooling) are we assuming?',
      pt: 'Quais custos ocultos de operação (energia, PUE e datacenter) estamos assumindo?'
    },
    answer: {
      es: 'El modelo calcula explícitamente un PUE de 1.25 a $0.12 USD/kWh, mantenimiento de datacenter y conectividad redundante, totalizando aprox. $900 USD mensuales. Aun sumando este gasto, el costo mensual local es 16 veces menor que una factura de nube de $15,000 USD/mes.',
      en: 'Our financial model budgets a 1.25 PUE at $0.12/kWh plus datacenter maintenance, totaling ~$900 USD/mo. Even with OPEX included, on-premise operation remains 16x cheaper than a $15,000 USD/month cloud invoice.',
      pt: 'O modelo orça explicitamente PUE de 1.25 a $0.12/kWh e manutenção de datacenter (~$900 USD/mês). Mesmo com OPEX, o custo é 16 vezes menor que uma fatura de nuvem de $15.000 USD/mês.'
    },
    highlight: 'PUE 1.25 ($900/mo) vs $15,000/mo Cloud'
  },
  {
    id: 'cfo-balance-sheet',
    role: 'CFO',
    question: {
      es: '¿Cómo impacta esta adquisición en el balance general y el EBITDA?',
      en: 'How does this CAPEX acquisition impact EBITDA and the balance sheet?',
      pt: 'Como essa aquisição em CAPEX impacta o EBITDA e o balanço patrimonial?'
    },
    answer: {
      es: 'El gasto en la nube (OPEX) erosiona directamente el margen EBITDA mes a mes. La adquisición de hardware (CAPEX) entra como activo productivo amortizable y aprovecha depreciación acelerada MACRS a 5 años ($14,400 USD de crédito fiscal), mejorando la valoración patrimonial.',
      en: 'Cloud OPEX directly erodes monthly EBITDA. In contrast, hardware CAPEX enters the balance sheet as an amortizable capital asset eligible for 5-year MACRS accelerated depreciation ($14,400 tax equity).',
      pt: 'O gasto em nuvem (OPEX) drena diretamente o EBITDA mensal. O CAPEX em hardware entra no balanço como ativo produtivo com depreciação acelerada MACRS ($14.400 USD em créditos fiscais).'
    },
    highlight: 'EBITDA Blindado • $14.4k USD Escudo Fiscal'
  },
  {
    id: 'cto-mlops-staff',
    role: 'CTO',
    question: {
      es: '¿Mi equipo de ingeniería necesitará contratar personal extra de MLOps para administrar este clúster?',
      en: 'Will our engineering team need to hire extra MLOps engineers to manage this cluster?',
      pt: 'Nossa equipe precisará contratar especialistas extras de MLOps para operar o cluster?'
    },
    answer: {
      es: 'No. Los servidores modernos usan stacks contenerizados (Docker, Kubernetes, vLLM y Triton Inference Server) con despliegue de modelos en un clic. La gestión equivale a un clúster estándar de aplicaciones web, con garantías OEM 24/7 de Dell/HPE/Supermicro con NVIDIA.',
      en: 'No. Modern inference deployments leverage containerized stacks (Docker, Kubernetes, vLLM, Triton) with 1-click model orchestrations. Administrative overhead is identical to standard web clusters, backed by 24/7 OEM hardware support.',
      pt: 'Não. Servidores modernos utilizam stacks conteinerizados (Docker, vLLM, Triton) com implantação em um clique. A gestão é idêntica a clusters web normais, com suporte OEM de hardware 24/7.'
    },
    highlight: 'Stack vLLM Contenerizado • Sin Cargas MLOps'
  },
  {
    id: 'cto-traffic-spikes',
    role: 'CTO',
    question: {
      es: '¿Qué sucede si nuestra demanda tiene picos imprevistos que superen la capacidad del servidor?',
      en: 'What happens if unpredictable traffic spikes exceed our on-premise hardware capacity?',
      pt: 'O que acontece se picos imprevisíveis excederem a capacidade do servidor local?'
    },
    answer: {
      es: 'Para eso se implementa la Arquitectura Híbrida 90/10: el servidor local procesa el 90% de la carga base a costo fijo, y un router inteligente desvía de forma transparente el 10% de picos volátiles a APIs de nube. Se garantiza 100% de disponibilidad conservando el 78% del ahorro.',
      en: 'The Hybrid 90/10 architecture routes 90% base load to predictable local GPUs while bursting the volatile 10% overflow elastically to cloud endpoints. This maintains 100% uptime with 78% net savings.',
      pt: 'A Arquitetura Híbrida 90/10 absorve 90% da carga base no hardware local e direciona apenas 10% de picos elásticos para a nuvem, garantindo 100% de disponibilidade com 78% de economia.'
    },
    highlight: 'Arquitectura Híbrida 90/10 • Cero Downtime'
  },
  {
    id: 'cto-open-weights',
    role: 'CTO',
    question: {
      es: '¿Los modelos abiertos (Open Weights) igualan la calidad de las APIs propietarias de nube?',
      en: 'Do open-weight models match the quality and precision of proprietary closed APIs?',
      pt: 'Modelos abertos (Open Weights) alcançam a precisão de APIs proprietárias na nuvem?'
    },
    answer: {
      es: 'Modelos como Llama 3.3 70B, DeepSeek-V3 y Qwen 2.5 igualan o superan a modelos cerrados en tareas empresariales de RAG, extracción y análisis. Además, al ejecutarse localmente permiten fine-tuning LoRA con jerga interna sin exponer datos a terceros.',
      en: 'Llama 3.3 70B, DeepSeek-V3, and Qwen 2.5 match or outperform proprietary models in enterprise RAG and extraction. Running locally also enables proprietary LoRA fine-tuning without third-party data leakage.',
      pt: 'Modelos como Llama 3.3 70B, DeepSeek-V3 e Qwen 2.5 igualam modelos proprietários em RAG e análise corporativa, permitindo fine-tuning LoRA com segurança total de dados.'
    },
    highlight: 'Llama 3.3 / DeepSeek • LoRA Especializado'
  },
  {
    id: 'ceo-sovereignty',
    role: 'CEO',
    question: {
      es: '¿Por qué deberíamos liderar esta transición hacia la soberanía de IA ahora mismo?',
      en: 'Why should executive leadership prioritize AI sovereignty and on-premise infrastructure now?',
      pt: 'Por que a liderança executiva deve priorizar a soberania de IA agora?'
    },
    answer: {
      es: 'Depender 100% de APIs públicas genera riesgo de vendor lock-in, cambios de tarifas y filtración de secretos industriales. Construir infraestructura soberana protege márgenes de rentabilidad, asegura cumplimiento estricto (GDPR/Telecom) y otorga una ventaja competitiva permanente.',
      en: 'Full public cloud reliance creates vendor lock-in, recurring cost inflation, and IP leakage risks. Sovereign computing protects gross margins, ensures regulatory compliance, and establishes permanent competitive moats.',
      pt: 'Depender 100% da nuvem pública cria dependência de fornecedores e vazamento de IP. A infraestrutura soberana blinda margens brutas, garante conformidade regulatória e gera vantagens competitivas.'
    },
    highlight: 'Soberanía de Datos • Ventaja Competitiva'
  }
];

const INITIAL_COMMENTS: UserComment[] = [
  {
    id: 'comm-1',
    author: 'Lic. Rodrigo Méndez',
    role: 'Chief Financial Officer',
    organization: 'FinTech América Central',
    category: 'CFO',
    content: 'La modelación del escudo fiscal MACRS a 5 años y el payback de 3.4 meses resuelve exactamente la discusión que teníamos en el comité de inversiones sobre el gasto descontrolado en OpenAI.',
    date: 'Hace 2 días',
    likes: 14
  },
  {
    id: 'comm-2',
    author: 'Ing. Carlos Valencia',
    role: 'VP de Infraestructura & Redes',
    organization: 'Operador Telecom Tier 2',
    category: 'Telecom',
    content: 'Confirmamos la reducción de latencia: bajar de 480ms a 28ms en inferencia de telemetría de fibra óptica permite aplicar acciones automáticas de mitigación de churn antes de que el suscriptor llame al call center.',
    date: 'Hace 3 días',
    likes: 19
  },
  {
    id: 'comm-3',
    author: 'Elena Rossi',
    role: 'Managing Partner',
    organization: 'Tech Venture Advisory',
    category: 'CEO',
    content: 'La estrategia híbrida 90/10 es la recomendación más sensata para scale-ups B2B que quieren proteger su margen bruto previo a una ronda de financiamiento Serie B.',
    date: 'Hace 5 días',
    likes: 11
  }
];

export const ExecutiveFeedbackModal: React.FC<ExecutiveFeedbackModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'qna' | 'comments' | 'submit'>('qna');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CFO' | 'CTO' | 'CEO'>('ALL');
  const [expandedQna, setExpandedQna] = useState<string | null>('cfo-obsolescence');
  
  // Comments state with localStorage persistence
  const [comments, setComments] = useState<UserComment[]>(() => {
    try {
      const saved = localStorage.getItem('kboxhubia_executive_comments');
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  // New comment form state
  const [formAuthor, setFormAuthor] = useState('');
  const [formRole, setFormRole] = useState('Chief Financial Officer (CFO)');
  const [formOrg, setFormOrg] = useState('');
  const [formCategory, setFormCategory] = useState<'CFO' | 'CTO' | 'CEO' | 'Telecom' | 'General'>('CFO');
  const [formContent, setFormContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kboxhubia_executive_comments', JSON.stringify(comments));
    } catch (err) {
      console.error('Error saving comments to localStorage:', err);
    }
  }, [comments]);

  if (!isOpen) return null;

  const filteredQna = roleFilter === 'ALL'
    ? PRESET_QNA
    : PRESET_QNA.filter(q => q.role === roleFilter);

  const handleLikeComment = (id: string) => {
    audioSynth.playClickSound();
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor.trim() || !formContent.trim()) return;

    audioSynth.playAlertChime();
    const newComment: UserComment = {
      id: `comm-${Date.now()}`,
      author: formAuthor.trim(),
      role: formRole.trim(),
      organization: formOrg.trim() || 'Empresa Confidencial',
      category: formCategory,
      content: formContent.trim(),
      date: lang === 'es' ? 'Reciente' : lang === 'pt' ? 'Recente' : 'Just now',
      likes: 1
    };

    setComments(prev => [newComment, ...prev]);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormContent('');
      setActiveTab('comments');
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-5xl bg-[#0E0E10] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#141416]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {lang === 'es'
                      ? 'Foro Ejecutivo & Preguntas Clave C-Suite'
                      : lang === 'pt'
                      ? 'Fórum Executivo & Perguntas C-Suite'
                      : 'Executive Forum & C-Suite Strategic Q&A'}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    CEO • CFO • CTO
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {lang === 'es'
                    ? 'Respuestas a objeciones estratégicas, análisis de TCO y canal directo de consulta con el Ing. Jorge Huerta'
                    : lang === 'pt'
                    ? 'Respostas a objeções estratégicas, análise de TCO e canal direto com o Eng. Jorge Huerta'
                    : 'Strategic objection handling, TCO analysis, and direct executive advisory channel'}
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

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between px-6 py-2.5 bg-[#101012] border-b border-[#27272A]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  audioSynth.playClickSound();
                  setActiveTab('qna');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'qna'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-[#1C1C20]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  {lang === 'es' ? 'Preguntas Críticas C-Suite' : lang === 'pt' ? 'Perguntas Críticas C-Suite' : 'C-Suite Strategic Q&A'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px] font-mono">
                  {PRESET_QNA.length}
                </span>
              </button>

              <button
                onClick={() => {
                  audioSynth.playClickSound();
                  setActiveTab('comments');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'comments'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-[#1C1C20]'
                }`}
              >
                <MessageCircleQuestion className="w-3.5 h-3.5" />
                <span>
                  {lang === 'es' ? 'Comentarios de Directores' : lang === 'pt' ? 'Comentários de Diretores' : 'Executive Feedback'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px] font-mono">
                  {comments.length}
                </span>
              </button>

              <button
                onClick={() => {
                  audioSynth.playClickSound();
                  setActiveTab('submit');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'submit'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-cyan-400 hover:bg-cyan-950/40 border border-cyan-500/30'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {lang === 'es' ? 'Enviar Pregunta / Consulta' : lang === 'pt' ? 'Enviar Pergunta / Consulta' : 'Submit Scenario / Query'}
                </span>
              </button>
            </div>

            {/* Role Filter for Q&A */}
            {activeTab === 'qna' && (
              <div className="hidden sm:flex items-center gap-1 bg-[#18181B] p-1 rounded-lg border border-[#2E2E32]">
                {(['ALL', 'CFO', 'CTO', 'CEO'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      audioSynth.playClickSound();
                      setRoleFilter(role);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                      roleFilter === role
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-500/40'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {role === 'ALL' ? (lang === 'es' ? 'Todos' : 'All') : role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modal Body Container */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#0A0A0C]">
            {/* TAB 1: C-SUITE PRESET Q&A */}
            {activeTab === 'qna' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {lang === 'es'
                      ? 'Guía de argumentación ejecutiva fundamentada en modelos financieros y técnicos determinísticos.'
                      : lang === 'pt'
                      ? 'Guia de argumentação executiva fundamentada em modelos financeiros e técnicos determinísticos.'
                      : 'Executive argument matrix grounded in deterministic technical and financial models.'}
                  </span>
                  <a
                    href="mailto:kuboxhubia@gmail.com?subject=Consulta%20C-Suite%20Auditoria%20TCO%20IA"
                    className="text-amber-400 hover:underline font-bold font-mono text-[11px] shrink-0 ml-3"
                  >
                    kuboxhubia@gmail.com →
                  </a>
                </div>

                <div className="space-y-3">
                  {filteredQna.map((item) => {
                    const isExpanded = expandedQna === item.id;
                    const roleBadgeColor =
                      item.role === 'CFO'
                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
                        : item.role === 'CTO'
                        ? 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
                        : 'text-amber-400 border-amber-500/40 bg-amber-950/40';

                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border transition-all overflow-hidden ${
                          isExpanded
                            ? 'bg-[#121216] border-amber-500/50 shadow-lg'
                            : 'bg-[#101014] border-[#222226] hover:border-gray-700'
                        }`}
                      >
                        <button
                          onClick={() => {
                            audioSynth.playClickSound();
                            setExpandedQna(isExpanded ? null : item.id);
                          }}
                          className="w-full text-left p-4 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded-md border ${roleBadgeColor}`}>
                              {item.role}
                            </span>
                            <span className="text-sm font-bold text-gray-100">
                              {item.question[lang]}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="hidden md:inline-block text-[11px] font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-700/40">
                              {item.highlight}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 border-t border-[#1F1F24] text-xs text-gray-300 leading-relaxed bg-[#0B0B0E]/80">
                            <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80 font-sans text-gray-200">
                              <p className="whitespace-pre-line">{item.answer[lang]}</p>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-slate-900">
                              <span>Fuente: Auditoría TCO Ing. Jorge Huerta • Kboxhubia</span>
                              <span className="font-mono text-cyan-400">Verificado para Q3/Q4 2026</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: DIRECTOR COMMENTS & FEEDBACK */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#222226]">
                  <span className="text-xs text-gray-400">
                    {lang === 'es'
                      ? 'Opiniones y validaciones de directivos de finanzas y tecnología'
                      : lang === 'pt'
                      ? 'Opiniões e validações de executivos de finanças e tecnologia'
                      : 'Peer reviews and validations from finance and technology directors'}
                  </span>
                  <button
                    onClick={() => {
                      audioSynth.playClickSound();
                      setActiveTab('submit');
                    }}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>{lang === 'es' ? '+ Agregar Comentario' : '+ Add Feedback'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {comments.map((comm) => (
                    <div
                      key={comm.id}
                      className="p-4 rounded-xl bg-[#111115] border border-[#24242A] hover:border-amber-500/30 flex flex-col justify-between transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-xs">
                              {comm.author.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">{comm.author}</div>
                              <div className="text-[10px] text-gray-400">{comm.role} • {comm.organization}</div>
                            </div>
                          </div>
                          <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            {comm.category}
                          </span>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed pt-1">
                          "{comm.content}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1C1C22] text-[11px] text-gray-400">
                        <span>{comm.date}</span>
                        <button
                          onClick={() => handleLikeComment(comm.id)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-gray-300 hover:text-amber-400 transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span className="font-mono text-[10px]">{comm.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SUBMIT SCENARIO / QUERY FORM */}
            {activeTab === 'submit' && (
              <div className="max-w-2xl mx-auto space-y-4">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-3"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h4 className="text-lg font-bold text-white">
                      {lang === 'es' ? '¡Consulta Registrada con Éxito!' : 'Scenario Successfully Submitted!'}
                    </h4>
                    <p className="text-xs text-gray-300">
                      {lang === 'es'
                        ? 'Tu comentario ha sido guardado localmente y el equipo del Ing. Jorge Huerta revisará los parámetros de tu caso de uso.'
                        : 'Your query has been logged and the advisory team will review your infrastructure parameters.'}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {lang === 'es' ? 'Formulario de Consulta Estratégica' : 'Executive Advisory Submission'}
                      </span>
                      <p className="text-gray-400">
                        {lang === 'es'
                          ? 'Envía tus dudas sobre CAPEX, dimensionamiento de VRAM, requerimientos de latencia o telecomunicaciones.'
                          : 'Submit your specific inquiries regarding CAPEX, VRAM sizing, latency constraints, or telecom churn.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-1">
                          {lang === 'es' ? 'Nombre Completo y Título' : 'Full Name & Title'} *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Lic. Mariana Soto"
                          value={formAuthor}
                          onChange={(e) => setFormAuthor(e.target.value)}
                          className="w-full bg-[#141418] border border-[#2D2D35] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-1">
                          {lang === 'es' ? 'Empresa u Organización' : 'Company / Organization'}
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Banco / ISP Regional"
                          value={formOrg}
                          onChange={(e) => setFormOrg(e.target.value)}
                          className="w-full bg-[#141418] border border-[#2D2D35] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-1">
                          {lang === 'es' ? 'Rol Ejecutivo' : 'Executive Role'}
                        </label>
                        <select
                          value={formRole}
                          onChange={(e) => setFormRole(e.target.value)}
                          className="w-full bg-[#141418] border border-[#2D2D35] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="Chief Financial Officer (CFO)">Chief Financial Officer (CFO)</option>
                          <option value="Chief Technology Officer (CTO)">Chief Technology Officer (CTO)</option>
                          <option value="Chief Executive Officer (CEO)">Chief Executive Officer (CEO)</option>
                          <option value="VP de Infraestructura & TI">VP de Infraestructura & TI</option>
                          <option value="Director de Finanzas">Director de Finanzas</option>
                          <option value="Inversionista / Board Member">Inversionista / Board Member</option>
                          <option value="Otro Ejecutivo">Otro Rol</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-1">
                          {lang === 'es' ? 'Categoría de la Consulta' : 'Query Category'}
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value as any)}
                          className="w-full bg-[#141418] border border-[#2D2D35] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="CFO">Finanzas & TCO (CFO)</option>
                          <option value="CTO">Arquitectura & Hardware (CTO)</option>
                          <option value="CEO">Estrategia & Soberanía (CEO)</option>
                          <option value="Telecom">Telecomunicaciones & ISP</option>
                          <option value="General">General / Diagnóstico 48h</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">
                        {lang === 'es' ? 'Detalle de la Pregunta o Escenario Financiero' : 'Inquiry / Scenario Details'} *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder={lang === 'es' ? 'Describe tu gasto actual en APIs de nube, volumen de tokens o requerimiento de cluster...' : 'Describe your current cloud API spend, token volumes, or GPU cluster requirements...'}
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        className="w-full bg-[#141418] border border-[#2D2D35] rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <a
                        href="mailto:kuboxhubia@gmail.com"
                        className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span>kuboxhubia@gmail.com</span>
                      </a>

                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-900/30 active:scale-95 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{lang === 'es' ? 'Publicar Consulta Ejecutiva' : 'Submit Executive Query'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
