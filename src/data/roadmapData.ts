export interface RoadmapMilestone {
  id: string;
  quarter: string;
  phase: string;
  title: {
    es: string;
    en: string;
    pt: string;
  };
  description: {
    es: string;
    en: string;
    pt: string;
  };
  status: 'completed' | 'current' | 'upcoming';
  keyDeliverables: string[];
  metricsTarget: string;
  highlightCategory: string;
}

export const PLATFORM_ROADMAP: RoadmapMilestone[] = [
  {
    id: 'roadmap-q3-2026',
    quarter: 'Q3 2026',
    phase: 'Fase 1: Soberanía Computacional & ROI Calculator',
    title: {
      es: 'Lanzamiento de Arquitectura On-Premises 4x L40S & Desacople de APIs Cloud',
      en: '4x L40S On-Premises Architecture Launch & Cloud API Decoupling',
      pt: 'Lançamento de Arquitetura On-Premises 4x L40S e Desacoplamento de Nuvem'
    },
    description: {
      es: 'Demostración financiera del ahorro de $180,000 USD/año con amortización garantizada en 3.4 meses y simulador interactivo de ROI para CFOs.',
      en: 'Financial proof of $180,000 USD/yr savings with guaranteed 3.4-month payback and interactive CFO ROI simulator.',
      pt: 'Demonstração financeira de economia de $180.000 USD/ano com retorno em 3.4 meses e simulador interativo de ROI para CFOs.'
    },
    status: 'completed',
    keyDeliverables: [
      'Simulador interactivo de ROI en tiempo real con modelado CAPEX vs OPEX',
      'Calculadora de TCO a 36 meses con tasa de ahorro del 68%',
      'Executive Dossier en PDF con firma y certificación financiera',
      'Detección de punto de equilibrio a 3.4 meses'
    ],
    metricsTarget: 'Ahorro de $118,200 USD en Año 1 por cada 50M tokens/mes',
    highlightCategory: 'Finanzas & CFO'
  },
  {
    id: 'roadmap-q4-2026',
    quarter: 'Q4 2026',
    phase: 'Fase 2: Telecom Optical AI & ISP Churn Engine',
    title: {
      es: 'Motor de Mantenimiento Predictivo de Fibra Óptica & Retención de Abonados ISP',
      en: 'Predictive Optical Fiber Maintenance & ISP Churn Retention Engine',
      pt: 'Motor de Manutenção Preditiva de Fibra Óptica e Retenção de Clientes ISP'
    },
    description: {
      es: 'Integración de telemetría de OLTs/ONUs con modelos SLM locales en vLLM para predecir cortes de fibra y mitigar bajas de clientes en telecomunicaciones.',
      en: 'Integration of OLT/ONU telemetry with local SLM models in vLLM to predict fiber cuts and mitigate customer attrition in telecom.',
      pt: 'Integração de telemetria OLT/ONU com modelos locais SLM em vLLM para predizer rompimentos e reduzir cancelamentos.'
    },
    status: 'current',
    keyDeliverables: [
      'Reducción del 42% en caídas no programadas de enlaces de fibra óptica',
      'Protección de $840,000 USD de ARR mediante retención proactiva (+18.5%)',
      'Mapeo automatizado de rutas GIS acelerado en un 90%',
      'Latencia de inferencia local determinística sub-50ms'
    ],
    metricsTarget: '-42% Downtime de Red y +18.5% Retención de Clientes',
    highlightCategory: 'Telecomunicaciones'
  },
  {
    id: 'roadmap-q1-2027',
    quarter: 'Q1 2027',
    phase: 'Fase 3: Multi-Agent Autonomous Mesh & WhatsApp Distribution',
    title: {
      es: 'Orquestación de Malla Multi-Agente Autónoma & Kbox Community Bridge',
      en: 'Autonomous Multi-Agent Mesh Orchestration & Kbox Community Bridge',
      pt: 'Orquestração de Malha Multi-Agente Autônoma e Kbox Community Bridge'
    },
    description: {
      es: 'Despliegue de red de 5 subagentes cooperativos (Investigador, Econometrista, Telecom, Copywriter, Gatekeeper) con distribución autónoma a WhatsApp.',
      en: 'Deployment of a 5-subagent cooperative network (Researcher, Econometrician, Telecom, Copywriter, Gatekeeper) with automated WhatsApp distribution.',
      pt: 'Implementação de rede de 5 subagentes cooperativos com distribuição automatizada via WhatsApp.'
    },
    status: 'upcoming',
    keyDeliverables: [
      '15 White Papers técnicos autogenerados y enriquecidos continuamente',
      'Distribución directa a prospectos vía API oficial wa.me',
      'Indexación vectorial RAG local con cero fuga de datos corporativos',
      'Pipelines automatizados de nutrición de leads ejecutivos'
    ],
    metricsTarget: '1,200 tokens/seg de throughput con 100% de soberanía de datos',
    highlightCategory: 'Inteligencia Artificial'
  },
  {
    id: 'roadmap-q2-2027',
    quarter: 'Q2 2027',
    phase: 'Fase 4: Compute Arbitrage & Private GPU Cloud Monetization',
    title: {
      es: 'Monetización de Capacidad Ociosa de GPU & Arbitraje de Cómputo Privado',
      en: 'Idle GPU Capacity Monetization & Private Compute Arbitrage',
      pt: 'Monetização de Capacidade Ociosa de GPU e Arbitragem de Computação'
    },
    description: {
      es: 'Transformación de servidores corporativos en centros de beneficio vendiendo ventanas de inferencia ociosa a terceros con márgenes brutos de hasta 78%.',
      en: 'Transforming corporate servers into profit centers by selling idle inference windows to third parties with up to 78% gross margins.',
      pt: 'Transformação de servidores corporativos em centros de lucro vendendo capacidade ociosa com margens de até 78%.'
    },
    status: 'upcoming',
    keyDeliverables: [
      'Subasta dinámica de cómputo GPU y token billing automatizado',
      'Particionamiento dinámico de GPUs NVIDIA L40S (MIG / vGPU)',
      'Escudo de privacidad multi-tenant y aislamiento criptográfico',
      'Integración con billeteras de liquidación de créditos en tiempo real'
    ],
    metricsTarget: '78% Margen Bruto en venta de inferencia excedente',
    highlightCategory: 'Monetización & Negocio'
  }
];
