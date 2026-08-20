export type Language = 'es' | 'en' | 'pt';

export interface SlideMetric {
  label: string;
  value: string;
  subtext?: string;
  color?: 'cyan' | 'amber' | 'emerald' | 'rose' | 'blue';
  highlight?: boolean;
}

export interface LocalizedSlideContent {
  badge: string;
  title: string;
  subtitle: string;
  takeaway: string;
  bullets: string[];
  metrics: SlideMetric[];
  narration: string;
}

export interface SlideData {
  id: number;
  slug: string;
  variantNumber: string;
  category: 'Strategic' | 'Financial' | 'Architecture' | 'Telecom' | 'MLOps' | 'Executive';
  durationSec: number;
  badge: string;
  title: string;
  subtitle: string;
  takeaway?: string;
  bullets?: string[];
  metrics?: SlideMetric[];
  narration: {
    es: string;
    en: string;
    pt?: string;
  };
  translations?: {
    es: LocalizedSlideContent;
    en: LocalizedSlideContent;
    pt: LocalizedSlideContent;
  };
  type: 
    | 'cover'
    | 'problem_cloud_drain'
    | 'solution_roi'
    | 'hardware_architecture'
    | 'decision_matrix'
    | 'telecom_cases_1'
    | 'telecom_cases_2'
    | 'mlops_strategy'
    | 'hybrid_architecture'
    | 'executive_profile'
    | 'cta_contact'
    | 'dynamic_trend'
    | 'python_capabilities';
}

export interface PredictiveAlert {
  id: string;
  title: string;
  description: string;
  category: 'Market' | 'Hardware' | 'Financial' | 'Telecom';
  impact: 'High' | 'Medium' | 'Critical';
  timestamp: string;
  metric: string;
  trend: 'up' | 'down' | 'neutral';
  recommendation: string;
  translations?: {
    es: { title: string; description: string; recommendation: string };
    en: { title: string; description: string; recommendation: string };
    pt: { title: string; description: string; recommendation: string };
  };
}

export interface RoiSimulationParams {
  monthlyTokensMillions: number; // e.g. 50M tokens
  cloudApiCostPerMillion: number; // e.g. $10
  serverHardwareCapex: number; // e.g. $48,000
  monthlyElectricityCooling: number; // e.g. $650
  monthlyMlOpsEngineering: number; // e.g. $2,500
  horizonMonths: number; // e.g. 12 or 24 or 36
}

export interface AudioSettings {
  isMuted: boolean;
  volume: number; // 0 to 1
  theme: 'executive' | 'cyber' | 'minimal' | 'pulse';
  isPlaying: boolean;
  voiceNarrationEnabled: boolean;
  voiceLanguage: Language;
  voiceVolume: number;
}

export type TrendPlatform = 'linkedin' | 'x' | 'hackernews' | 'arxiv' | 'reddit';
export type TrendSector = 'entertainment' | 'science' | 'ai_world';

export interface TrendSignal {
  id: string;
  platform: TrendPlatform;
  sector: TrendSector;
  title: string;
  tag: string;
  engagement: string;
  growth: string;
  summary: {
    es: string;
    en: string;
    pt: string;
  };
  samplePrompt: {
    es: string;
    en: string;
    pt: string;
  };
}

export interface PythonSandboxPreset {
  id: string;
  title: string;
  category: 'MonteCarlo' | 'VRAM' | 'Telecom' | 'DataViz' | 'MLOps' | 'Scraper' | 'LaTeX' | 'Financial' | 'Benchmark';
  description: {
    es: string;
    en: string;
    pt: string;
  };
  code: string;
  outputPreview?: string;
}

export interface InteractionLog {
  id: string;
  feature: string;
  action: 'open' | 'click' | 'export' | 'interact' | 'navigate' | 'unlock';
  timestamp: string;
  userRole?: string;
  details?: string;
}
