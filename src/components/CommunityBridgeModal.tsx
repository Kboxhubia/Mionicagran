import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import {
  WhatsAppBroadcastItem,
  InboundWhatsAppQuery,
  BridgeTelemetryStats,
  BroadcastScheduleConfig,
  KnowledgeItem
} from '../types/communityTypes';
import {
  communityBridgeService
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
  const [activeTab, setActiveTab] = useState<'outbound' | 'inbound' | 'schedules' | 'synaptic_loop'>('outbound');
  
  // Bridge State
  const [broadcasts, setBroadcasts] = useState<WhatsAppBroadcastItem[]>(() => communityBridgeService.getBroadcasts());
  const [inboundQueries, setInboundQueries] = useState<InboundWhatsAppQuery[]>(() => communityBridgeService.getInboundQueries());
  const [schedules, setSchedules] = useState<BroadcastScheduleConfig[]>(() => communityBridgeService.getSchedules());
  const [telemetry, setTelemetry] = useState<BridgeTelemetryStats>(() => communityBridgeService.getTelemetry());

  // Inbound Parsing Input State
  const [rawInput, setRawInput] = useState<string>('');
  const [isProcessingInput, setIsProcessingInput] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [simulatingStep, setSimulatingStep] = useState<string | null>(null);

  // Generator Selectors
  const [selectedTopicId, setSelectedTopicId] = useState<string>(ALL_15_RESEARCH_TOPICS[0].id);
  const [selectedTrendNumber, setSelectedTrendNumber] = useState<number>(1);

  const validLang: 'es' | 'en' | 'pt' = lang === 'pt' ? 'pt' : lang === 'en' ? 'en' : 'es';

  if (!isOpen) return null;

  const refreshAll = () => {
    setBroadcasts(communityBridgeService.getBroadcasts());
    setInboundQueries(communityBridgeService.getInboundQueries());
    setSchedules(communityBridgeService.getSchedules());
    setTelemetry(communityBridgeService.getTelemetry());
  };

  const handleCopyMessage = (id: string, text: string) => {
    audioSynth.playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
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
            <a
              href={WHATSAPP_DIRECT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Abrir WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#232328] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

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

          <div className="p-3 rounded-xl bg-[#111116] border border-[#222228] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Salud del Puente</span>
              <span className="text-base font-mono font-bold text-purple-400">{telemetry.communityHealthScore}%</span>
            </div>
            <Zap className="w-4 h-4 text-purple-500/60" />
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

          {/* TAB 2: INBOUND QUERY PARSER & KNOWLEDGE FUNNEL */}
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
