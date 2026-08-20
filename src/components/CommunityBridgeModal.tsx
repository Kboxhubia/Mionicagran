import React, { useState, useRef } from 'react';
import {
  X,
  Radio,
  Send,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  Bot,
  Layers,
  Clock,
  CheckCircle2,
  Database,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Flame,
  FileText,
  Headphones,
  LifeBuoy,
  UserCheck,
  UserPlus,
  Save,
  RotateCcw,
  Sliders,
  Settings,
  Smile
} from 'lucide-react';
import {
  WhatsAppBroadcastItem,
  InboundWhatsAppQuery,
  BridgeTelemetryStats,
  BroadcastScheduleConfig,
  KnowledgeItem,
  WelcomeMessageConfig,
  WelcomePreset
} from '../types/communityTypes';
import {
  communityBridgeService,
  WELCOME_PRESETS,
  PLATFORM_PUBLIC_URL
} from '../services/communityBridgeService';
import {
  ADMIN_PHONE_NUMBER,
  WHATSAPP_GROUP_NAME,
  WHATSAPP_DIRECT_LINK,
  ALL_15_RESEARCH_TOPICS,
  MONEY_FARM_TRENDS
} from '../data/communityData';
import { agentEngine } from '../services/agentEngine';
import { audioSynth } from '../services/audioSynth';

interface CommunityBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'es' | 'en' | 'pt';
}

export const CommunityBridgeModal: React.FC<CommunityBridgeModalProps> = ({
  isOpen,
  onClose,
  lang = 'es'
}) => {
  const [activeTab, setActiveTab] = useState<'outbound' | 'inbound' | 'welcome_config' | 'schedules' | 'synaptic_loop'>('outbound');
  
  // Bridge State
  const [broadcasts, setBroadcasts] = useState<WhatsAppBroadcastItem[]>(() => communityBridgeService.getBroadcasts());
  const [inboundQueries, setInboundQueries] = useState<InboundWhatsAppQuery[]>(() => communityBridgeService.getInboundQueries());
  const [schedules, setSchedules] = useState<BroadcastScheduleConfig[]>(() => communityBridgeService.getSchedules());
  const [telemetry, setTelemetry] = useState<BridgeTelemetryStats>(() => communityBridgeService.getTelemetry());

  // Welcome Message Configuration State
  const [welcomeConfig, setWelcomeConfig] = useState<WelcomeMessageConfig>(() => communityBridgeService.getWelcomeConfig());
  const [welcomeTemplateInput, setWelcomeTemplateInput] = useState<string>(() => communityBridgeService.getWelcomeConfig().template);
  const [previewUserName, setPreviewUserName] = useState<string>('Ing. Carlos Mendoza (CTO FibraNet)');
  const [welcomeSavedToast, setWelcomeSavedToast] = useState<boolean>(false);
  const [welcomeNotification, setWelcomeNotification] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Inbound Parsing Input State
  const [rawInput, setRawInput] = useState<string>('');
  const [isProcessingInput, setIsProcessingInput] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [simulatingStep, setSimulatingStep] = useState<string | null>(null);

  // Generator Selectors
  const [selectedTopicId, setSelectedTopicId] = useState<string>(ALL_15_RESEARCH_TOPICS[0].id);
  const [selectedTrendNumber, setSelectedTrendNumber] = useState<number>(1);
  const [selectedSupportTopic, setSelectedSupportTopic] = useState<string>('cluster_sizing');

  const validLang: 'es' | 'en' | 'pt' = lang === 'pt' ? 'pt' : lang === 'en' ? 'en' : 'es';

  // Function to build pre-filled wa.me URL for prospective clients
  const getWhatsAppSupportUrl = (supportType?: string) => {
    const cleanPhone = ADMIN_PHONE_NUMBER.replace(/[^0-9]/g, '');
    let customSubject = '';
    
    if (supportType === 'roi_audit') {
      customSubject = validLang === 'en' 
        ? 'Financial ROI & CAPEX/OPEX Amortization Audit (On-Premises vs Cloud)' 
        : validLang === 'pt' 
        ? 'Auditoria de ROI Financeiro e Amortização CAPEX/OPEX (On-Premises vs Cloud)'
        : 'Auditoría de ROI Financiero y Amortización CAPEX/OPEX (On-Premises vs Cloud)';
    } else if (supportType === 'hardware_procurement') {
      customSubject = validLang === 'en'
        ? 'Enterprise GPU Procurement & Server Sizing (4x L40S / H100)'
        : validLang === 'pt'
        ? 'Aquisição de GPUs Corporativas e Dimensionamento de Servidores (4x L40S / H100)'
        : 'Adquisición de GPUs Empresariales y Dimensionamiento de Servidores (4x L40S / H100)';
    } else if (supportType === 'multi_agent_rag') {
      customSubject = validLang === 'en'
        ? 'Multi-Agent Autonomous Orchestration & Local RAG Architecture'
        : validLang === 'pt'
        ? 'Orquestração Autônoma Multi-Agente e Arquitetura RAG Local'
        : 'Orquestación Autónoma Multi-Agente y Arquitectura RAG Local';
    } else {
      customSubject = validLang === 'en'
        ? 'Executive Advisory & Custom AI Infrastructure Deployment'
        : validLang === 'pt'
        ? 'Assessoria Executiva e Implantação de Infraestrutura de IA Personalizada'
        : 'Asesoría Ejecutiva e Implementación de Infraestructura de IA a Medida';
    }

    let message = '';
    if (validLang === 'en') {
      message = `Hello Ing. Jorge Huerta & Kuboxhubia Team,\n\nI am contacting you from the Kbox Platform regarding *${customSubject}*.\n\nOur organization is evaluating an AI infrastructure transition and would like to request executive support, schedule a technical consultation, and discuss custom deployment specifications.\n\nLooking forward to your response.`;
    } else if (validLang === 'pt') {
      message = `Olá Ing. Jorge Huerta e Equipe Kuboxhubia,\n\nEstou entrando em contato através da Plataforma Kbox sobre *${customSubject}*.\n\nNossa organização está avaliando a transição para infraestrutura de IA e gostaríamos de solicitar suporte executivo, agendar uma consultoria técnica e discutir especificações de implantação.\n\nAguardo seu retorno.`;
    } else {
      message = `Hola Ing. Jorge Huerta y Equipo Kuboxhubia,\n\nMe pongo en contacto a través de la Plataforma Kbox respecto a *${customSubject}*.\n\nNuestra organización está evaluando la transición hacia infraestructura de IA On-Premises/Híbrida y deseamos solicitar soporte ejecutivo, agendar una sesión de consultoría técnica y revisar especificaciones a la medida.\n\nQuedo atento a su respuesta.`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  if (!isOpen) return null;

  const refreshAll = () => {
    setBroadcasts(communityBridgeService.getBroadcasts());
    setInboundQueries(communityBridgeService.getInboundQueries());
    setSchedules(communityBridgeService.getSchedules());
    setTelemetry(communityBridgeService.getTelemetry());
    setWelcomeConfig(communityBridgeService.getWelcomeConfig());
  };

  const handleCopyMessage = (id: string, text: string) => {
    audioSynth.playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Welcome Message Automation Handlers
  const handleSaveWelcomeConfig = () => {
    audioSynth.playTone(880, 0.15, 'sine', 0.1);
    const updated = communityBridgeService.updateWelcomeConfig({
      template: welcomeTemplateInput,
      enabled: welcomeConfig.enabled,
      autoCopyOnJoin: welcomeConfig.autoCopyOnJoin
    });
    setWelcomeConfig(updated);
    setWelcomeSavedToast(true);
    setTimeout(() => setWelcomeSavedToast(false), 3000);
  };

  const handleApplyWelcomePreset = (presetId: string) => {
    audioSynth.playClickSound();
    const updated = communityBridgeService.applyWelcomePreset(presetId);
    setWelcomeConfig(updated);
    setWelcomeTemplateInput(updated.template);
    setWelcomeNotification(`Plantilla aplicada: ${WELCOME_PRESETS.find(p => p.id === presetId)?.name}`);
    setTimeout(() => setWelcomeNotification(null), 3500);
  };

  const handleResetWelcomeToDefault = () => {
    audioSynth.playClickSound();
    const updated = communityBridgeService.resetWelcomeConfig();
    setWelcomeConfig(updated);
    setWelcomeTemplateInput(updated.template);
    setWelcomeNotification('Configuración de bienvenida restaurada al valor predeterminado');
    setTimeout(() => setWelcomeNotification(null), 3500);
  };

  const handleInsertVariable = (varKey: string) => {
    audioSynth.playClickSound();
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = welcomeTemplateInput;
      const newText = currentText.substring(0, start) + varKey + currentText.substring(end);
      setWelcomeTemplateInput(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + varKey.length, start + varKey.length);
      }, 50);
    } else {
      setWelcomeTemplateInput(prev => `${prev} ${varKey}`);
    }
  };

  const handleCopyWelcomePreview = () => {
    audioSynth.playClickSound();
    const formatted = communityBridgeService.formatWelcomeMessage(welcomeTemplateInput, {
      '{userName}': previewUserName || 'Nuevo Miembro'
    });
    navigator.clipboard.writeText(formatted);
    setWelcomeNotification('📋 ¡Mensaje de bienvenida formateado copiado al portapapeles! Listo para pegar en WhatsApp.');
    setTimeout(() => setWelcomeNotification(null), 4000);
  };

  const handleSimulateUserJoin = () => {
    audioSynth.playAlertChime();
    const res = communityBridgeService.handleUserJoinWhatsApp(previewUserName);
    refreshAll();
    setWelcomeNotification(
      `🎉 ¡Simulación exitosa! Nuevo usuario (${previewUserName || 'Nuevo Miembro'}) ingresó vía enlace. Mensaje de bienvenida copiado automáticamente al portapapeles.`
    );
    setTimeout(() => setWelcomeNotification(null), 5000);
  };

  const handleGroupJoinClick = () => {
    audioSynth.playClickSound();
    const res = communityBridgeService.handleUserJoinWhatsApp();
    refreshAll();
    if (res.copiedToClipboard) {
      setWelcomeNotification('📋 Mensaje de bienvenida oficial copiado automáticamente al portapapeles para recibir a nuevos miembros.');
      setTimeout(() => setWelcomeNotification(null), 4000);
    }
  };

  const handleDispatchBroadcast = (id: string) => {
    audioSynth.playAlertPulseSound();
    const res = communityBridgeService.dispatchBroadcast(id);
    refreshAll();
    if (res.whatsappUrl) {
      window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGenerateFromTopic = () => {
    audioSynth.playClickSound();
    communityBridgeService.generateTopicBroadcast(selectedTopicId, validLang);
    refreshAll();
  };

  const handleGenerateFromMoneyFarm = () => {
    audioSynth.playClickSound();
    communityBridgeService.generateMoneyFarmBroadcast(selectedTrendNumber, validLang);
    refreshAll();
  };

  const handleToggleSchedule = (id: string) => {
    audioSynth.playClickSound();
    const updated = communityBridgeService.toggleSchedule(id);
    setSchedules(updated);
  };

  const handleParseRawInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInput.trim() || isProcessingInput) return;

    setIsProcessingInput(true);
    audioSynth.playClickSound();

    try {
      await communityBridgeService.parseAndFunnelWhatsAppMessage(rawInput, validLang);
      setRawInput('');
      refreshAll();
      audioSynth.playAlertChime();
    } catch (err) {
      console.error('Error parsing raw message:', err);
    } finally {
      setIsProcessingInput(false);
    }
  };

  const handleSimulateIncoming = async () => {
    if (isProcessingInput) return;
    setIsProcessingInput(true);
    audioSynth.playClickSound();

    setSimulatingStep('1/4: Ingestionando payload desde Webhook de WhatsApp...');
    await new Promise(r => setTimeout(r, 600));
    setSimulatingStep('2/4: Limpieza léxica y clasificación de intención ejecutiva...');
    await new Promise(r => setTimeout(r, 600));
    setSimulatingStep('3/4: Orquestación con Subagentes 1 y 2 (RAG + Web-Scout Gemini)...');
    await new Promise(r => setTimeout(r, 700));
    setSimulatingStep('4/4: Guardando en Base de Conocimiento y formateando respuesta...');

    try {
      const randomIndex = Math.floor(Math.random() * 4);
      await communityBridgeService.simulateIncomingWhatsAppQuestion(randomIndex, validLang);
      refreshAll();
      audioSynth.playAlertChime();
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulatingStep(null);
      setIsProcessingInput(false);
    }
  };

  // Filter Knowledge Base items originating from the bridge
  const allKb = agentEngine.getKnowledgeBase();
  const bridgeKbItems = allKb.filter(k => k.category.includes('WhatsApp') || k.source === 'web_scout_gemini' || k.id.startsWith('kb-wa'));

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#141418] border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden text-gray-200 my-auto flex flex-col max-h-[94vh]">
        
        {/* Top Glowing Synaptic Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500 animate-pulse" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#0E0E12] border-b border-[#24242A] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Kbox Community Bridge
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  WhatsApp Auto-Sync & Learning Loop
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Grupo Oficial: <strong className="text-white">{WHATSAPP_GROUP_NAME}</strong> • Admin: Ing. Jorge Huerta ({ADMIN_PHONE_NUMBER})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Launch Support Button for Prospective Clients */}
            <a
              id="btn-launch-whatsapp-support"
              href={getWhatsAppSupportUrl(selectedSupportTopic)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioSynth.playClickSound()}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black flex items-center gap-1.5 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-emerald-300/40"
              title={
                validLang === 'en'
                  ? 'Launch WhatsApp Support with pre-filled prospective client advisory inquiry'
                  : validLang === 'pt'
                  ? 'Iniciar Suporte WhatsApp com mensagem pré-configurada para clientes potenciais'
                  : 'Lanzar Soporte WhatsApp con mensaje preconfigurado para clientes potenciales'
              }
            >
              <Headphones className="w-4 h-4 text-black animate-bounce" />
              <span className="font-extrabold tracking-tight">
                {validLang === 'en' ? 'Launch Support' : validLang === 'pt' ? 'Iniciar Suporte' : 'Lanzar Soporte'}
              </span>
            </a>

            <a
              href={WHATSAPP_DIRECT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleGroupJoinClick}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#1B1B22] hover:bg-[#25252D] text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-all shadow-sm"
              title="Abrir grupo oficial Kuboxhubia-Mionicagran IA (Copia automáticamente el mensaje de bienvenida al portapapeles)"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">
                {validLang === 'en' ? 'Open Group' : 'Grupo WhatsApp'}
              </span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#232328] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Notification Banner for Clipboard Events */}
        {welcomeNotification && (
          <div className="mx-6 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0E2419] to-teal-950 border border-emerald-400/80 text-emerald-100 text-xs flex items-center justify-between shadow-2xl animate-fade-in gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-xs leading-tight">{welcomeNotification}</span>
            </div>
            <button
              onClick={() => setWelcomeNotification(null)}
              className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/50 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Live Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 bg-[#09090C] border-b border-[#1E1E24] text-xs">
          <div className="p-3 rounded-xl bg-[#111116] border border-[#222228] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Despachos Enviados</span>
              <span className="text-base font-mono font-bold text-emerald-400">{telemetry.totalBroadcastsSent}</span>
            </div>
            <Send className="w-4 h-4 text-emerald-500/60" />
          </div>

          <div className="p-3 rounded-xl bg-[#111116] border border-[#222228] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Bienvenidas Copiadas</span>
              <span className="text-base font-mono font-bold text-emerald-300">{welcomeConfig.welcomeCount || 0}</span>
            </div>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="p-3 rounded-xl bg-[#111116] border border-[#222228] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Preguntas Parseadas</span>
              <span className="text-base font-mono font-bold text-cyan-400">{telemetry.queriesProcessed}</span>
            </div>
            <Bot className="w-4 h-4 text-cyan-500/60" />
          </div>

          <div className="p-3 rounded-xl bg-[#111116] border border-[#222228] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Memoria Aprendida</span>
              <span className="text-base font-mono font-bold text-amber-400">{telemetry.knowledgeItemsLearned} Q&A</span>
            </div>
            <Database className="w-4 h-4 text-amber-500/60" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-[#111115] border-b border-[#232328] flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('outbound')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'outbound'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>📡 Despacho de Tendencias ({broadcasts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('welcome_config')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'welcome_config'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>👋 Bienvenida Automática</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Auto-Copia
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inbound')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'inbound'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>📥 Parser & Funnel IA ({inboundQueries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedules')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'schedules'
                ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>⏰ Programador Cron & Cadencia</span>
          </button>

          <button
            onClick={() => setActiveTab('synaptic_loop')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'synaptic_loop'
                ? 'border-purple-400 text-purple-300 bg-purple-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>🧠 Bucle Sináptico & Memoria RAG ({bridgeKbItems.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: OUTBOUND BROADCAST DISPATCHER */}
          {activeTab === 'outbound' && (
            <div className="space-y-6">
              
              {/* Broadcast Generators Control Bar */}
              <div className="p-5 rounded-3xl bg-[#0D0D10] border border-[#232328] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Generador Autónomo de Despachos Ejecutivos
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Crea boletines formateados con markdown oficial de WhatsApp listos para distribución masiva.
                    </p>
                  </div>
                </div>

                {/* Prospective Client Support & Advisory Launcher Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#121217] to-teal-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {validLang === 'en'
                          ? 'Direct Client Support & Advisory Funnel'
                          : validLang === 'pt'
                          ? 'Canal de Suporte Executivo e Consultoria a Clientes'
                          : 'Canal de Soporte Directo y Consultoría a Clientes'}
                      </h4>
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        wa.me API Direct
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300">
                      {validLang === 'en'
                        ? 'Connects prospective clients with Ing. Jorge Huerta via WhatsApp with customized technical context.'
                        : validLang === 'pt'
                        ? 'Conecta clientes potenciais diretamente com o Ing. Jorge Huerta via WhatsApp com contexto técnico pré-carregado.'
                        : 'Conecta a prospectos y directivos con el Ing. Jorge Huerta vía WhatsApp con contexto técnico pre-cargado.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <select
                      value={selectedSupportTopic}
                      onChange={(e) => setSelectedSupportTopic(e.target.value)}
                      className="bg-[#0A0A0E] border border-[#2B2B33] rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                    >
                      <option value="cluster_sizing">
                        {validLang === 'en' ? 'Cluster Sizing & SVR' : validLang === 'pt' ? 'Dimensionamento de Clúster' : 'Dimensionamiento Clúster'}
                      </option>
                      <option value="roi_audit">
                        {validLang === 'en' ? 'CFO ROI & Amortization' : validLang === 'pt' ? 'Auditoria ROI CFO' : 'Auditoría ROI CFO'}
                      </option>
                      <option value="hardware_procurement">
                        {validLang === 'en' ? '4x L40S / H100 GPU Spec' : validLang === 'pt' ? 'Hardware GPUs L40S' : 'Hardware GPUs L40S'}
                      </option>
                      <option value="multi_agent_rag">
                        {validLang === 'en' ? 'Multi-Agent RAG Stack' : validLang === 'pt' ? 'Stack Multi-Agente' : 'Stack Multi-Agente'}
                      </option>
                    </select>

                    <a
                      href={getWhatsAppSupportUrl(selectedSupportTopic)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => audioSynth.playClickSound()}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 transition-all shadow-md shrink-0 font-mono"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>{validLang === 'en' ? 'Launch Support' : 'Lanzar Soporte'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  
                  {/* Topic Generator */}
                  <div className="p-3.5 rounded-2xl bg-[#141419] border border-[#25252C] space-y-2">
                    <label className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      Generar desde White Paper (15 Temas)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedTopicId}
                        onChange={(e) => setSelectedTopicId(e.target.value)}
                        className="flex-1 bg-[#0D0D10] border border-[#2B2B30] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        {ALL_15_RESEARCH_TOPICS.map((t) => (
                          <option key={t.id} value={t.id}>
                            #{t.topicNumber} - {t.title.es.slice(0, 40)}...
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleGenerateFromTopic}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Crear</span>
                      </button>
                    </div>
                  </div>

                  {/* Money Farm Generator */}
                  <div className="p-3.5 rounded-2xl bg-[#141419] border border-[#25252C] space-y-2">
                    <label className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      Generar desde Granja de Dinero (7 Modelos)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedTrendNumber}
                        onChange={(e) => setSelectedTrendNumber(Number(e.target.value))}
                        className="flex-1 bg-[#0D0D10] border border-[#2B2B30] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        {MONEY_FARM_TRENDS.map((m) => (
                          <option key={m.id} value={m.number}>
                            Modelo #{m.number} - {m.title.es.slice(0, 35)}...
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleGenerateFromMoneyFarm}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Crear</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Broadcasts Queue List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Cola de Despachos & Historial de Difusión ({broadcasts.length})
                </h4>

                <div className="space-y-3">
                  {broadcasts.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-3 hover:border-emerald-500/40 transition-all shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            item.category === 'HardwareTrend'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : item.category === 'MoneyFarm'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-xs font-bold text-white">{item.title}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            item.status === 'dispatched'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/40'
                              : 'bg-amber-950 text-amber-400 border border-amber-700/40'
                          }`}>
                            {item.status === 'dispatched' ? '✓ DESPACHADO' : '⏳ PROGRAMADO'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {item.dispatchedAt || item.scheduleLabel}
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp Preformatted Text Box */}
                      <div className="bg-[#08080A] rounded-xl p-3.5 border border-[#1E1E24] font-mono text-xs text-emerald-200/90 whitespace-pre-line leading-relaxed overflow-x-auto">
                        {item.formattedMessage}
                      </div>

                      {/* Actions Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                          <span>Grupo Destino: <strong className="text-white">{item.targetGroup}</strong></span>
                          <span>•</span>
                          <span>Score de Interés: <strong className="text-amber-400">{item.engagementScore}%</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyMessage(item.id, item.formattedMessage)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1A1A20] hover:bg-[#25252C] text-gray-200 flex items-center gap-1.5 transition-colors border border-[#2B2B32]"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar Texto</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleDispatchBroadcast(item.id)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Despachar a WhatsApp Web</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: AUTOMATED WELCOME MESSAGE CONFIGURATION */}
          {activeTab === 'welcome_config' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Overview Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0c1f17] via-[#0D1512] to-[#0A0D10] border border-emerald-500/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        Configuración de Mensaje de Bienvenida Automático
                      </h3>
                      <p className="text-xs text-emerald-200/80 mt-0.5">
                        Define el mensaje oficial que se copiará al portapapeles en cuanto un nuevo usuario o prospecto haga clic en unirse al grupo de WhatsApp mediante nuestros enlaces.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Auto-Copia al Portapapeles: {welcomeConfig.autoCopyOnJoin ? 'ACTIVA' : 'PAUSADA'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#1C2C24] text-xs">
                  <div className="p-2.5 rounded-xl bg-[#09090C]/60 border border-[#1E2E26] flex items-center justify-between">
                    <span className="text-gray-400">Total Bienvenidas Auto-Copiadas:</span>
                    <strong className="font-mono text-emerald-300 text-sm">{welcomeConfig.welcomeCount || 0}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#09090C]/60 border border-[#1E2E26] flex items-center justify-between">
                    <span className="text-gray-400">Grupo Destino:</span>
                    <strong className="text-white text-xs truncate max-w-[140px]">{WHATSAPP_GROUP_NAME}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#09090C]/60 border border-[#1E2E26] flex items-center justify-between">
                    <span className="text-gray-400">Última Actualización:</span>
                    <strong className="font-mono text-gray-300 text-[11px]">{welcomeConfig.lastUpdated || '2026-08-20'}</strong>
                  </div>
                </div>
              </div>

              {/* Template Presets Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Plantillas Preconfiguradas de Alto Impacto
                  </h4>
                  <span className="text-[11px] text-gray-500">
                    Haz clic en una plantilla para cargarla en el editor
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {WELCOME_PRESETS.map((preset) => {
                    const isSelected = welcomeConfig.selectedPresetId === preset.id;
                    return (
                      <div
                        key={preset.id}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'bg-[#11231B] border-emerald-400 shadow-lg'
                            : 'bg-[#0E0E12] border-[#222228] hover:border-[#353540] hover:bg-[#131318]'
                        }`}
                        onClick={() => handleApplyWelcomePreset(preset.id)}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#18181F] text-amber-300 border border-[#2B2B35]">
                              {preset.category}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-mono">
                                <Check className="w-3 h-3" />
                                ACTIVA
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-white leading-snug">
                            {preset.name}
                          </h5>
                          <p className="text-[11px] text-gray-400 line-clamp-2">
                            {preset.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyWelcomePreset(preset.id);
                          }}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-emerald-500 text-black'
                              : 'bg-[#1A1A22] text-gray-300 hover:bg-[#252530] hover:text-white'
                          }`}
                        >
                          <span>{isSelected ? 'Plantilla en Uso' : 'Cargar Plantilla'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Variables Insertion Bar */}
              <div className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Insertar Variables Dinámicas (Haz clic para agregar al mensaje):
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">Reemplazo en tiempo real</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { key: '{userName}', label: 'Nombre del Miembro / Prospecto', color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' },
                    { key: '{groupName}', label: 'Nombre del Grupo WhatsApp', color: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10' },
                    { key: '{adminName}', label: 'Nombre del Admin (Ing. Jorge Huerta)', color: 'text-amber-300 border-amber-500/30 bg-amber-500/10' },
                    { key: '{adminPhone}', label: 'Teléfono Admin (+58 412-3931011)', color: 'text-purple-300 border-purple-500/30 bg-purple-500/10' },
                    { key: '{platformUrl}', label: 'URL Pública de la Plataforma', color: 'text-blue-300 border-blue-500/30 bg-blue-500/10' },
                    { key: '{date}', label: 'Fecha Actual', color: 'text-rose-300 border-rose-500/30 bg-rose-500/10' }
                  ].map((v) => (
                    <button
                      key={v.key}
                      type="button"
                      onClick={() => handleInsertVariable(v.key)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold border flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${v.color}`}
                      title={`Insertar ${v.label}`}
                    >
                      <span>+</span>
                      <strong>{v.key}</strong>
                      <span className="text-[10px] opacity-75 hidden sm:inline">({v.label})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Dual Column: Editor & Live WhatsApp Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Form & Configuration (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-3xl bg-[#0D0D10] border border-[#232328] space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        Editor de Mensaje de Bienvenida (Formato Markdown WhatsApp)
                      </label>
                      <span className="text-[10px] font-mono text-gray-400">
                        {welcomeTemplateInput.length} caracteres • {welcomeTemplateInput.split('\n').length} líneas
                      </span>
                    </div>

                    <textarea
                      ref={textareaRef}
                      rows={14}
                      value={welcomeTemplateInput}
                      onChange={(e) => setWelcomeTemplateInput(e.target.value)}
                      placeholder="Escribe el mensaje de bienvenida..."
                      className="w-full bg-[#131317] border border-[#2B2B33] rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed shadow-inner resize-y"
                    />

                    {/* Controls & Persistence */}
                    <div className="space-y-3 pt-2 border-t border-[#1C1C22]">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#141419] border border-[#232328]">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            id="chk-auto-copy-join"
                            checked={welcomeConfig.autoCopyOnJoin}
                            onChange={(e) => {
                              const updated = communityBridgeService.updateWelcomeConfig({
                                autoCopyOnJoin: e.target.checked
                              });
                              setWelcomeConfig(updated);
                            }}
                            className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 border-gray-600 bg-gray-700 cursor-pointer"
                          />
                          <label htmlFor="chk-auto-copy-join" className="text-xs text-gray-200 font-semibold cursor-pointer">
                            Copiar automáticamente al portapapeles cuando un usuario haga clic en unirse al grupo desde la web
                          </label>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#141419] border border-[#232328] space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                          <Smile className="w-3.5 h-3.5 text-amber-400" />
                          Nombre o Empresa para Prueba de Previsualización:
                        </label>
                        <input
                          type="text"
                          value={previewUserName}
                          onChange={(e) => setPreviewUserName(e.target.value)}
                          placeholder="Ej: Ing. Carlos Mendoza (CTO FibraNet)"
                          className="w-full bg-[#0D0D10] border border-[#2B2B30] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleResetWelcomeToDefault}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1C1C22] hover:bg-[#25252D] text-gray-300 flex items-center gap-1.5 transition-colors border border-[#2C2C34]"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restablecer Predeterminado</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveWelcomeConfig}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-2 transition-all shadow-md active:scale-95"
                        >
                          {welcomeSavedToast ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-black" />
                              <span>¡Configuración Guardada!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 text-black" />
                              <span>Guardar Configuración</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Column: WhatsApp Real-Time Visual Bubble (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-3xl bg-[#0D0D10] border border-emerald-500/30 space-y-3.5 shadow-xl flex flex-col justify-between">
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-[#232328]">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4 text-emerald-400" />
                          Vista Previa en WhatsApp (Burbuja Real)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          En Vivo
                        </span>
                      </div>

                      {/* WhatsApp Window Container */}
                      <div className="rounded-2xl overflow-hidden border border-[#232D36] bg-[#0B141A] shadow-2xl">
                        
                        {/* WhatsApp Top Chat Header */}
                        <div className="bg-[#1F2C34] p-3 flex items-center gap-2.5 border-b border-[#232D36]">
                          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            KH
                          </div>
                          <div className="min-w-0 flex-1">
                            <h6 className="text-xs font-bold text-white truncate">
                              {WHATSAPP_GROUP_NAME}
                            </h6>
                            <p className="text-[10px] text-gray-400 truncate">
                              Ing. Jorge Huerta, Tú y 184 miembros
                            </p>
                          </div>
                        </div>

                        {/* WhatsApp Chat Canvas Background */}
                        <div className="p-3.5 bg-[#0B141A] min-h-[300px] flex flex-col justify-end space-y-2">
                          
                          {/* System Notification Bubble */}
                          <div className="self-center my-1 px-3 py-1 rounded-lg bg-[#182229] text-gray-300 text-[10px] text-center font-mono border border-[#222E35]">
                            🟢 {previewUserName || 'Nuevo Miembro'} se unió usando el enlace de invitación
                          </div>

                          {/* WhatsApp Welcome Message Bubble */}
                          <div className="self-end max-w-[95%] rounded-2xl rounded-tr-none bg-[#005C4B] p-3 text-xs text-white space-y-2 shadow-md border border-[#02705B]">
                            <div className="flex items-center justify-between gap-2 border-b border-emerald-600/50 pb-1">
                              <span className="text-[11px] font-bold text-[#25D366]">
                                Admin • Ing. Jorge Huerta
                              </span>
                              <span className="text-[9px] font-mono text-emerald-200">
                                {ADMIN_PHONE_NUMBER}
                              </span>
                            </div>

                            <div className="text-[11.5px] leading-relaxed whitespace-pre-wrap font-sans text-gray-100 selection:bg-emerald-300 selection:text-black">
                              {communityBridgeService.formatWelcomeMessage(welcomeTemplateInput, {
                                '{userName}': previewUserName || 'Nuevo Miembro'
                              })}
                            </div>

                            <div className="flex items-center justify-end gap-1 pt-1 text-[10px] text-emerald-200/80 font-mono">
                              <span>10:42 AM</span>
                              <span className="text-[#53bdeb] font-bold tracking-tighter">✓✓</span>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* Interactive Sandbox Test Actions */}
                    <div className="space-y-2.5 pt-2">
                      <button
                        type="button"
                        onClick={handleCopyWelcomePreview}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#1B1B22] hover:bg-[#252530] text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copiar Mensaje Formateado al Portapapeles</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSimulateUserJoin}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>🧪 Simular Entrada de Usuario & Auto-Copia</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: INBOUND QUERY PARSER & KNOWLEDGE FUNNEL */}
          {activeTab === 'inbound' && (
            <div className="space-y-6">
              
              {/* Ingestion Console */}
              <div className="p-5 rounded-3xl bg-[#0D0D10] border border-[#232328] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      Parser de Consultas WhatsApp & Funnel al Cerebro de la Plataforma
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Pega cualquier mensaje o chat exportado del grupo. El puente limpiará la consulta, activará al Agente y guardará el aprendizaje en la base indexada.
                    </p>
                  </div>

                  <button
                    onClick={handleSimulateIncoming}
                    disabled={isProcessingInput}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>⚡ Simular Mensaje Entrante en Vivo</span>
                  </button>
                </div>

                {simulatingStep && (
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 animate-pulse">
                    <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono">{simulatingStep}</span>
                  </div>
                )}

                <form onSubmit={handleParseRawInput} className="space-y-3">
                  <textarea
                    rows={3}
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Pega aquí el texto directo de WhatsApp, ej: [15:20, 19/8/2026] +58 412-1234567: ¿Cómo reducimos el consumo eléctrico en un rack de inferencia?"
                    className="w-full bg-[#141418] border border-[#2B2B30] rounded-2xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isProcessingInput || !rawInput.trim()}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                    >
                      {isProcessingInput ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Parseando y Aprendiendo...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Parsear & Funnel a Base de Conocimiento</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed of Processed Inbound Queries */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Consultas Ingestionadas & Respuestas Verificadas ({inboundQueries.length})
                </h4>

                <div className="space-y-4">
                  {inboundQueries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-[#0D0D10] border border-cyan-500/30 space-y-3.5 shadow-xl"
                    >
                      {/* Header & Sender Meta */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1E1E24]">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {inq.category}
                          </span>
                          <span className="text-xs font-bold text-white">{inq.senderName || inq.senderPhone}</span>
                          <span className="text-[10px] text-gray-500 font-mono">({inq.senderPhone})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ✨ Guardado en Memoria RAG
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">{inq.parsedAt}</span>
                        </div>
                      </div>

                      {/* Clean Extracted Query */}
                      <div>
                        <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">
                          Pregunta Extraída & Clasificación:
                        </span>
                        <p className="text-xs font-bold text-amber-300 bg-[#121216] p-2.5 rounded-xl border border-[#202026]">
                          "{inq.extractedQuery}"
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          Intención Detectada: <strong className="text-white">{inq.detectedIntent}</strong> (Confianza: {(inq.confidenceScore * 100).toFixed(0)}%)
                        </span>
                      </div>

                      {/* Agent Response Generated */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono text-emerald-400 block">
                          Respuesta Verificada por el Agente (Formato WhatsApp):
                        </span>
                        <div className="p-3.5 rounded-xl bg-[#09090C] border border-[#1E1E24] text-xs text-gray-200 leading-relaxed font-mono whitespace-pre-line">
                          {inq.agentResponse}
                        </div>
                      </div>

                      {/* Footer Sources & Reply Button */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-400">
                          <span className="text-gray-500 font-semibold">Fuentes:</span>
                          {inq.sourcesCited.map((src, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-[#18181D] text-cyan-300 border border-[#2A2A32]">
                              {src}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyMessage(inq.id, inq.agentResponse)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1C1C22] hover:bg-[#25252D] text-gray-200 flex items-center gap-1 transition-colors border border-[#2D2D35]"
                          >
                            {copiedId === inq.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>Copiar Respuesta</span>
                          </button>

                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(inq.agentResponse)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 transition-all shadow-md"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Responder en WhatsApp</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CRON SCHEDULES */}
          {activeTab === 'schedules' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-3xl bg-[#0D0D10] border border-[#232328] space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Reglas de Automatización & Cron de Difusión
                </h3>
                <p className="text-xs text-gray-400">
                  Configura la frecuencia de actualización periódica para mantener a la comunidad de WhatsApp activa con las últimas métricas de GPUs, finanzas y papers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedules.map((sch) => (
                  <div
                    key={sch.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      sch.enabled
                        ? 'bg-[#101914] border-emerald-500/50'
                        : 'bg-[#0E0E12] border-[#222228] opacity-70'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1A1A22] text-amber-300 border border-[#333]">
                          {sch.cadenceText}
                        </span>
                        <span className={`text-[10px] font-bold ${sch.enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {sch.enabled ? 'ACTIVO' : 'PAUSADO'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">
                        {sch.name}
                      </h4>

                      <div className="text-xs text-gray-400 space-y-1 pt-1">
                        <div className="flex justify-between text-[11px]">
                          <span>Última Ejecución:</span>
                          <span className="font-mono text-gray-300">{sch.lastRun}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span>Próximo Disparo:</span>
                          <span className="font-mono text-emerald-400">{sch.nextRun}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1F1F26] flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-mono">
                        Canal: WhatsApp WebHook
                      </span>

                      <button
                        onClick={() => handleToggleSchedule(sch.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          sch.enabled
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
                            : 'bg-[#222228] hover:bg-[#2C2C34] text-gray-300'
                        }`}
                      >
                        {sch.enabled ? 'Desactivar Cron' : 'Activar Cron'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: SYNAPTIC LOOP & KNOWLEDGE REINFORCEMENT */}
          {activeTab === 'synaptic_loop' && (
            <div className="space-y-6">
              
              {/* Loop Infographic Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1f17] via-[#091510] to-[#040a08] border border-emerald-500/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Bucle de Retroalimentación Sináptica (WhatsApp ↔ Plataforma)
                    </h3>
                    <p className="text-xs text-emerald-300/80">
                      Arquitectura de auto-aprendizaje continuo bidireccional
                    </p>
                  </div>
                </div>

                {/* 4 Steps Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-[#0D0D10]/80 border border-emerald-500/30 text-xs space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 block">PASO 1</span>
                    <strong className="text-white block">Difusión WhatsApp</strong>
                    <p className="text-gray-400 text-[11px]">La plataforma emite tendencias y papers al grupo oficial.</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0D0D10]/80 border border-cyan-500/30 text-xs space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 block">PASO 2</span>
                    <strong className="text-white block">Consulta del Miembro</strong>
                    <p className="text-gray-400 text-[11px]">Directivos y técnicos formulan objeciones o dudas en el chat.</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0D0D10]/80 border border-amber-500/30 text-xs space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-400 block">PASO 3</span>
                    <strong className="text-white block">Ingestión & Scout</strong>
                    <p className="text-gray-400 text-[11px]">El Subagente investiga y formula la respuesta matemática.</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0D0D10]/80 border border-purple-500/30 text-xs space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-purple-400 block">PASO 4</span>
                    <strong className="text-white block">Memoria Vectorial</strong>
                    <p className="text-gray-400 text-[11px]">El nuevo conocimiento se incorpora a la plataforma permanentemente.</p>
                  </div>
                </div>
              </div>

              {/* List of Knowledge items learned via WhatsApp */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Memoria Indexada Proveniente de la Comunidad ({bridgeKbItems.length})
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Sincronización RAG Activa
                  </span>
                </div>

                <div className="space-y-3">
                  {bridgeKbItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#18181D] text-cyan-300 border border-[#2A2A32]">
                          {item.category} • Fuente: {item.source}
                        </span>
                        <span className="text-gray-500 font-mono text-[10px]">
                          Consultado {item.usageCount} veces • ID: {item.id}
                        </span>
                      </div>

                      <h5 className="font-bold text-amber-300">
                        Q: {item.query}
                      </h5>

                      <p className="text-gray-300 leading-relaxed bg-[#121216] p-3 rounded-xl border border-[#1E1E24]">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
