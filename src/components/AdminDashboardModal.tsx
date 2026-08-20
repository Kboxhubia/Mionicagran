import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Users,
  CheckSquare,
  Square,
  Database,
  Search,
  Download,
  Flame,
  BarChart,
  Bot,
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  Mail,
  Phone,
  FileSpreadsheet,
  Activity,
  MousePointerClick,
  Trash2,
  Share2,
  Copy,
  Check,
  Linkedin,
  Twitter,
  MessageCircle,
  Megaphone,
  Target,
  ArrowRight,
  ExternalLink,
  Zap,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { agentEngine } from '../services/agentEngine';
import { communityBridgeService } from '../services/communityBridgeService';
import { ActivityHeatmap } from './ActivityHeatmap';
import { ResearchTopic, LeadRecord, KnowledgeItem } from '../types/communityTypes';
import { InteractionLog } from '../types';
import { ADMIN_PHONE_NUMBER, WHATSAPP_GROUP_NAME } from '../data/communityData';
import { PLATFORM_ROADMAP, RoadmapMilestone } from '../data/roadmapData';
import { marketingService, GeneratedMarketingAsset } from '../services/marketingService';
import { audioSynth } from '../services/audioSynth';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'es' | 'en' | 'pt';
  onOpenCommunityBridge?: () => void;
  interactionLogs?: InteractionLog[];
  onClearLogs?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  lang = 'es',
  onOpenCommunityBridge,
  interactionLogs = [],
  onClearLogs
}) => {
  const [activeTab, setActiveTab] = useState<'topics_manager' | 'leads_db' | 'knowledge_store' | 'agent_stats' | 'telemetry_logs' | 'marketing_assets'>('topics_manager');
  const [topics, setTopics] = useState<ResearchTopic[]>(() => agentEngine.getTopics());
  const [leads, setLeads] = useState<LeadRecord[]>(() => agentEngine.getLeads());
  const [kbItems, setKbItems] = useState<KnowledgeItem[]>(() => agentEngine.getKnowledgeBase());
  const [searchLead, setSearchLead] = useState<string>('');
  const [searchLog, setSearchLog] = useState<string>('');
  const [telemetryViewMode, setTelemetryViewMode] = useState<'both' | 'heatmap' | 'logs'>('both');
  const [downloadedToast, setDownloadedToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Marketing Assets & Roadmap AI State
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(PLATFORM_ROADMAP[0].id);
  const [marketingTone, setMarketingTone] = useState<'executive' | 'technical' | 'viral' | 'investor'>('executive');
  const [customMarketingFocus, setCustomMarketingFocus] = useState<string>('');
  const [isGeneratingMarketing, setIsGeneratingMarketing] = useState<boolean>(false);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedMarketingAsset[]>([]);
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);

  // Initialize default marketing assets when modal opens
  useEffect(() => {
    if (isOpen && generatedAssets.length === 0) {
      handleGenerateMarketing(PLATFORM_ROADMAP[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMilestone = PLATFORM_ROADMAP.find(m => m.id === selectedMilestoneId) || PLATFORM_ROADMAP[0];

  const handleGenerateMarketing = async (milestoneToUse?: RoadmapMilestone) => {
    audioSynth.playTone(520, 0.1, 'sine', 0.1);
    setIsGeneratingMarketing(true);
    const targetMilestone = milestoneToUse || currentMilestone;

    try {
      const result = await marketingService.generateAssets({
        milestone: targetMilestone,
        tone: marketingTone,
        language: lang as 'es' | 'en' | 'pt',
        customFocus: customMarketingFocus
      });
      setGeneratedAssets(result.assets || []);
      audioSynth.playTone(880, 0.2, 'sine', 0.1);
    } catch (err) {
      console.error('Error generating marketing assets:', err);
    } finally {
      setIsGeneratingMarketing(false);
    }
  };

  const handleCopyAsset = async (asset: GeneratedMarketingAsset) => {
    audioSynth.playClickSound();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(asset.content);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = asset.content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedAssetId(asset.id);
      setTimeout(() => setCopiedAssetId(null), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const publishedCount = topics.filter(t => t.isPublished).length;

  const handleToggleTopic = (id: string) => {
    audioSynth.playClickSound();
    const updated = agentEngine.toggleTopicPublish(id);
    setTopics(updated);
  };

  const exportLeadsCsv = () => {
    audioSynth.playClickSound();
    const headers = 'ID,Contacto,Tipo,Rol,Fuente,Fecha,Pais,Estado\n';
    const rows = leads.map(l => 
      `"${l.id}","${l.contact}","${l.type}","${l.role}","${l.source}","${l.timestamp}","${l.country || ''}","${l.status}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kboxhubia_leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportLogsCsv = () => {
    audioSynth.playClickSound();
    const headers = 'ID,Feature,Action,Timestamp,UserRole,Details\n';
    const rows = interactionLogs.map(l => 
      `"${l.id}","${l.feature}","${l.action}","${l.timestamp}","${l.userRole || ''}","${l.details?.replace(/"/g, '""') || ''}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kboxhubia_interaction_telemetry_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Download comprehensive interaction logs & user telemetry report as formatted CSV
  const exportFullReportCsv = () => {
    audioSynth.playTone(880, 0.15, 'sine', 0.1);
    setDownloadedToast(true);
    setToastMessage(
      lang === 'es'
        ? '¡Reporte Ejecutivo de Telemetría e Interacciones CSV descargado con éxito!'
        : lang === 'pt'
        ? 'Relatório Executivo de Telemetria e Interações CSV baixado com sucesso!'
        : 'Executive Telemetry & Interaction Logs CSV report successfully downloaded!'
    );
    setTimeout(() => {
      setDownloadedToast(false);
      setToastMessage(null);
    }, 4500);

    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').slice(0, 19);
    const fileDateStr = now.toISOString().split('T')[0];
    const fileTimeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');

    const bridgeTelemetry = communityBridgeService.getTelemetry();
    const welcomeConfig = communityBridgeService.getWelcomeConfig();
    const allLeads = agentEngine.getLeads();
    const allKb = agentEngine.getKnowledgeBase();

    // Aggregations for telemetry summaries
    const featureCounts: Record<string, number> = {};
    const actionCounts: Record<string, number> = {};
    const roleCounts: Record<string, number> = {};

    interactionLogs.forEach((log) => {
      featureCounts[log.feature] = (featureCounts[log.feature] || 0) + 1;
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      const roleKey = log.userRole || 'invitado/guest';
      roleCounts[roleKey] = (roleCounts[roleKey] || 0) + 1;
    });

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    let csvContent = '\uFEFF'; // UTF-8 BOM for full character compatibility in Excel & Google Sheets

    // SECTION 1: EXECUTIVE & PLATFORM TELEMETRY OVERVIEW
    csvContent += '=== REPORTE EJECUTIVO DE TELEMETRIA E INTERACCIONES - KBOXHUBIA ===\n';
    csvContent += `Fecha y Hora de Generacion,${escapeCsv(timestampStr)}\n`;
    csvContent += `Administrador Master,${escapeCsv('Ing. Jorge Huerta (Master Admin)')}\n`;
    csvContent += `Contacto Directo,${escapeCsv(ADMIN_PHONE_NUMBER)}\n`;
    csvContent += `Comunidad Oficial WhatsApp,${escapeCsv(WHATSAPP_GROUP_NAME)}\n`;
    csvContent += `Total de Eventos de Interaccion Registrados,${interactionLogs.length}\n`;
    csvContent += `Total de Leads Capturados en Base de Datos,${allLeads.length}\n`;
    csvContent += `Total de Entradas Indexadas en Base de Conocimiento RAG,${allKb.length}\n`;
    csvContent += `Temas Tecnicos Publicados en Vivo,${publishedCount} de ${topics.length}\n`;
    csvContent += `Puntaje de Salud del Puente Comunitario,${bridgeTelemetry.communityHealthScore}%\n`;
    csvContent += `Mensajes de Difusion WhatsApp Despachados,${bridgeTelemetry.totalBroadcastsSent}\n`;
    csvContent += `Consultas WhatsApp Inbound Procesadas,${bridgeTelemetry.queriesProcessed}\n`;
    csvContent += `Mensajes de Bienvenida WhatsApp Auto-Copiados,${welcomeConfig.welcomeCount || 0}\n\n`;

    // SECTION 2: FEATURE INTERACTION BREAKDOWN
    csvContent += '=== RESUMEN DE TELEMETRIA POR CARACTERISTICA / MODULO ===\n';
    csvContent += 'Caracteristica / Modulo,Total Interacciones,Porcentaje del Total\n';
    const sortedFeatures = Object.entries(featureCounts).sort(([, a], [, b]) => b - a);
    if (sortedFeatures.length === 0) {
      csvContent += 'Sin registros,0,0%\n';
    } else {
      sortedFeatures.forEach(([feat, count]) => {
        const pct = interactionLogs.length > 0 ? ((count / interactionLogs.length) * 100).toFixed(1) : '0';
        csvContent += `${escapeCsv(feat)},${count},"${pct}%"\n`;
      });
    }
    csvContent += '\n';

    // SECTION 3: ACTION TYPE BREAKDOWN
    csvContent += '=== RESUMEN DE TELEMETRIA POR TIPO DE ACCION ===\n';
    csvContent += 'Tipo de Accion,Total Eventos\n';
    const sortedActions = Object.entries(actionCounts).sort(([, a], [, b]) => b - a);
    if (sortedActions.length === 0) {
      csvContent += 'Sin registros,0\n';
    } else {
      sortedActions.forEach(([act, count]) => {
        csvContent += `${escapeCsv(act.toUpperCase())},${count}\n`;
      });
    }
    csvContent += '\n';

    // SECTION 4: USER ROLE BREAKDOWN
    csvContent += '=== RESUMEN POR ROL O IDENTIFICADOR DE USUARIO ===\n';
    csvContent += 'Rol de Usuario,Total Interacciones\n';
    const sortedRoles = Object.entries(roleCounts).sort(([, a], [, b]) => b - a);
    if (sortedRoles.length === 0) {
      csvContent += 'Sin registros,0\n';
    } else {
      sortedRoles.forEach(([role, count]) => {
        csvContent += `${escapeCsv(role)},${count}\n`;
      });
    }
    csvContent += '\n';

    // SECTION 5: FULL DETAILED INTERACTION LOGS
    csvContent += '=== REGISTRO DETALLADO DE EVENTOS DE INTERACCION ===\n';
    csvContent += 'ID Evento,Hora / Timestamp,Caracteristica / Modulo,Tipo de Accion,Rol / Identificador,Detalles del Evento\n';
    if (interactionLogs.length === 0) {
      csvContent += 'No hay eventos de interaccion registrados en esta sesion.\n';
    } else {
      interactionLogs.forEach((l) => {
        csvContent += `${escapeCsv(l.id)},${escapeCsv(l.timestamp)},${escapeCsv(l.feature)},${escapeCsv(l.action)},${escapeCsv(l.userRole || 'invitado')},${escapeCsv(l.details || '-')}\n`;
      });
    }
    csvContent += '\n';

    // SECTION 6: CAPTURED LEADS REGISTRY
    csvContent += '=== REGISTRO DE LEADS CAPTURADOS ===\n';
    csvContent += 'ID Lead,Contacto,Tipo de Contacto,Rol / Sector,Fuente de Captura,Fecha y Hora,Pais,Estado de Oportunidad\n';
    if (allLeads.length === 0) {
      csvContent += 'No hay leads registrados actualmente en la base de datos.\n';
    } else {
      allLeads.forEach((l) => {
        csvContent += `${escapeCsv(l.id)},${escapeCsv(l.contact)},${escapeCsv(l.type)},${escapeCsv(l.role)},${escapeCsv(l.source)},${escapeCsv(l.timestamp)},${escapeCsv(l.country || 'N/A')},${escapeCsv(l.status)}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kboxhubia_telemetry_interaction_report_${fileDateStr}_${fileTimeStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter(l => 
    !searchLead || l.contact.toLowerCase().includes(searchLead.toLowerCase()) || l.role.toLowerCase().includes(searchLead.toLowerCase())
  );

  const filteredLogs = interactionLogs.filter(l =>
    !searchLog ||
    l.feature.toLowerCase().includes(searchLog.toLowerCase()) ||
    l.action.toLowerCase().includes(searchLog.toLowerCase()) ||
    (l.userRole && l.userRole.toLowerCase().includes(searchLog.toLowerCase())) ||
    (l.details && l.details.toLowerCase().includes(searchLog.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#141418] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-gray-200 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0E0E12] border-b border-[#26262D] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Kboxhubia Admin Command Center
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Ing. Jorge Huerta (Master Admin)
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Gestor de 15 Temas • Base de Datos de Leads • Base de Conocimiento RAG • {ADMIN_PHONE_NUMBER}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Download Report Button in Header */}
            <button
              id="btn-download-full-report-header"
              onClick={exportFullReportCsv}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black flex items-center gap-2 transition-all shadow-md shadow-amber-950/40 active:scale-95 cursor-pointer"
              title={
                lang === 'es'
                  ? 'Descargar reporte completo en formato CSV (Telemetría, Interacciones y Leads)'
                  : lang === 'pt'
                  ? 'Baixar relatório completo em CSV (Telemetria, Interações e Leads)'
                  : 'Download full report in CSV format (Telemetry, Interactions & Leads)'
              }
            >
              <Download className="w-4 h-4 text-black shrink-0" />
              <span>
                {lang === 'es' ? 'Descargar Reporte' : lang === 'pt' ? 'Baixar Relatório' : 'Download Report'}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-black/20 text-black uppercase">
                CSV
              </span>
            </button>

            {onOpenCommunityBridge && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCommunityBridge();
                }}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Bridge</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#232328] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Notification Banner for Download Events */}
        {downloadedToast && (
          <div className="mx-6 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950 via-[#261E0E] to-amber-950 border border-amber-400/80 text-amber-100 text-xs flex items-center justify-between shadow-2xl animate-fade-in gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-xs leading-tight">
                {toastMessage || '¡Reporte CSV de telemetría e interacciones descargado con éxito!'}
              </span>
            </div>
            <button
              onClick={() => setDownloadedToast(false)}
              className="p-1 rounded-lg text-amber-300 hover:text-white hover:bg-amber-900/50 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 bg-[#111115] border-b border-[#232328] flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('topics_manager')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'topics_manager'
                ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Gestor de 15 Temas ({publishedCount}/15 Activos)</span>
          </button>

          <button
            onClick={() => setActiveTab('leads_db')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'leads_db'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Base de Datos de Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge_store')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'knowledge_store'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Base de Conocimiento Indexada ({kbItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('agent_stats')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'agent_stats'
                ? 'border-purple-400 text-purple-300 bg-purple-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Red de 5 Subagentes & Métricas</span>
          </button>

          <button
            id="tab-marketing-assets"
            onClick={() => {
              audioSynth.playClickSound();
              setActiveTab('marketing_assets');
            }}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'marketing_assets'
                ? 'border-rose-400 text-rose-300 bg-rose-500/10 shadow-sm shadow-rose-900/30'
                : 'border-transparent text-gray-400 hover:text-rose-300'
            }`}
          >
            <Megaphone className="w-4 h-4 text-rose-400" />
            <span>Marketing Assets IA (Roadmap)</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-300 font-mono">Gemini</span>
          </button>

          <button
            id="tab-telemetry-heatmap"
            onClick={() => {
              audioSynth.playClickSound();
              setActiveTab('telemetry_logs');
            }}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'telemetry_logs'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10 shadow-sm shadow-amber-900/30'
                : 'border-transparent text-gray-400 hover:text-amber-300'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Telemetría & Heatmap ({interactionLogs.length})</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono">Heatmap</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: 15 TOPICS MANAGER */}
          {activeTab === 'topics_manager' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Autorización de Publicaciones (Selecciona tus 9 favoritos o los que desees)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Los temas con interruptor verde se publican automáticamente en el área de White Papers para los usuarios.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-amber-400">
                    {publishedCount} de 15
                  </span>
                  <span className="text-[10px] text-gray-500 block">Publicados en vivo</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topics.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      t.isPublished
                        ? 'bg-[#101914] border-emerald-500/50'
                        : 'bg-[#0E0E12] border-[#24242A] opacity-70'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1C1C22] text-amber-300 border border-[#333]">
                          #{t.topicNumber} • {t.category}
                        </span>
                        <span className={`text-[10px] font-bold ${t.isPublished ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {t.isPublished ? 'PUBLICADO' : 'BORRADOR'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white">
                        {t.title.es}
                      </h4>

                      <p className="text-[11px] text-gray-400 line-clamp-2">
                        {t.summary.es}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleTopic(t.id)}
                      className={`p-2.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
                        t.isPublished
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
                          : 'bg-[#222228] hover:bg-[#2F2F36] text-gray-300'
                      }`}
                    >
                      {t.isPublished ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LEADS DATABASE */}
          {activeTab === 'leads_db' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative min-w-[260px]">
                  <input
                    type="text"
                    value={searchLead}
                    onChange={(e) => setSearchLead(e.target.value)}
                    placeholder="Filtrar por email, teléfono o rol..."
                    className="w-full bg-[#0D0D10] border border-[#2B2B30] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                </div>

                <button
                  onClick={exportLeadsCsv}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar Leads a CSV</span>
                </button>
              </div>

              {/* Table */}
              <div className="bg-[#0D0D10] rounded-2xl border border-[#232328] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141418] border-b border-[#232328] text-gray-400 text-[11px] font-mono uppercase">
                    <tr>
                      <th className="p-3">Contacto</th>
                      <th className="p-3">Rol / Sector</th>
                      <th className="p-3">Fuente</th>
                      <th className="p-3">Fecha & Hora</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D1D22]">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#141418] transition-colors">
                        <td className="p-3 font-semibold text-white flex items-center gap-2">
                          {lead.type === 'email' ? <Mail className="w-3.5 h-3.5 text-cyan-400" /> : <Phone className="w-3.5 h-3.5 text-emerald-400" />}
                          <span className="font-mono">{lead.contact}</span>
                        </td>
                        <td className="p-3 text-gray-300">{lead.role}</td>
                        <td className="p-3 text-gray-400 text-[11px]">{lead.source}</td>
                        <td className="p-3 font-mono text-gray-500 text-[10px]">{lead.timestamp}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            lead.status === 'vip_opportunity'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: KNOWLEDGE BASE INDEX */}
          {activeTab === 'knowledge_store' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Memoria Vectorial Indexada (Knowledge-First Store)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Cada vez que un usuario hace una pregunta no registrada, el Subagente 2 investiga en internet y la guarda aquí permanentemente.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {kbItems.length} Entradas Indexadas
                </span>
              </div>

              <div className="space-y-3">
                {kbItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#1A1A20] text-cyan-300 border border-[#333]">
                        {item.category} • Origen: {item.source}
                      </span>
                      <span className="text-gray-500 font-mono">
                        Consultado {item.usageCount} veces
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-amber-300">
                      Q: {item.query}
                    </h4>

                    <p className="text-xs text-gray-300 leading-relaxed bg-[#121216] p-3 rounded-xl border border-[#1E1E24]">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AGENT STATS */}
          {activeTab === 'agent_stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Subagente 1</span>
                  <h4 className="text-sm font-bold text-white">Guardián de Base Local</h4>
                  <span className="text-xs text-emerald-400 font-mono">99.4% Uptime • RAG Activo</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Subagente 2</span>
                  <h4 className="text-sm font-bold text-white">Web-Scout & Gemini 3.7</h4>
                  <span className="text-xs text-cyan-400 font-mono">Auto-Aprendizaje Habilitado</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Subagente 3</span>
                  <h4 className="text-sm font-bold text-white">Analytics de Encuestas B2B</h4>
                  <span className="text-xs text-purple-400 font-mono">248 Votos Procesados</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Subagente 4</span>
                  <h4 className="text-sm font-bold text-white">Curador Granja de Dinero</h4>
                  <span className="text-xs text-amber-400 font-mono">7 Modelos Actualizados</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Subagente 5</span>
                  <h4 className="text-sm font-bold text-white">WhatsApp & Conversión</h4>
                  <span className="text-xs text-emerald-400 font-mono">Grupo: {WHATSAPP_GROUP_NAME}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Administrador Master</span>
                  <h4 className="text-sm font-bold text-white">Ing. Jorge Huerta</h4>
                  <span className="text-xs text-gray-300 font-mono">{ADMIN_PHONE_NUMBER}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TELEMETRY & INTERACTION LOGS & HEATMAP */}
          {activeTab === 'telemetry_logs' && (
            <div className="space-y-6">
              
              {/* Telemetry Actions & Sub-View Switcher */}
              <div className="p-4 rounded-2xl bg-[#0D0D10] border border-[#232328] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Telemetría de Interacciones & Activity Heatmap</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Monitoreo en tiempo real de picos horarios y densidad de uso del portal por perfiles de usuario (C-Suite, Freemium B2B, MLOps e Invitados).
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Sub-view switcher */}
                  <div className="flex items-center bg-[#141418] p-1 rounded-xl border border-[#2B2B33] text-xs">
                    <button
                      onClick={() => {
                        audioSynth.playClickSound();
                        setTelemetryViewMode('both');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        telemetryViewMode === 'both'
                          ? 'bg-amber-500 text-black shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Completo
                    </button>
                    <button
                      onClick={() => {
                        audioSynth.playClickSound();
                        setTelemetryViewMode('heatmap');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        telemetryViewMode === 'heatmap'
                          ? 'bg-amber-500 text-black shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Heatmap
                    </button>
                    <button
                      onClick={() => {
                        audioSynth.playClickSound();
                        setTelemetryViewMode('logs');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        telemetryViewMode === 'logs'
                          ? 'bg-amber-500 text-black shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Logs ({interactionLogs.length})
                    </button>
                  </div>

                  {onClearLogs && interactionLogs.length > 0 && (
                    <button
                      onClick={() => {
                        audioSynth.playClickSound();
                        onClearLogs();
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Limpiar Logs</span>
                    </button>
                  )}

                  <button
                    onClick={exportLogsCsv}
                    disabled={interactionLogs.length === 0}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1C1C24] hover:bg-[#252530] text-gray-300 border border-[#2F2F3D] flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                    title="Exportar únicamente los logs individuales de interacción en CSV simple"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-400" />
                    <span>Solo Logs CSV</span>
                  </button>

                  <button
                    id="btn-download-telemetry-full-report"
                    onClick={exportFullReportCsv}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black flex items-center gap-1.5 transition-all shadow-md shadow-amber-950/40 active:scale-95 cursor-pointer"
                    title="Descargar reporte ejecutivo completo con telemetría, métricas agrupadas, resumen de puente y leads en CSV"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-black" />
                    <span>{lang === 'es' ? 'Descargar Reporte Completo (CSV)' : lang === 'pt' ? 'Baixar Relatório Completo (CSV)' : 'Download Full Report (CSV)'}</span>
                  </button>
                </div>
              </div>

              {/* 1. ACTIVITY HEATMAP VISUALIZATION */}
              {(telemetryViewMode === 'both' || telemetryViewMode === 'heatmap') && (
                <ActivityHeatmap
                  interactionLogs={interactionLogs}
                  lang={lang}
                  onFilterFeature={(feat) => setSearchLog(feat)}
                />
              )}

              {/* 2. LIVE INTERACTION LOGS TABLE */}
              {(telemetryViewMode === 'both' || telemetryViewMode === 'logs') && (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">
                        {lang === 'es' ? 'Registro Detallado de Eventos de Interacción:' : 'Detailed Interaction Event Logs:'}
                      </h4>
                    </div>

                    <span className="text-xs text-gray-400 font-mono">
                      Mostrando {filteredLogs.length} de {interactionLogs.length} eventos
                    </span>
                  </div>

                  {/* Search & Filter */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <input
                        type="text"
                        value={searchLog}
                        onChange={(e) => setSearchLog(e.target.value)}
                        placeholder="Filtrar por función, acción, usuario o detalles..."
                        className="w-full bg-[#0D0D10] border border-[#2B2B30] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Logs Table */}
                  <div className="bg-[#0D0D10] rounded-2xl border border-[#232328] overflow-hidden shadow-lg">
                    {filteredLogs.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-xs">
                        No hay eventos de interacción registrados que coincidan con la búsqueda.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#141418] border-b border-[#232328] text-gray-400 text-[11px] font-mono uppercase">
                          <tr>
                            <th className="p-3">Hora</th>
                            <th className="p-3">Característica</th>
                            <th className="p-3">Acción</th>
                            <th className="p-3">Usuario / Rol</th>
                            <th className="p-3">Detalles</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1D1D22]">
                          {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-[#141418] transition-colors">
                              <td className="p-3 font-mono text-gray-400 text-[11px] whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 text-amber-400/70" />
                                  <span>{log.timestamp}</span>
                                </div>
                              </td>
                              <td className="p-3 font-semibold text-white">
                                <span className="px-2 py-0.5 rounded bg-[#1C1C22] border border-[#333] text-amber-300 font-mono text-[11px]">
                                  {log.feature}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  log.action === 'export'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : log.action === 'open'
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                    : log.action === 'interact'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-gray-700/30 text-gray-300 border border-gray-600/30'
                                }`}>
                                  {log.action.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-3 text-gray-300 font-mono text-[11px]">
                                {log.userRole || 'invitado'}
                              </td>
                              <td className="p-3 text-gray-400 text-xs max-w-xs truncate">
                                {log.details || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 6: MARKETING ASSETS & ROADMAP AI */}
          {activeTab === 'marketing_assets' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1E1122] via-[#16121D] to-[#121722] border border-rose-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        Marketing Assets & Copys IA para Redes Sociales
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-rose-400" />
                        Gemini 3.7 Flash
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Convierte hitos de tu Roadmap técnico en publicaciones de máxima conversión para LinkedIn, X (Twitter) y WhatsApp con 1 clic de copiado.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-generate-marketing-top"
                    onClick={() => handleGenerateMarketing()}
                    disabled={isGeneratingMarketing}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white flex items-center gap-2 transition-all shadow-lg shadow-rose-950/40 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingMarketing ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingMarketing ? 'Generando con Gemini...' : 'Regenerar Copys IA'}</span>
                  </button>
                </div>
              </div>

              {/* 1. Roadmap Milestones Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-rose-400" />
                    <span>1. Selecciona el Hito del Roadmap Base:</span>
                  </label>
                  <span className="text-[11px] text-gray-400">
                    Hito seleccionado: <strong className="text-rose-300">{currentMilestone.quarter}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {PLATFORM_ROADMAP.map((milestone) => {
                    const isSelected = milestone.id === selectedMilestoneId;
                    return (
                      <button
                        key={milestone.id}
                        onClick={() => {
                          audioSynth.playClickSound();
                          setSelectedMilestoneId(milestone.id);
                          handleGenerateMarketing(milestone);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#1D1424] border-rose-500/80 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                            : 'bg-[#101015] border-[#25252D] hover:border-gray-600 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#202028] text-gray-200 border border-[#333]">
                              {milestone.quarter}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              milestone.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : milestone.status === 'current'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}>
                              {milestone.status === 'completed' ? 'Completado' : milestone.status === 'current' ? 'Activo' : 'Próximo'}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-white line-clamp-1">
                            {milestone.title[lang] || milestone.title.es}
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {milestone.description[lang] || milestone.description.es}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#25252E] flex items-center justify-between text-[10px] text-rose-300/80 font-mono">
                          <span>{milestone.highlightCategory}</span>
                          <ArrowRight className="w-3 h-3 text-rose-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Tone & Focus Customization Bar */}
              <div className="p-4 rounded-2xl bg-[#0E0E14] border border-[#262630] grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Tone selector */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase font-mono">
                    Tono & Audiencia Objetivo:
                  </label>
                  <div className="flex bg-[#16161E] p-1 rounded-xl border border-[#2B2B38]">
                    {(['executive', 'technical', 'viral', 'investor'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          audioSynth.playClickSound();
                          setMarketingTone(t);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                          marketingTone === t
                            ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-sm'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {t === 'executive' ? 'Ejecutivo' : t === 'technical' ? 'DeepTech' : t === 'viral' ? 'Viral' : 'Inversor'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom focus input */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase font-mono">
                    Enfoque Personalizado / Call-To-Action (Opcional):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customMarketingFocus}
                      onChange={(e) => setCustomMarketingFocus(e.target.value)}
                      placeholder="Ej: Destacar el ahorro de $180k y agendar con Ing. Jorge Huerta (+58 412-3931011)"
                      className="flex-1 bg-[#16161E] border border-[#2B2B38] rounded-xl px-3.5 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={() => handleGenerateMarketing()}
                      disabled={isGeneratingMarketing}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-all whitespace-nowrap shadow-md disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Generated Assets Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-rose-400" />
                    <span>Assets Promocionales Generados ({generatedAssets.length}):</span>
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    Haz clic en <strong className="text-amber-300">"Copiar en 1 Clic"</strong> para publicar directamente.
                  </span>
                </div>

                {isGeneratingMarketing ? (
                  <div className="p-12 rounded-2xl bg-[#0D0D12] border border-rose-500/20 text-center flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 text-rose-400 animate-spin" />
                    <p className="text-sm font-bold text-white">Gemini 3.7 Flash está redactando los copys ejecutivos...</p>
                    <p className="text-xs text-gray-400 max-w-md">
                      Sintetizando métricas de payback, arquitectura de hardware 4x L40S y propuesta de valor basada en el Roadmap.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {generatedAssets.map((asset) => {
                      const isCopied = copiedAssetId === asset.id;
                      const isLinkedIn = asset.platform.toLowerCase().includes('linkedin');
                      const isTwitter = asset.platform.toLowerCase().includes('twitter') || asset.platform.toLowerCase().includes('x');
                      const isWhatsApp = asset.platform.toLowerCase().includes('whatsapp');

                      const shareUrl = isLinkedIn
                        ? `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(asset.content)}`
                        : isTwitter
                        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(asset.content)}`
                        : `https://wa.me/?text=${encodeURIComponent(asset.content)}`;

                      return (
                        <div
                          key={asset.id}
                          className={`p-5 rounded-2xl border flex flex-col justify-between transition-all bg-[#0F0F14] ${
                            isLinkedIn
                              ? 'border-blue-500/40 hover:border-blue-400 shadow-blue-950/20'
                              : isTwitter
                              ? 'border-cyan-500/40 hover:border-cyan-400 shadow-cyan-950/20'
                              : 'border-emerald-500/40 hover:border-emerald-400 shadow-emerald-950/20'
                          } shadow-xl`}
                        >
                          <div>
                            {/* Card Header */}
                            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#23232C]">
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-xl text-white ${
                                  isLinkedIn ? 'bg-[#0A66C2]' : isTwitter ? 'bg-[#1D9BF0]' : 'bg-emerald-600'
                                }`}>
                                  {isLinkedIn ? <Linkedin className="w-4 h-4" /> : isTwitter ? <Twitter className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">{asset.platform}</h5>
                                  <span className="text-[10px] text-gray-400">{asset.format}</span>
                                </div>
                              </div>

                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1C1C24] text-gray-300 border border-[#333]">
                                {asset.targetAudience.split(',')[0]}
                              </span>
                            </div>

                            {/* Hook Highlight */}
                            {asset.hook && (
                              <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-[#171720] border border-[#292938] text-[11px] font-semibold text-rose-300">
                                🎯 {asset.hook}
                              </div>
                            )}

                            {/* Content Body */}
                            <div className="relative">
                              <textarea
                                readOnly
                                value={asset.content}
                                rows={8}
                                className="w-full bg-[#08080B] border border-[#22222A] rounded-xl p-3 text-xs text-gray-200 font-mono leading-relaxed focus:outline-none select-all resize-none"
                              />
                            </div>

                            {/* Hashtags */}
                            {asset.hashtags && asset.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {asset.hashtags.slice(0, 4).map((tag, idx) => (
                                  <span key={idx} className="text-[10px] font-mono text-purple-400 bg-purple-950/30 px-1.5 py-0.5 rounded border border-purple-800/40">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 pt-3 border-t border-[#23232C] flex items-center justify-between gap-2">
                            <button
                              id={`btn-copy-asset-${asset.id}`}
                              onClick={() => handleCopyAsset(asset)}
                              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                                isCopied
                                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md animate-scale-up'
                                  : 'bg-[#1C1C26] hover:bg-[#282836] text-white border-[#383848]'
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>¡Copiado con Éxito!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Copiar en 1 Clic</span>
                                </>
                              )}
                            </button>

                            <a
                              href={shareUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => audioSynth.playClickSound()}
                              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1 text-white transition-all shadow-sm ${
                                isLinkedIn
                                  ? 'bg-[#0A66C2] hover:bg-[#084e96]'
                                  : isTwitter
                                  ? 'bg-[#1D9BF0] hover:bg-[#187ec4]'
                                  : 'bg-emerald-600 hover:bg-emerald-500'
                              }`}
                              title={`Abrir directamente en ${asset.platform}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Abrir</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
