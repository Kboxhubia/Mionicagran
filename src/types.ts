export interface SlideMetric {
  label: string;
  value: string;
  subtext?: string;
  color?: 'cyan' | 'amber' | 'emerald' | 'rose' | 'blue';
  highlight?: boolean;
}

export interface SlideData {
  id: number;
  slug: string;
  variantNumber: string;
  badge: string;
  title: string;
  subtitle: string;
  category: 'Strategic' | 'Financial' | 'Architecture' | 'Telecom' | 'MLOps' | 'Executive';
  durationSec: number;
  narration: {
    es: string;
    en: string;
  };
  metrics?: SlideMetric[];
  bullets?: string[];
  takeaway?: string;
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
    | 'cta_contact';
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
  voiceLanguage: 'es' | 'en';
  voiceVolume: number;
}
