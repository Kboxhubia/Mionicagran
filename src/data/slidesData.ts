import { SlideData, PredictiveAlert } from '../types';

export const SLIDES_DATA: SlideData[] = [
  {
    id: 1,
    slug: 'cover',
    variantNumber: 'Variant 1 of 10',
    badge: 'Executive Briefing • August 2026',
    title: 'The $180,000 USD Error: Why Your AI Strategy is Burning Capital',
    subtitle: 'A Financial Architecture Analysis for CEOs, CFOs, and CTOs in Telecom & Enterprise Infrastructure',
    category: 'Strategic',
    durationSec: 10,
    type: 'cover',
    takeaway: 'Cloud API models create compounding linear liabilities. Capital allocation in on-premise AI assets yields immediate margin expansion and sovereign control.',
    narration: {
      es: 'Bienvenidos a este análisis estratégico para directores ejecutivos y de finanzas. Exploramos por qué depender exclusivamente de APIs en la nube puede costar más de 180,000 dólares anuales y cómo la arquitectura local transforma este gasto en un activo de alto rendimiento.',
      en: 'Welcome to this strategic financial analysis for CEOs, CFOs, and CTOs. We uncover why relying solely on cloud AI APIs drains over $180,000 annually and how an on-premise asset architecture delivers immediate capital efficiency.'
    },
    metrics: [
      { label: 'Annual Cloud Drain', value: '$180,000+', subtext: 'Pure OPEX per enterprise', color: 'rose' },
      { label: 'On-Prem CAPEX', value: '$48,000', subtext: 'Full 4x L40S Cluster', color: 'cyan' },
      { label: 'Break-Even Point', value: '3.4 Months', subtext: 'Guaranteed ROI horizon', color: 'emerald', highlight: true }
    ]
  },
  {
    id: 2,
    slug: 'problem-cloud-cost',
    variantNumber: 'Variant 2 of 10',
    badge: 'The Strategic Problem • Slide 2 of 10',
    title: 'Problem: The Infinite Cost of Cloud APIs',
    subtitle: 'Financial Drain: >$180,000/Year Per Enterprise Burning Capital on Proprietary API Fees',
    category: 'Financial',
    durationSec: 12,
    type: 'problem_cloud_drain',
    takeaway: 'As enterprise token demand grows linearly, cloud bills compound exponentially without creating residual balance sheet value.',
    narration: {
      es: 'El problema central: a medida que crece la demanda de IA empresarial, los costos de API en la nube se disparan de forma continua. Una empresa promedio gasta más de 15,000 dólares mensuales en pagos recurrentes sin acumular ningún activo tangible.',
      en: 'The core problem: as enterprise AI demand scales, cloud API costs escalate indefinitely. The average enterprise expends over $15,000 per month in continuous fees without creating any equity or residual balance sheet value.'
    },
    metrics: [
      { label: 'Monthly Drain', value: '$15,000 / mo', subtext: 'Recurring API billing', color: 'rose' },
      { label: '3-Year Cloud OPEX', value: '$540,000', subtext: 'Zero asset retention', color: 'amber' },
      { label: 'Cost/1M Tokens', value: '$5.00 - $15.00', subtext: 'Volatile third-party pricing', color: 'rose' }
    ],
    bullets: [
      'Token consumption increases 35% quarter-over-quarter across telecom workflows',
      'Data leaves enterprise boundaries, triggering regulatory and sovereignty risks',
      'No asset depreciation or tax equity benefits under pure SaaS billing'
    ]
  },
  {
    id: 3,
    slug: 'solution-on-prem-roi',
    variantNumber: 'Variant 3 of 10',
    badge: 'Financial Advantage • Slide 3 of 10',
    title: 'Solution: On-Premise Financial Advantage',
    subtitle: 'CAPEX vs OPEX Breakdown: $48k Capital Asset vs $180k Annual SaaS Expenditure',
    category: 'Financial',
    durationSec: 14,
    type: 'solution_roi',
    takeaway: 'At an on-premise investment of $48,000, break-even is achieved in month 3.4. Over 12 months, enterprise savings exceed $118,000.',
    narration: {
      es: 'La solución financiera radica en capitalizar la infraestructura: un servidor local de alta densidad cuesta 48,000 dólares, alcanzando el punto de equilibrio en apenas 3.4 meses. A partir de ese momento, cada inferencia genera margen puro.',
      en: 'The financial solution is infrastructure capitalization: a high-density on-premise server costs $48,000, reaching break-even in just 3.4 months. From that milestone onward, every inference generates pure operational margin.'
    },
    metrics: [
      { label: 'CAPEX Investment', value: '$48,000', subtext: '4x NVIDIA L40S 48GB Server', color: 'cyan' },
      { label: 'Break-Even', value: '3.4 Months', subtext: 'At $15,000/mo baseline', color: 'emerald', highlight: true },
      { label: 'Year 1 Net Savings', value: '$118,000+', subtext: 'After power & maintenance', color: 'emerald' },
      { label: '3-Year TCO Advantage', value: '$412,000', subtext: 'Retained executive capital', color: 'amber' }
    ],
    bullets: [
      'Rapid ROI & predictable budgeting with zero token metering surprises',
      'Full data sovereignty & compliance with telecom and financial standards',
      'Hardware depreciation benefits on company balance sheets'
    ]
  },
  {
    id: 4,
    slug: 'hardware-infrastructure',
    variantNumber: 'Variant 4 of 10',
    badge: 'Hardware Deep Dive • Slide 4 of 10',
    title: 'Infrastructure: High-Density AI Hardware',
    subtitle: 'Enterprise Architecture: 4x NVIDIA L40S, 100GbE Optical Fabric & N+1 Redundancy',
    category: 'Architecture',
    durationSec: 13,
    type: 'hardware_architecture',
    takeaway: 'Compact 2U/4U rack topology delivering 2,944 TFLOPS of FP8 AI compute with dual redundant power and fiber optics integration.',
    narration: {
      es: 'Analizamos la arquitectura técnica: cuatro GPUs NVIDIA L40S con 192 gigabytes de memoria VRAM total, conectividad de fibra óptica a 100 Gigabits y redundancia N más uno en energía y enfriamiento.',
      en: 'Examining technical architecture: four NVIDIA L40S GPUs with 192 gigabytes of total VRAM, 100GbE fiber optic interconnects, and N+1 power and thermal redundancy.'
    },
    metrics: [
      { label: 'GPU Density', value: '4x L40S (192GB)', subtext: 'Full FP8/INT4 capability', color: 'cyan' },
      { label: 'Network Fabric', value: '100GbE Optical', subtext: 'Sub-millisecond interconnect', color: 'emerald' },
      { label: 'Power & Thermal', value: 'N+1 Redundant', subtext: '2000W Platinum Titanium', color: 'amber' }
    ],
    bullets: [
      'High-throughput vLLM engine delivering up to 1,200 tokens/sec continuous output',
      'Optical fiber transceiver integration for low-jitter edge compute pipelines',
      'Zero external data egress charges during model fine-tuning and inference'
    ]
  },
  {
    id: 5,
    slug: 'financial-decision-matrix',
    variantNumber: 'Variant 5 of 10',
    badge: 'CFO Matrix • Slide 5 of 10',
    title: 'Financial Decision Matrix: AI Infrastructure',
    subtitle: 'Matriz de Decisión Financiera: Cloud API (OPEX Puro) vs On-Premise (CAPEX + OPEX)',
    category: 'Financial',
    durationSec: 15,
    type: 'decision_matrix',
    takeaway: 'On-premise reduces token inference costs by up to 98% while providing sub-50ms deterministic latency and absolute compliance.',
    narration: {
      es: 'La matriz de decisión financiera contrasta de forma contundente: el costo por millón de tokens baja de 5 a 15 dólares en la nube a menos de 50 centavos en local, con latencia garantizada menor a 50 milisegundos.',
      en: 'The financial decision matrix shows a decisive contrast: cost per million tokens drops from $5-$15 in cloud to under 50 cents on-premise, with sub-50ms deterministic latency.'
    },
    metrics: [
      { label: 'Cloud Cost/1M Tokens', value: '$5.00 - $15.00', subtext: 'Commercial APIs', color: 'rose' },
      { label: 'On-Prem Cost/1M Tokens', value: '$0.10 - $0.50', subtext: 'Power + Hardware amortized', color: 'emerald', highlight: true },
      { label: 'Inference Latency', value: '< 50ms Local', subtext: 'vs 350-1200ms Cloud', color: 'cyan' }
    ]
  },
  {
    id: 6,
    slug: 'telecom-cases-1',
    variantNumber: 'Variant 6 of 10',
    badge: 'Telecom & ISP Applications • Slide 6 of 10',
    title: 'Use Cases: Telecom & Fiber Optics (Part 1)',
    subtitle: 'Proactive Network Operations, Churn Prevention & Dynamic Physical Layer Optimization',
    category: 'Telecom',
    durationSec: 14,
    type: 'telecom_cases_1',
    takeaway: 'Local LLMs and neural models process millions of telemetry metrics per second directly at the central office without costly cloud roundtrips.',
    narration: {
      es: 'En telecomunicaciones y fibra óptica, la IA local permite mantenimiento predictivo de redes, predicción de abandono de clientes en ISPs y optimización de señales ópticas en tiempo real con cero latencia.',
      en: 'In telecom and fiber optics, on-premise AI empowers predictive network maintenance, ISP customer churn forecasting, and real-time optical signal optimization with near-zero latency.'
    },
    metrics: [
      { label: 'Downtime Reduction', value: '-42%', subtext: 'Predictive equipment repair', color: 'emerald' },
      { label: 'Churn Prevention', value: '+18.5%', subtext: 'Subscriber retention gain', color: 'cyan' },
      { label: 'Optical Tuning', value: '<10ms', subtext: 'Signal dispersion correction', color: 'amber' }
    ]
  },
  {
    id: 7,
    slug: 'telecom-cases-2',
    variantNumber: 'Variant 7 of 10',
    badge: 'Operational Scale • Slide 7 of 10',
    title: 'Use Cases: Telecom & Fiber Optics (Part 2)',
    subtitle: 'Dynamic CAPEX Models, Automated GIS Mapping, Fraud Detection & 24/7 LLM Tier-1 Support',
    category: 'Telecom',
    durationSec: 14,
    type: 'telecom_cases_2',
    takeaway: 'Autonomous GIS fiber route planning accelerates deployment by 90% while AI billing fraud prevention saves over $1.2M annually.',
    narration: {
      es: 'Continuando con los casos de uso: modelos dinámicos de CAPEX reducen el gasto inicial un 22%, el mapeo GIS acelera el despliegue un 90% y los agentes de soporte técnico resuelven el 95% de casos en primer contacto.',
      en: 'Continuing operational use cases: dynamic CAPEX models reduce upfront allocation by 22%, automated GIS mapping accelerates fiber rollout by 90%, and AI technical agents achieve 95% first contact resolution.'
    },
    metrics: [
      { label: 'CAPEX Reduction', value: '-22%', subtext: 'Optimized deployment routes', color: 'emerald' },
      { label: 'Rollout Velocity', value: '90% Faster', subtext: '5,400 km planned routes', color: 'cyan' },
      { label: 'Fraud Losses Blocked', value: '$1.2M / yr', subtext: 'Real-time billing anomaly check', color: 'amber', highlight: true },
      { label: 'First Contact Res.', value: '95%', subtext: '-30% Support OPEX', color: 'emerald' }
    ]
  },
  {
    id: 8,
    slug: 'mlops-strategy',
    variantNumber: 'Variant 8 of 10',
    badge: 'Operational Efficiency • Slide 8 of 10',
    title: 'MLOps: Beyond the Hardware Costs',
    subtitle: 'Hardware is Cheap, Talent is Expensive — Maximizing GPU ROI through Modern Open-Source Stacks',
    category: 'MLOps',
    durationSec: 13,
    type: 'mlops_strategy',
    takeaway: 'vLLM continuous batching and INT4 quantization quadruple effective inference capacity without purchasing additional accelerators.',
    narration: {
      es: 'La clave del MLOps moderno: el hardware es económico comparado con el talento humano. Con vLLM, cuantización INT4 y enrutamiento inteligente de modelos, multiplicamos por cuatro la eficiencia de cada GPU.',
      en: 'The core MLOps principle: hardware is cheap compared to specialized talent. Utilizing vLLM, INT4 quantization, and intelligent model routing quadruples each GPU cluster’s effective throughput.'
    },
    metrics: [
      { label: 'vLLM Acceleration', value: '4.2x', subtext: 'Throughput vs default engine', color: 'cyan' },
      { label: 'Memory Footprint', value: '-70%', subtext: 'INT4 & FP8 quantization', color: 'emerald' },
      { label: 'Compute Idle Time', value: '< 8%', subtext: 'Continuous tensor batching', color: 'amber' }
    ]
  },
  {
    id: 9,
    slug: 'hybrid-ai-architecture',
    variantNumber: 'Variant 9 of 10',
    badge: 'Enterprise Topology • Slide 9 of 10',
    title: 'Strategy: Hybrid AI Architecture',
    subtitle: 'Controlling the Margin: 90% Base Load On-Premises (CAPEX) + 10% Peak Burst in Cloud (OPEX)',
    category: 'Architecture',
    durationSec: 14,
    type: 'hybrid_architecture',
    takeaway: 'The golden ratio for CFOs: Absorb predictable steady-state token traffic on sovereign hardware and burst only volatile 10% spikes to public clouds.',
    narration: {
      es: 'La estrategia híbrida recomendada para directores de tecnología y finanzas: absorber el 90% de la carga base en servidores propios predecibles y derivar únicamente picos del 10% a la nube.',
      en: 'The recommended hybrid strategy for executive leadership: absorb 90% base load on predictable on-premise hardware and route only 10% peak burst spikes to public cloud providers.'
    },
    metrics: [
      { label: 'On-Prem Base Load', value: '90%', subtext: 'Guaranteed flat-cost execution', color: 'cyan', highlight: true },
      { label: 'Cloud Burst Load', value: '10%', subtext: 'Elastic peak buffer', color: 'amber' },
      { label: 'Blended TCO Savings', value: '78.4%', subtext: 'Compared to 100% Cloud SaaS', color: 'emerald' }
    ]
  },
  {
    id: 10,
    slug: 'executive-profile',
    variantNumber: 'Variant 9 of 10 (Profile)',
    badge: 'Executive Bio • Slide 10 of 10',
    title: 'Professional Profile - Ing. Jorge Huerta',
    subtitle: 'Telecom Executive with 15+ Years in Strategic Financial Planning & Infrastructure Deployment',
    category: 'Executive',
    durationSec: 12,
    type: 'executive_profile',
    takeaway: 'Specialized in bridging deep optical/telecom hardware engineering with executive financial modeling and AI capital allocation.',
    narration: {
      es: 'Perfil profesional: Ingeniero Jorge Huerta, ejecutivo de telecomunicaciones con más de 15 años de trayectoria en planificación financiera estratégica, despliegue de infraestructura de fibra óptica y optimización de inversiones en IA.',
      en: 'Professional Profile: Ing. Jorge Huerta, Telecom Executive with 15+ years of experience in strategic financial planning, optical fiber infrastructure deployment, and enterprise AI CAPEX optimization.'
    },
    metrics: [
      { label: 'Industry Experience', value: '15+ Years', subtext: 'Telecom & Fiber Optics', color: 'cyan' },
      { label: 'Managed Infrastructure', value: '$50M+ USD', subtext: 'CAPEX / OPEX Projects', color: 'emerald' },
      { label: 'Specialization', value: 'AI & FinOps', subtext: 'Hardware ROI & MLOps', color: 'amber' }
    ],
    bullets: [
      'Telecom & Fiber Optics Long-haul Strategy',
      'AI High-Density Infrastructure Engineering (NVIDIA L40S, H100, B200)',
      'Corporate Financial Modeling & CAPEX vs OPEX Arbitration',
      'Enterprise Data Sovereignty & Telecom Compliance',
      'Founder & Architect of Kboxhubia Financial AI Hub'
    ]
  },
  {
    id: 11,
    slug: 'call-to-action',
    variantNumber: 'Variant 10 of 10',
    badge: 'Call to Action • Next Steps',
    title: 'Transform Your AI Infrastructure: Stop Burning Capital',
    subtitle: 'Book a Financial Architecture Diagnostic & Embed Dynamic Financial Widgets in Your Portal',
    category: 'Strategic',
    durationSec: 15,
    type: 'cta_contact',
    takeaway: 'Contact Ing. Jorge Huerta to audit your current cloud token drain and deploy an on-premise hybrid AI cluster with sub-4-month payback.',
    narration: {
      es: 'Transforme su infraestructura de inteligencia artificial hoy mismo. Detenga la fuga de capital en la nube y contacte directamente al Ingeniero Jorge Huerta para una sesión de diagnóstico financiero y técnico.',
      en: 'Transform your enterprise AI infrastructure today. Halt cloud capital drain and contact Ing. Jorge Huerta for a strategic financial and technical architecture diagnostic.'
    },
    metrics: [
      { label: 'Email Contact', value: 'kuboxhubia@gmail.com', subtext: 'Direct Executive Inquiries', color: 'amber', highlight: true },
      { label: 'Official Web Hub', value: 'kboxhubia.vercel.app', subtext: 'Dynamic Financial Widgets', color: 'cyan' },
      { label: 'Diagnostic Audit', value: '48h Delivery', subtext: 'Custom CAPEX/OPEX TCO Report', color: 'emerald' }
    ]
  }
];

export const PREDICTIVE_ALERTS: PredictiveAlert[] = [
  {
    id: 'alt-1',
    title: 'Cloud Token Price Escalation Detected',
    description: 'Tier-1 public LLM provider API rates projected to rise +18.4% by Q4 2026 due to datacenter power constraints.',
    category: 'Market',
    impact: 'Critical',
    timestamp: 'Live Market Signal',
    metric: '+18.4% OPEX Risk',
    trend: 'up',
    recommendation: 'Accelerate migration of 90% steady-state token volume to on-premise L40S nodes within 60 days.'
  },
  {
    id: 'alt-2',
    title: 'NVIDIA L40S Spot Delivery Stabilization',
    description: 'Lead times for 48GB PCIe L40S accelerators compressed to 14 days, offering ideal CAPEX acquisition window.',
    category: 'Hardware',
    impact: 'High',
    timestamp: 'Supply Intelligence',
    metric: '$48,000 Turnkey',
    trend: 'down',
    recommendation: 'Lock in server chassis order to secure sub-3.5 month payback before seasonal enterprise budget cutoffs.'
  },
  {
    id: 'alt-3',
    title: 'Telecom Churn Anomaly in Fiber Segment',
    description: 'Sub-50ms localized predictive churn model flagged 14,200 high-value ISP subscribers requiring proactive retention outreach.',
    category: 'Telecom',
    impact: 'High',
    timestamp: 'Autonomous Telemetry',
    metric: '$840k Retained ARR',
    trend: 'up',
    recommendation: 'Deploy automated bandwidth boosting scripts directly via on-premise inference cluster.'
  },
  {
    id: 'alt-4',
    title: 'Executive CFO Optimization Recommendation',
    description: 'Current enterprise simulation indicates $11,800/month instant cash flow liberation upon on-premise transition.',
    category: 'Financial',
    impact: 'Critical',
    timestamp: 'Financial Modeling Engine',
    metric: '$141,600 / yr net',
    trend: 'up',
    recommendation: 'Export PDF dossier and present CAPEX reallocation proposal to Board of Directors.'
  }
];
