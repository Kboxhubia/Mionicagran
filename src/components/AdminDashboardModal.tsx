import React, { useState } from 'react';
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
  FileSpreadsheet
} from 'lucide-react';
import { agentEngine } from '../services/agentEngine';
import { ResearchTopic, LeadRecord, KnowledgeItem } from '../types/communityTypes';
import { ADMIN_PHONE_NUMBER, WHATSAPP_GROUP_NAME } from '../data/communityData';
import { audioSynth } from '../services/audioSynth';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'es' | 'en' | 'pt';
  onOpenCommunityBridge?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  lang = 'es',
  onOpenCommunityBridge
}) => {
  const [activeTab, setActiveTab] = useState<'topics_manager' | 'leads_db' | 'knowledge_store' | 'agent_stats'>('topics_manager');
  const [topics, setTopics] = useState<ResearchTopic[]>(() => agentEngine.getTopics());
  const [leads, setLeads] = useState<LeadRecord[]>(() => agentEngine.getLeads());
  const [kbItems, setKbItems] = useState<KnowledgeItem[]>(() => agentEngine.getKnowledgeBase());
  const [searchLead, setSearchLead] = useState<string>('');

  if (!isOpen) return null;

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

  const filteredLeads = leads.filter(l => 
    !searchLead || l.contact.toLowerCase().includes(searchLead.toLowerCase()) || l.role.toLowerCase().includes(searchLead.toLowerCase())
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

          <div className="flex items-center gap-2">
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

        </div>
      </div>
    </div>
  );
};
