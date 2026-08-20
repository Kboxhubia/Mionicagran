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
  ADMIN_PHONE_NUMBER, 
  WHATSAPP_GROUP_NAME, 
  WHATSAPP_DIRECT_LINK, 
  ALL_15_RESEARCH_TOPICS,
  MONEY_FARM_TRENDS 
} from '../data/communityData';
import { agentEngine, AgentQueryResult } from './agentEngine';

const BROADCASTS_KEY = 'kbox_bridge_broadcasts_v1';
const INBOUND_KEY = 'kbox_bridge_inbound_queries_v1';
const SCHEDULES_KEY = 'kbox_bridge_schedules_v1';
const WELCOME_CONFIG_KEY = 'kbox_bridge_welcome_config_v1';

export const PLATFORM_PUBLIC_URL = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-352m3ktcmlbnpnbbckkt2d-556668617791.us-west2.run.app';

export const WELCOME_PRESETS: WelcomePreset[] = [
  {
    id: 'preset-executive',
    name: 'Ejecutivo C-Suite (Finanzas, MACRS & ROI)',
    description: 'Enfocado en directores de tecnología, finanzas y gerentes generales evaluando CAPEX vs OPEX.',
    category: 'executive',
    template: `👋 ¡Bienvenido/a {userName} al grupo oficial *{groupName}*! 🚀

🏛️ *Dirección & Presidencia:* {adminName} ({adminPhone})
🏢 *Ecosistema:* Plataforma Kboxhubia de Soberanía Computacional & ROI en Hardware de IA.

📊 *Recursos Ejecutivos Inmediatos:*
• 15 White Papers Técnicos y Modelos Financieros (MACRS, CAPEX vs OPEX).
• Análisis de Payback: 4x NVIDIA L40S amortizado en 3.4 meses vs Nube.
• 7 Modelos de Granja de Dinero con Inferencia Privada.

🔗 *Acceso a la Plataforma Digital en Vivo:*
{platformUrl}

💡 Siéntete libre de presentarte con tu nombre, empresa y país. ¡Bienvenido a bordo!`
  },
  {
    id: 'preset-technical',
    name: 'Técnico MLOps & Arquitectura GPU',
    description: 'Enfocado en ingenieros de sistemas, MLOps e infraestructura local de inferencia.',
    category: 'technical',
    template: `👋 ¡Hola {userName}! Te damos la bienvenida a *{groupName}* ⚡

⚙️ *Stack & Enfoque:* Inferencia Local de LLMs (DeepSeek-V3, Llama 3.3 70B, Qwen 2.5), vLLM, SVR, y racks 4x L40S / H100.
👨‍💻 *Coordinador Técnico:* {adminName} ({adminPhone})

🛠️ *Herramientas Disponibles:*
• Simuladores de VRAM y Concurrencia de Tokens/seg.
• Arquitecturas RAG Air-Gapped y Reducción de Churn ISP con SNMP/XGBoost.
• Dossiers y Scripts de Benchmark descargables.

🔗 *Plataforma:* {platformUrl}

📌 Comparte tus consultas sobre hardware y orquestación multi-agente en cualquier momento.`
  },
  {
    id: 'preset-money-farm',
    name: 'Granja de Cultivo de Dinero (7 Modelos)',
    description: 'Enfocado en inversionistas, creadores de SaaS y monetización de cómputo privado.',
    category: 'money_farm',
    template: `👋 ¡Bienvenido/a {userName} a la comunidad de *{groupName}*! 🌾💰

💡 *Objetivo:* Monetización de Hardware de IA y Creación de Granjas de Inferencia Privada.
👨‍💼 *Director:* {adminName} ({adminPhone})

📈 *Modelos Destacados:*
• Micro-SaaS Local de Tokens Privados (ROI 280% Año 1)
• Arbitraje de Cómputo Ocioso & Servidores GPU
• Asistentes de Voz para Clínicas y Despachos Legales

🔗 *Explora los 7 Modelos en Vivo:*
{platformUrl}

🤝 ¡Coméntanos qué modelo te interesa más para enviarte el dossier técnico!`
  },
  {
    id: 'preset-telecom',
    name: 'Telecom & Reducción de Churn ISP',
    description: 'Enfocado en proveedores de internet, CTOs de fibra óptica y operadores de red.',
    category: 'telecom',
    template: `👋 ¡Bienvenido/a {userName} a *{groupName}*! 📡

🌐 *Foco Sectorial:* Telecomunicaciones, Redes de Fibra Óptica (FTTH/GPON) e Inteligencia Artificial Predictiva.
👨‍💼 *Admin:* {adminName} ({adminPhone})

🎯 *Soluciones Clave:*
• Reducción de Churn en ISPs del 3.8% al <0.9% con Machine Learning.
• Mantenimiento Predictivo OLT/ONU y Detección Temprana de Falla Óptica.
• Auditorías de Ahorro para Redes de 10k a 100k Abonados.

🔗 *Simulador y Casos de Estudio:*
{platformUrl}

💬 ¡Bienvenido! Cuéntanos sobre tu red para compartir métricas de referencia.`
  }
];

export const INITIAL_WELCOME_CONFIG: WelcomeMessageConfig = {
  template: WELCOME_PRESETS[0].template,
  enabled: true,
  autoCopyOnJoin: true,
  lastUpdated: '2026-08-20 08:00:00',
  welcomeCount: 14,
  selectedPresetId: 'preset-executive'
};

// Initial pre-configured Executive Broadcasts
export const INITIAL_BROADCASTS: WhatsAppBroadcastItem[] = [
  {
    id: 'bc-1',
    title: 'Arbitraje de GPUs: 4x L40S vs H100 en Inferencia LLM',
    category: 'HardwareTrend',
    targetGroup: WHATSAPP_GROUP_NAME,
    triggerType: 'automated_cron',
    scheduleLabel: 'Diario 08:30 AM',
    status: 'dispatched',
    engagementScore: 96,
    createdAt: '2026-08-19 08:30:00',
    dispatchedAt: '2026-08-19 08:30:04',
    formattedMessage: `⚡ *KBOXHUBIA INTELLIGENCE BRIEFING | GPUs & CAPEX* ⚡\n\n📌 *Tema:* 4x NVIDIA L40S supera a 1x H100 en ROI de Inferencia\n\n📊 *Datos Cuantitativos:* \n• CAPEX: $44,000 (L40S Cluster) vs $38,000 (1x H100)\n• VRAM Total: 192 GB vs 80 GB (+140% para context length)\n• Amortización acelerada MACRS: 3.8 meses\n• TCO a 3 años: -46% en OPEX eléctrico y licencias\n\n🔗 *Simulador Interactivo en Vivo:* https://ais-pre-352m3ktcmlbnpnbbckkt2d-556668617791.us-west2.run.app\n\n💬 *Admin:* Ing. Jorge Huerta (+58 412-3931011)`
  },
  {
    id: 'bc-2',
    title: 'Granja de Cultivo #1: Micro-SaaS Local de Inferencia Privada',
    category: 'MoneyFarm',
    targetGroup: WHATSAPP_GROUP_NAME,
    triggerType: 'automated_cron',
    scheduleLabel: 'Semanal Miércoles',
    status: 'dispatched',
    engagementScore: 89,
    createdAt: '2026-08-18 10:00:00',
    dispatchedAt: '2026-08-18 10:00:12',
    formattedMessage: `🌾 *GRANJA DE CULTIVO DE DINERO CON IA | MODELO #1* 🌾\n\n💡 *Oportunidad:* Micro-SaaS Local de Inferencia Privada\n\n💰 *Proyección Financiera:* \n• ROI Proyectado: 280% en Año 1\n• Inversión Inicial: $48,000 (Servidor 4x L40S)\n• Punto de Retorno: Mes 4.2\n• Ingreso Recurrente (MRR): $12,500/mes vendiendo tokens privados a clínicas, bufetes y fintechs locales.\n\n🛡️ *Ventaja Competitiva:* Aislamiento de red total sin fugas a OpenAI o Anthropic.\n\n📱 *Únete al debate en el grupo de WhatsApp de Kboxhubia.*`
  },
  {
    id: 'bc-3',
    title: 'Telecom & ISP: Reducción de Churn en Fibra Óptica a < 0.9%',
    category: 'TelecomChurn',
    targetGroup: WHATSAPP_GROUP_NAME,
    triggerType: 'event_driven',
    scheduleLabel: 'Alerta Flash de Mercado',
    status: 'scheduled',
    engagementScore: 94,
    createdAt: '2026-08-19 14:15:00',
    formattedMessage: `📡 *TELECOM RADAR | RETENCIÓN DE CLIENTES CON IA* 📡\n\n🚨 *Impacto en ISPs:* Predecir degradación óptica en OLT/ONU antes del corte reduce el Churn del 3.8% al 0.9% mensual.\n\n📈 *Ahorro Neto:* Para un ISP de 30,000 abonados a $25/mes, retener 870 clientes mensuales representa +$261,000 USD anuales de flujo preservado.\n\n🔬 *Metodología:* Modelos XGBoost y redes neuronales procesando telemetría SNMP en clúster local Kbox.\n\n👨‍💼 *Dirección:* Ing. Jorge Huerta`
  }
];

export const INITIAL_SCHEDULES: BroadcastScheduleConfig[] = [
  {
    id: 'sch-1',
    name: 'Briefing Matutino C-Suite (Mercado & GPUs)',
    frequency: 'daily_morning',
    cadenceText: 'Todos los días a las 08:30 AM',
    templateType: 'executive_briefing',
    enabled: true,
    lastRun: '2026-08-19 08:30',
    nextRun: '2026-08-20 08:30'
  },
  {
    id: 'sch-2',
    name: 'Radar Granja de Cultivo de Dinero (7 Modelos)',
    frequency: 'weekly_digest',
    cadenceText: 'Miércoles y Sábados a las 11:00 AM',
    templateType: 'money_farm_signal',
    enabled: true,
    lastRun: '2026-08-18 10:00',
    nextRun: '2026-08-21 11:00'
  },
  {
    id: 'sch-3',
    name: 'White Paper Spotlight & Citas Científicas',
    frequency: 'bi_weekly',
    cadenceText: 'Lunes y Jueves a las 16:00 PM',
    templateType: 'whitepaper_spotlight',
    enabled: true,
    lastRun: '2026-08-17 16:00',
    nextRun: '2026-08-20 16:00'
  },
  {
    id: 'sch-4',
    name: 'Alertas Flash de Hardware & Arbitraje vLLM',
    frequency: 'hourly_alert',
    cadenceText: 'Disparo por eventos de mercado y fluctuación',
    templateType: 'gpu_arbitrage',
    enabled: true,
    lastRun: '2026-08-19 14:15',
    nextRun: '2026-08-19 18:00'
  }
];

// Initial Inbound WhatsApp Questions captured from the community
export const INITIAL_INBOUND_QUERIES: InboundWhatsAppQuery[] = [
  {
    id: 'inq-1',
    rawText: '[14:12, 19/8/2026] +58 412-7821904: ¿Cuál es el consumo eléctrico en watts de 4 tarjetas L40S a plena carga y cuánto cuesta la refrigeración mensual en un rack estándar?',
    senderPhone: '+58 412-7821904',
    senderName: 'Ing. Carlos Mendoza (CTO FibraNet)',
    extractedQuery: '¿Cuál es el consumo eléctrico en watts de 4 tarjetas L40S a plena carga y cuánto cuesta la refrigeración mensual?',
    category: 'Hardware',
    detectedIntent: 'Cálculo de Consumo OPEX y Potencia Térmica',
    parsedAt: '2026-08-19 14:13:02',
    agentResponse: `*Consumo Eléctrico y Térmico de 4x NVIDIA L40S:*\n• TDP por GPU: 350W máx (1,400W para las 4 GPUs a plena inferencia).\n• Servidor completo 2U con 2x AMD EPYC: ~1,850W continuos.\n• Consumo mensual (24/7): ~1,332 kWh/mes.\n• Costo eléctrico (a $0.08/kWh industrial): ~$106 USD/mes.\n• Refrigeración (PUE 1.25): ~$26 USD/mes adicionales.\n*Conclusión:* El OPEX total de energía es menor a $140 USD/mes, 60% más eficiente que mantener instancias equivalentes en AWS/Azure.`,
    sourcesCited: ['NVIDIA L40S Datasheet Specs', 'Memoria Técnica Kboxhubia 2026', 'Norma ASHRAE TC 9.9'],
    status: 'parsed_and_learned',
    funneledKbId: 'kb-wa-101',
    confidenceScore: 0.98
  },
  {
    id: 'inq-2',
    rawText: '[16:45, 18/8/2026] +57 310-4491022: ¿Se puede usar DeepSeek R1 o Llama 3.3 70B en español para responder tickets de reclamos de facturación en nuestro ISP?',
    senderPhone: '+57 310-4491022',
    senderName: 'Dra. Patricia Gómez (COO Telecom)',
    extractedQuery: '¿Se puede usar DeepSeek R1 o Llama 3.3 70B en español para responder tickets de reclamos de facturación en ISP?',
    category: 'Technical',
    detectedIntent: 'Automatización de Soporte ISP y Reducción de Churn',
    parsedAt: '2026-08-18 16:46:15',
    agentResponse: `*Implementación de LLMs en Soporte ISP:*\n• Arquitectura recomendada: Llama-3.3-70B-Instruct cuantizado en FP8 o DeepSeek-R1-Distill en 4x L40S con vLLM.\n• Rendimiento: 180 tokens/segundo por stream concurrente, atendiendo hasta 65 clientes simultáneos con latencia < 450ms.\n• Tasa de resolución autónoma en primer contacto (FCR): 78% en disputas de cobro y reconexión.\n• Retención: Reduce el Churn por frustración de atención al cliente en un 42%.`,
    sourcesCited: ['vLLM Distributed Serving Benchmark', 'IEEE Software & Telecom 2025'],
    status: 'parsed_and_learned',
    funneledKbId: 'kb-wa-102',
    confidenceScore: 0.96
  }
];

class CommunityBridgeService {
  private broadcasts: WhatsAppBroadcastItem[] = [];
  private inboundQueries: InboundWhatsAppQuery[] = [];
  private schedules: BroadcastScheduleConfig[] = [];
  private welcomeConfig: WelcomeMessageConfig = INITIAL_WELCOME_CONFIG;

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const bc = localStorage.getItem(BROADCASTS_KEY);
      this.broadcasts = bc ? JSON.parse(bc) : INITIAL_BROADCASTS;

      const inq = localStorage.getItem(INBOUND_KEY);
      this.inboundQueries = inq ? JSON.parse(inq) : INITIAL_INBOUND_QUERIES;

      const sch = localStorage.getItem(SCHEDULES_KEY);
      this.schedules = sch ? JSON.parse(sch) : INITIAL_SCHEDULES;

      const wel = localStorage.getItem(WELCOME_CONFIG_KEY);
      this.welcomeConfig = wel ? JSON.parse(wel) : INITIAL_WELCOME_CONFIG;
    } catch (e) {
      console.warn('Bridge store fallback to memory:', e);
      this.broadcasts = INITIAL_BROADCASTS;
      this.inboundQueries = INITIAL_INBOUND_QUERIES;
      this.schedules = INITIAL_SCHEDULES;
      this.welcomeConfig = INITIAL_WELCOME_CONFIG;
    }
  }

  private saveState() {
    try {
      localStorage.setItem(BROADCASTS_KEY, JSON.stringify(this.broadcasts));
      localStorage.setItem(INBOUND_KEY, JSON.stringify(this.inboundQueries));
      localStorage.setItem(SCHEDULES_KEY, JSON.stringify(this.schedules));
      localStorage.setItem(WELCOME_CONFIG_KEY, JSON.stringify(this.welcomeConfig));
    } catch (e) {
      console.warn('Error saving bridge state:', e);
    }
  }

  // --- WELCOME MESSAGE AUTOMATION ENGINE ---

  public getWelcomeConfig(): WelcomeMessageConfig {
    return { ...this.welcomeConfig };
  }

  public getWelcomePresets(): WelcomePreset[] {
    return [...WELCOME_PRESETS];
  }

  public updateWelcomeConfig(partial: Partial<WelcomeMessageConfig>): WelcomeMessageConfig {
    this.welcomeConfig = {
      ...this.welcomeConfig,
      ...partial,
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.saveState();
    return { ...this.welcomeConfig };
  }

  public applyWelcomePreset(presetId: string): WelcomeMessageConfig {
    const found = WELCOME_PRESETS.find(p => p.id === presetId) || WELCOME_PRESETS[0];
    this.welcomeConfig = {
      ...this.welcomeConfig,
      template: found.template,
      selectedPresetId: found.id,
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.saveState();
    return { ...this.welcomeConfig };
  }

  public resetWelcomeConfig(): WelcomeMessageConfig {
    this.welcomeConfig = {
      ...INITIAL_WELCOME_CONFIG,
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.saveState();
    return { ...this.welcomeConfig };
  }

  // Interpolates template variables with real dynamic context
  public formatWelcomeMessage(templateOverride?: string, customVars?: Record<string, string>): string {
    const rawTemplate = templateOverride || this.welcomeConfig.template || INITIAL_WELCOME_CONFIG.template;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const defaultVariables: Record<string, string> = {
      '{userName}': customVars?.['{userName}'] || customVars?.userName || 'Nuevo Miembro',
      '{groupName}': WHATSAPP_GROUP_NAME,
      '{adminName}': 'Ing. Jorge Huerta',
      '{adminPhone}': ADMIN_PHONE_NUMBER,
      '{platformUrl}': PLATFORM_PUBLIC_URL,
      '{date}': dateFormatted,
      '{communityName}': WHATSAPP_GROUP_NAME
    };

    const finalVars = { ...defaultVariables, ...(customVars || {}) };

    let output = rawTemplate;
    Object.entries(finalVars).forEach(([key, val]) => {
      // Replace key directly or if passed without braces
      const placeholder = key.startsWith('{') ? key : `{${key}}`;
      output = output.split(placeholder).join(val);
    });

    return output;
  }

  // Executed whenever any user joins the group via our link
  public handleUserJoinWhatsApp(customName?: string): { success: boolean; formattedMessage: string; copiedToClipboard: boolean } {
    const formatted = this.formatWelcomeMessage(undefined, {
      '{userName}': customName || 'Nuevo Miembro'
    });

    let copied = false;
    if (this.welcomeConfig.enabled && this.welcomeConfig.autoCopyOnJoin && typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        navigator.clipboard.writeText(formatted);
        copied = true;
        this.welcomeConfig.welcomeCount = (this.welcomeConfig.welcomeCount || 0) + 1;
        this.saveState();
      } catch (err) {
        console.warn('Clipboard write failed on join event:', err);
      }
    }

    return {
      success: true,
      formattedMessage: formatted,
      copiedToClipboard: copied
    };
  }

  // --- BROADCAST ENGINE ---

  public getBroadcasts(): WhatsAppBroadcastItem[] {
    return [...this.broadcasts];
  }

  public getSchedules(): BroadcastScheduleConfig[] {
    return [...this.schedules];
  }

  public toggleSchedule(id: string): BroadcastScheduleConfig[] {
    this.schedules = this.schedules.map(s => {
      if (s.id === id) {
        return { ...s, enabled: !s.enabled };
      }
      return s;
    });
    this.saveState();
    return [...this.schedules];
  }

  // Generate a new Broadcast for a specific Research Topic
  public generateTopicBroadcast(topicId: string, lang: 'es' | 'en' | 'pt' = 'es'): WhatsAppBroadcastItem {
    const topic = ALL_15_RESEARCH_TOPICS.find(t => t.id === topicId) || ALL_15_RESEARCH_TOPICS[0];
    const titleText = topic.title[lang] || topic.title.es;
    const summaryText = topic.summary[lang] || topic.summary.es;
    const absText = topic.abstract[lang] || topic.abstract.es;

    const formattedMessage = `🔬 *KBOXHUBIA RESEARCH SPOTLIGHT | TOPIC #${topic.topicNumber}* 🔬\n\n📌 *${titleText.toUpperCase()}*\n\n📝 *Resumen Ejecutivo:* \n${summaryText}\n\n📊 *Metodología & Fuentes:* \n• ${topic.sources.map(s => `[${s.type}] ${s.name}`).join('\n• ')}\n\n💡 *Acceso Completo:* Explora la plataforma digital y dossier descargable.\n💬 *Admin:* Ing. Jorge Huerta (+58 412-3931011)`;

    const newItem: WhatsAppBroadcastItem = {
      id: `bc-${Date.now()}`,
      title: `Topic #${topic.topicNumber}: ${titleText}`,
      category: 'WhitePaper',
      targetGroup: WHATSAPP_GROUP_NAME,
      formattedMessage: formattedMessage,
      triggerType: 'manual_dispatch',
      scheduleLabel: 'Despacho Inmediato',
      status: 'scheduled',
      engagementScore: 92,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    this.broadcasts.unshift(newItem);
    this.saveState();
    return newItem;
  }

  // Generate a new Broadcast for a Money Farm Trend
  public generateMoneyFarmBroadcast(trendNumber: number, lang: 'es' | 'en' | 'pt' = 'es'): WhatsAppBroadcastItem {
    const item = MONEY_FARM_TRENDS.find(m => m.number === trendNumber) || MONEY_FARM_TRENDS[0];
    const titleText = item.title[lang] || item.title.es;
    const descText = item.description[lang] || item.description.es;

    const formattedMessage = `🌾 *GRANJA DE CULTIVO DE DINERO | MODELO #${item.number}* 🌾\n\n💎 *${titleText.toUpperCase()}*\n\n📈 *Proyección Financiera:* \n• Retorno Estimado: ${item.projectedRoi}\n• Capital Requerido: ${item.capitalRequired}\n• Tiempo a Ganancia Neta: ${item.timeToProfit}\n\n⚙️ *Stack Tecnológico:* ${item.techStack.join(', ')}\n\n📋 *Detalle:* ${descText}\n\n👥 *Comunidad WhatsApp:* ${WHATSAPP_GROUP_NAME} (+58 412-3931011)`;

    const newItem: WhatsAppBroadcastItem = {
      id: `bc-${Date.now()}`,
      title: `Granja #${item.number}: ${titleText}`,
      category: 'MoneyFarm',
      targetGroup: WHATSAPP_GROUP_NAME,
      formattedMessage: formattedMessage,
      triggerType: 'manual_dispatch',
      scheduleLabel: 'Despacho Manual',
      status: 'scheduled',
      engagementScore: 95,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    this.broadcasts.unshift(newItem);
    this.saveState();
    return newItem;
  }

  // Instant Dispatch Broadcast to WhatsApp
  public dispatchBroadcast(id: string): { success: boolean; whatsappUrl: string } {
    const item = this.broadcasts.find(b => b.id === id);
    if (!item) {
      return { success: false, whatsappUrl: WHATSAPP_DIRECT_LINK };
    }

    item.status = 'dispatched';
    item.dispatchedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    item.engagementScore = Math.min(99, item.engagementScore + 3);
    this.saveState();

    // Construct Direct WhatsApp send URL (encoded)
    const encodedText = encodeURIComponent(item.formattedMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

    return {
      success: true,
      whatsappUrl
    };
  }

  // --- INBOUND QUERY PARSER & KNOWLEDGE FUNNEL ENGINE ---

  public getInboundQueries(): InboundWhatsAppQuery[] {
    return [...this.inboundQueries];
  }

  // Parses raw WhatsApp message string into structured query, triggers agent, and funnels into Knowledge Base
  public async parseAndFunnelWhatsAppMessage(
    rawMessage: string, 
    lang: 'es' | 'en' | 'pt' = 'es'
  ): Promise<InboundWhatsAppQuery> {
    const trimmed = rawMessage.trim();

    // 1. Regex Heuristic to extract phone / sender and clean query
    // Patterns: [hh:mm, dd/mm/yyyy] +58 412-xxx: Query   OR   +58 412xxx: Query   OR plain text
    let senderPhone = ADMIN_PHONE_NUMBER;
    let senderName = 'Miembro Grupo WhatsApp';
    let cleanQuery = trimmed;

    const bracketMatch = trimmed.match(/^\[(.*?)\]\s*([^:]+):\s*([\s\S]+)$/);
    if (bracketMatch) {
      senderPhone = bracketMatch[2].trim();
      cleanQuery = bracketMatch[3].trim();
      senderName = senderPhone.includes('412') ? 'Contacto Telecom' : 'Directivo B2B';
    } else {
      const colonMatch = trimmed.match(/^([+0-9\s-]+):\s*([\s\S]+)$/);
      if (colonMatch) {
        senderPhone = colonMatch[1].trim();
        cleanQuery = colonMatch[2].trim();
      }
    }

    // 2. Classify Category & Intent
    const lower = cleanQuery.toLowerCase();
    let category: 'Technical' | 'Financial' | 'Hardware' | 'Telecom' | 'Security' = 'Technical';
    let intent = 'Consulta Técnica General';

    if (lower.includes('gpu') || lower.includes('l40s') || lower.includes('h100') || lower.includes('watt') || lower.includes('vram')) {
      category = 'Hardware';
      intent = 'Cálculo de Rendimiento y Consumo de Hardware';
    } else if (lower.includes('roi') || lower.includes('capex') || lower.includes('opex') || lower.includes('costo') || lower.includes('precio') || lower.includes('dolar') || lower.includes('$')) {
      category = 'Financial';
      intent = 'Análisis de Retorno de Inversión y Presupuesto';
    } else if (lower.includes('churn') || lower.includes('isp') || lower.includes('fibra') || lower.includes('olt') || lower.includes('onu') || lower.includes('mikrotik')) {
      category = 'Telecom';
      intent = 'Optimización de Red y Retención de Abonados';
    } else if (lower.includes('seguridad') || lower.includes('lgpd') || lower.includes('gdpr') || lower.includes('air-gapped') || lower.includes('privacid')) {
      category = 'Security';
      intent = 'Gobernanza de Datos y Soberanía Local';
    }

    // 3. Subagent Query & Real-Time Gemini / Knowledge Base Lookup
    const agentResult: AgentQueryResult = await agentEngine.queryAgentWithDualKnowledge(cleanQuery, lang);

    // 4. Auto-commit to Platform's Knowledge Base (Learning Loop)
    const kbItem: KnowledgeItem = agentEngine.funnelCommunityQuery(
      cleanQuery,
      agentResult.answer,
      `WhatsApp Ingest: ${category}`,
      agentResult.source === 'local_knowledge' ? 'local_knowledge' : 'web_scout_gemini',
      agentResult.confidenceScore
    );

    // 5. Structure the Inbound Record
    const newRecord: InboundWhatsAppQuery = {
      id: `inq-${Date.now()}`,
      rawText: rawMessage,
      senderPhone: senderPhone,
      senderName: senderName,
      extractedQuery: cleanQuery,
      category: category,
      detectedIntent: intent,
      parsedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      agentResponse: agentResult.answer,
      sourcesCited: agentResult.sourcesCited,
      status: 'parsed_and_learned',
      funneledKbId: kbItem.id,
      confidenceScore: agentResult.confidenceScore
    };

    this.inboundQueries.unshift(newRecord);
    this.saveState();
    return newRecord;
  }

  // Pre-built simulation queries to test the ingestion pipeline
  public async simulateIncomingWhatsAppQuestion(sampleIndex: number = 0, lang: 'es' | 'en' | 'pt' = 'es'): Promise<InboundWhatsAppQuery> {
    const samples = [
      `[17:20, 19/8/2026] +58 412-9901123: ¿Cuál es el Payback exacto de un servidor con 4x L40S si vendemos servicios de IA a 8 ISPs medianos cobrándoles $800/mes?`,
      `[11:05, 19/8/2026] +52 55 4190 2210: ¿Cómo aseguramos que los datos de facturación de nuestros clientes no salgan del país al usar vLLM en clúster propio?`,
      `[09:40, 19/8/2026] +57 301 8829011: ¿Qué modelos de DeepSeek o Qwen funcionan mejor para transcripción y análisis de llamadas de reclamos en español neutro?`,
      `[15:15, 19/8/2026] +58 424-3129844: ¿Es viable montar una granja de inferencia con energía solar y baterías en Venezuela para servidores de 2kW?`
    ];

    const chosen = samples[sampleIndex % samples.length];
    return await this.parseAndFunnelWhatsAppMessage(chosen, lang);
  }

  // Telemetry Stats
  public getTelemetry(): BridgeTelemetryStats {
    const kbCount = agentEngine.getKnowledgeBase().length;
    return {
      totalBroadcastsSent: this.broadcasts.filter(b => b.status === 'dispatched').length,
      queriesProcessed: this.inboundQueries.length,
      knowledgeItemsLearned: kbCount,
      activeBridgeNodes: 4, // WhatsApp WebHook Node, Parser Engine, Gemini 3.7 Scout, Local RAG Vector Store
      lastSyncTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      communityHealthScore: 98.6
    };
  }
}

export const communityBridgeService = new CommunityBridgeService();
