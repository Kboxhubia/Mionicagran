export interface LeadRecord {
  id: string;
  contact: string; // Email or phone
  type: 'email' | 'phone';
  role: string;
  source: string;
  timestamp: string;
  country?: string;
  status: 'freemium_active' | 'vip_opportunity' | 'contacted';
}

export interface ResearchTopic {
  id: string;
  topicNumber: number;
  title: {
    es: string;
    en: string;
    pt: string;
  };
  category: 'Finanzas' | 'Telecom' | 'MLOps' | 'Monetizacion' | 'Seguridad' | 'Banca';
  summary: {
    es: string;
    en: string;
    pt: string;
  };
  abstract: {
    es: string;
    en: string;
    pt: string;
  };
  methodology: {
    es: string;
    en: string;
    pt: string;
  };
  sources: Array<{ name: string; type: 'IEEE' | 'arXiv' | 'SEC' | 'Nature' | 'Industry'; citation: string }>;
  isPublished: boolean; // Managed by Admin Dashboard (9 out of 15 published by default)
  readsCount: number;
  rating: number;
}

export interface SurveyVote {
  id: string;
  category: string;
  selectedOption: string;
  suggestedTopic?: string;
  userRole?: string;
  timestamp: string;
}

export interface KnowledgeItem {
  id: string;
  query: string;
  answer: string;
  category: string;
  source: 'local_knowledge' | 'web_scout_gemini' | 'admin_curated';
  confidenceScore: number;
  usageCount: number;
  createdAt: string;
  lastAccessed: string;
}

export interface MoneyFarmTrend {
  id: string;
  number: number;
  title: {
    es: string;
    en: string;
    pt: string;
  };
  headline: {
    es: string;
    en: string;
    pt: string;
  };
  description: {
    es: string;
    en: string;
    pt: string;
  };
  projectedRoi: string;
  capitalRequired: string;
  timeToProfit: string;
  techStack: string[];
  keyRisk: {
    es: string;
    en: string;
    pt: string;
  };
}

export interface WhatsAppBroadcastItem {
  id: string;
  title: string;
  category: 'WhitePaper' | 'MoneyFarm' | 'HardwareTrend' | 'TelecomChurn' | 'MarketAlert';
  targetGroup: string;
  formattedMessage: string;
  triggerType: 'automated_cron' | 'event_driven' | 'manual_dispatch';
  scheduleLabel: string;
  status: 'scheduled' | 'dispatched' | 'pending';
  engagementScore: number;
  createdAt: string;
  dispatchedAt?: string;
}

export interface InboundWhatsAppQuery {
  id: string;
  rawText: string;
  senderPhone: string;
  senderName?: string;
  extractedQuery: string;
  category: 'Technical' | 'Financial' | 'Hardware' | 'Telecom' | 'Security';
  detectedIntent: string;
  parsedAt: string;
  agentResponse: string;
  sourcesCited: string[];
  status: 'parsed_and_learned' | 'learning_in_progress' | 'queued';
  funneledKbId?: string;
  confidenceScore: number;
}

export interface BridgeTelemetryStats {
  totalBroadcastsSent: number;
  queriesProcessed: number;
  knowledgeItemsLearned: number;
  activeBridgeNodes: number;
  lastSyncTime: string;
  communityHealthScore: number;
}

export interface BroadcastScheduleConfig {
  id: string;
  name: string;
  frequency: 'daily_morning' | 'bi_weekly' | 'hourly_alert' | 'weekly_digest';
  cadenceText: string;
  templateType: 'executive_briefing' | 'money_farm_signal' | 'whitepaper_spotlight' | 'gpu_arbitrage';
  enabled: boolean;
  lastRun: string;
  nextRun: string;
}

export interface WelcomeMessageConfig {
  template: string;
  enabled: boolean;
  autoCopyOnJoin: boolean;
  lastUpdated: string;
  welcomeCount: number;
  selectedPresetId?: string;
}

export interface WelcomePreset {
  id: string;
  name: string;
  description: string;
  category: 'executive' | 'technical' | 'money_farm' | 'telecom';
  template: string;
}

