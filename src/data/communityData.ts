import { ResearchTopic, MoneyFarmTrend, KnowledgeItem, LeadRecord } from '../types/communityTypes';

export const ADMIN_PHONE_NUMBER = '+584123931011';
export const WHATSAPP_GROUP_NAME = 'Kuboxhubia-Mionicagran IA';
export const WHATSAPP_DIRECT_LINK = `https://wa.me/584123931011?text=Hola%20Ing.%20Jorge%20Huerta,%20deseo%20unirme%20al%20grupo%20oficial%20Kuboxhubia-Mionicagran%20IA%20y%20acceder%20a%20los%20White%20Papers.`;

export const INITIAL_LEADS: LeadRecord[] = [
  {
    id: 'lead-1',
    contact: 'cfo.latam@telecomcorp.com',
    type: 'email',
    role: 'CFO / Finanzas',
    source: 'Modal Freemium 7s',
    timestamp: '2026-08-19 18:30:12',
    country: 'México',
    status: 'vip_opportunity'
  },
  {
    id: 'lead-2',
    contact: '+584149021188',
    type: 'phone',
    role: 'CTO / Infraestructura',
    source: 'Modal Freemium 7s',
    timestamp: '2026-08-19 19:15:44',
    country: 'Venezuela',
    status: 'freemium_active'
  },
  {
    id: 'lead-3',
    contact: 'director.it@bancofinanzas.com',
    type: 'email',
    role: 'Director IT / MLOps',
    source: 'Descarga White Paper',
    timestamp: '2026-08-19 20:05:00',
    country: 'Colombia',
    status: 'vip_opportunity'
  }
];

export const INITIAL_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'kb-1',
    query: '¿Por qué 4x NVIDIA L40S es superior a H100 para inferencia en empresas medianas?',
    answer: 'La configuración de 4x NVIDIA L40S ofrece 192GB de VRAM GDDR6 con ancho de banda de 3.4 TB/s y 5.864 Tensor Cores de 4ª generación a un CAPEX de ~$48k USD, frente a >$350k USD de un nodo DGX H100. En modelos cuantizados FP8 (Llama 3.3 70B, DeepSeek-V3), 4x L40S entrega >140 tokens/segundo con costo eléctrico 3.8x inferior (1.400W vs 10.200W).',
    category: 'Hardware & CAPEX',
    source: 'admin_curated',
    confidenceScore: 0.99,
    usageCount: 42,
    createdAt: '2026-08-15',
    lastAccessed: '2026-08-19'
  },
  {
    id: 'kb-2',
    query: '¿Cómo se amortiza fiscalmente el hardware de IA bajo norma MACRS a 5 años?',
    answer: 'El hardware de cómputo para IA califica como equipo de procesamiento de datos de 5 años bajo la regla MACRS (Modified Accelerated Cost Recovery System). En el Año 1 permite deducir el 20% más depreciación especial Section 179 (hasta 100% de deducción inmediata en el primer ejercicio fiscal), generando un escudo tributario de hasta $14.400 USD en ahorro de impuesto a la renta.',
    category: 'Finanzas & CFO',
    source: 'admin_curated',
    confidenceScore: 0.98,
    usageCount: 38,
    createdAt: '2026-08-15',
    lastAccessed: '2026-08-19'
  },
  {
    id: 'kb-3',
    query: '¿Cuál es la fórmula matemática del Payback o Punto de Equilibrio?',
    answer: 'Payback (Meses) = CAPEX Total Hardware / (Gasto Mensual Nube OPEX - Gasto Mensual On-Premises OPEX). Con un CAPEX de $48.000, nube de $16.740/mes y on-premise de $2.650/mes ($650 energía + $2.000 MLOps), el ahorro neto mensual es $14.090/mes, logrando el punto de equilibrio en 3,40 meses.',
    category: 'Matemáticas Financieras',
    source: 'admin_curated',
    confidenceScore: 1.0,
    usageCount: 57,
    createdAt: '2026-08-15',
    lastAccessed: '2026-08-19'
  },
  {
    id: 'kb-4',
    query: '¿Cómo mitigar el Churn en telecomunicaciones usando modelos locales?',
    answer: 'Se integran datos de telemetría de OLTs/ONUs (atenuación óptica dBm, microcortes, latencia BGP) y CDRs de facturación en un modelo XGBoost + Llama 3.3 8B cuantizado local en vLLM. Procesa 50.000 clientes/minuto sin enviar datos confidenciales a la nube pública, prediciendo bajas con 91.4% de precisión con 14 días de anticipación.',
    category: 'Telecom & Churn',
    source: 'local_knowledge',
    confidenceScore: 0.96,
    usageCount: 29,
    createdAt: '2026-08-16',
    lastAccessed: '2026-08-19'
  }
];

export const ALL_15_RESEARCH_TOPICS: ResearchTopic[] = [
  {
    id: 'topic-01',
    topicNumber: 1,
    title: {
      es: 'Estrategias de Arbitraje de Cómputo: Monetización de Clústeres Privados vs Inflación en la Nube',
      en: 'Compute Arbitrage Strategies: Monetizing Private GPU Clusters vs Cloud Price Inflation',
      pt: 'Estratégias de Arbitragem de Computação: Monetização de Clusters Privados vs Inflação na Nuvem'
    },
    category: 'Finanzas',
    summary: {
      es: 'Cómo transformar infraestructura de GPUs propias en un centro de utilidades vendiendo tokens de inferencia con márgenes del 78%.',
      en: 'How to transform private GPU infrastructure into a profit center by selling inference tokens with 78% net margins.',
      pt: 'Como transformar infraestrutura de GPUs próprias em centro de lucro vendendo tokens com margem de 78%.'
    },
    abstract: {
      es: 'Este documento analiza la discrepancia de precios entre las APIs de nube pública ($0.035 por 1k tokens) y el costo marginal de cómputo on-premises ($0.0042 por 1k tokens en arquitectura L40S). Presentamos el modelo de amortización acelerada y venta de exceso de capacidad a terceros.',
      en: 'This paper investigates the price arbitrage between public cloud APIs ($0.035/1k tokens) and private on-premises inference marginal cost ($0.0042/1k tokens on L40S). We present accelerated payback models and excess capacity monetization.',
      pt: 'Este documento analisa a discrepância de preços entre APIs de nuvem pública e o custo marginal on-premise, apresentando modelos de amortização acelerada.'
    },
    methodology: {
      es: 'Medición de throughput en vLLM v0.6.2 con PagedAttention v2, cuantización AWQ/FP8, métricas de energía Watts/Token y cálculo de PUE ponderado.',
      en: 'Throughput measurement in vLLM v0.6.2 with PagedAttention v2, AWQ/FP8 quantization, Watts/Token energy metrics and weighted PUE.',
      pt: 'Medição de vazão no vLLM com PagedAttention v2, quantização FP8 e métricas de energia Watts/Token.'
    },
    sources: [
      { name: 'IEEE Computer Society', type: 'IEEE', citation: 'IEEE Trans. on Cloud Computing, Vol. 14, pp. 412-428, 2025.' },
      { name: 'arXiv Computer Science', type: 'arXiv', citation: 'arXiv:2409.11289 [cs.DC] "Cost Efficiency in Decentralized LLM Serving"' }
    ],
    isPublished: true,
    readsCount: 1420,
    rating: 4.9
  },
  {
    id: 'topic-02',
    topicNumber: 2,
    title: {
      es: 'Algoritmos Predictivos de Churn en Redes de Fibra Óptica (GPON) con IA Local',
      en: 'Predictive Churn Algorithms in GPON Fiber Networks using Local AI Inference',
      pt: 'Algoritmos Preditivos de Churn em Redes de Fibra Óptica com IA Local'
    },
    category: 'Telecom',
    summary: {
      es: 'Detección temprana de bajas de clientes ISP con 14 días de anticipación correlacionando parámetros ópticos y métricas de soporte.',
      en: 'Early detection of ISP customer churn 14 days in advance by correlating optical metrics and support tickets.',
      pt: 'Detecção precoce de cancelamentos em provedores de internet com 14 dias de antecedência.'
    },
    abstract: {
      es: 'Modelo de ensamble híbrido XGBoost + LLM local que ingiere eventos syslog, niveles de potencia óptica Rx/Tx y tiempo medio de resolución de tickets. Reduce el churn mensual en 2.3 puntos porcentuales, protegiendo $42.000 USD de MRR por cada 10.000 abonados.',
      en: 'Hybrid ensemble model (XGBoost + local LLM) ingesting syslog events, optical power levels, and ticket MTTR, lowering monthly churn by 2.3 percentage points.',
      pt: 'Modelo híbrido que processa eventos de rede e reduz o cancelamento mensal em 2.3 pontos percentuais.'
    },
    methodology: {
      es: 'Entrenamiento supervisado con 12 meses de datos de CDR y telemetría OLT ZTE/Huawei; validación cruzada estratificada de 5 pliegues.',
      en: 'Supervised training with 12 months of CDR and ZTE/Huawei OLT telemetry; 5-fold stratified cross-validation.',
      pt: 'Treinamento supervisionado com 12 meses de dados de CDR e telemetria OLT.'
    },
    sources: [
      { name: 'ITU-T Recommendations', type: 'Industry', citation: 'ITU-T G.984.3 / ITU-T Y.3172 "Architectural framework for ML in future networks"' },
      { name: 'IEEE Communications Letters', type: 'IEEE', citation: 'IEEE Comm. Lett., vol. 28, no. 4, pp. 880-884, 2025.' }
    ],
    isPublished: true,
    readsCount: 980,
    rating: 4.8
  },
  {
    id: 'topic-03',
    topicNumber: 3,
    title: {
      es: 'Agentes Autónomos en FinTech: Automatización de Scoring Crediticio y Auditoría',
      en: 'Autonomous FinTech Agents: Credit Scoring & Balance Sheet Automated Audit',
      pt: 'Agentes Autônomos em FinTech: Scoring de Crédito e Auditoria Automatizada'
    },
    category: 'Finanzas',
    summary: {
      es: 'Pipelines multi-agente para lectura de estados de cuenta bancarios, detección de riesgo y cumplimiento KYC en segundos.',
      en: 'Multi-agent pipelines for bank statement parsing, risk detection, and KYC compliance in seconds.',
      pt: 'Pipelines multiagente para leitura de extratos bancários e conformidade KYC em segundos.'
    },
    abstract: {
      es: 'Arquitectura de agentes colaborativos que procesan balances contables, modelos de flujo de caja libre y extractos fiscales para emitir dictámenes de crédito comercial con trazabilidad criptográfica y cero alucinaciones.',
      en: 'Collaborative agent architecture parsing accounting balance sheets, DCF models, and tax filings to generate commercial credit rulings with cryptographic audit trails.',
      pt: 'Arquitetura de agentes colaborativos que processam balanços contábeis com rastreabilidade auditável.'
    },
    methodology: {
      es: 'Construcción de grafos dirigidos con LangGraph y verificación cruzada determinística mediante Python AST execution.',
      en: 'Directed graph construction using LangGraph and deterministic cross-verification via Python AST execution.',
      pt: 'Construção de grafos dirigidos com verificação determinística via execução Python.'
    },
    sources: [
      { name: 'Journal of Financial Data Science', type: 'Nature', citation: 'JFDS 2025, 7(1): 45-62. DOI: 10.3905/jfds.2025.1.112' }
    ],
    isPublished: true,
    readsCount: 1150,
    rating: 5.0
  },
  {
    id: 'topic-04',
    topicNumber: 4,
    title: {
      es: 'El Escudo Fiscal de la IA (MACRS 5 Años): Guía Financiera para Directores de Finanzas (CFO)',
      en: 'The AI Tax Shield (5-Year MACRS): CFO Guide for Hardware Capital Deductions',
      pt: 'O Escudo Fiscal da IA (MACRS 5 Anos): Guia Financeiro para Diretores de Finanças (CFO)'
    },
    category: 'Finanzas',
    summary: {
      es: 'Optimización de impuestos corporativos deduciendo el 100% de la inversión de servidores de IA en el primer ejercicio.',
      en: 'Corporate tax optimization deducting 100% of AI server investments in the first fiscal year under Section 179/MACRS.',
      pt: 'Otimização tributária corporativa deduzindo 100% do investimento em servidores no primeiro exercício.'
    },
    abstract: {
      es: 'Comparativa de impacto contable entre gasto operativo puro (OPEX en nube sin valor residual) versus capitalización de activos depreciables (CAPEX en servidores con valor de rescate y deducción acelerada).',
      en: 'Comparative accounting impact between pure operating expense (OPEX cloud drain with zero residual value) vs depreciable asset capitalization (CAPEX on-premises servers).',
      pt: 'Comparação do impacto contábil entre OPEX em nuvem sem valor residual versus capitalização de ativos depreciáveis.'
    },
    methodology: {
      es: 'Simulaciones Monte Carlo de flujo de caja descontado (DCF) con tasas WACC entre 8.5% y 14.0% y tasa impositiva corporativa estándar del 30%.',
      en: 'Discounted Cash Flow (DCF) Monte Carlo simulations with WACC rates between 8.5% and 14.0% and standard 30% corporate tax rate.',
      pt: 'Simulações de fluxo de caixa descontado com WACC e taxas corporativas.'
    },
    sources: [
      { name: 'IRS Publication 946', type: 'SEC', citation: 'IRS Pub 946: How to Depreciate Property (Class 00.12 Information Systems)' }
    ],
    isPublished: true,
    readsCount: 1680,
    rating: 4.9
  },
  {
    id: 'topic-05',
    topicNumber: 5,
    title: {
      es: 'Arquitecturas Híbridas 90/10 en Producción: Balanceo Soberano y Elasticidad en Nube',
      en: '90/10 Hybrid Production Architectures: Sovereign Core & Elastic Cloud Bursting',
      pt: 'Arquiteturas Híbridas 90/10 em Produção: Núcleo Soberano e Elasticidade na Nuvem'
    },
    category: 'MLOps',
    summary: {
      es: 'Procese el 90% de la carga base en su servidor local ($0 marginal) y desborde el 10% de picos extremos a la nube.',
      en: 'Process 90% baseline load on private hardware ($0 marginal cost) and burst 10% unforeseen peaks to cloud endpoints.',
      pt: 'Processe 90% da carga no servidor local e transborde 10% dos picos para a nuvem.'
    },
    abstract: {
      es: 'Estudio de caso en producción con un enrutador inteligente de inferencia (Smart Semantic Router) que minimiza el costo total de propiedad manteniendo SLA de disponibilidad del 99.99%.',
      en: 'Production case study with a Smart Semantic Router that minimizes TCO while upholding 99.99% availability SLAs.',
      pt: 'Estudo de caso com roteador inteligente de inferência que minimiza o TCO mantendo SLA de 99.99%.'
    },
    methodology: {
      es: 'Medición de latencia P99 bajo carga sintética Locust de 5.000 req/minuto distribuida entre vLLM on-premise y API de respaldo.',
      en: 'P99 latency measurement under synthetic Locust load of 5,000 req/min distributed between local vLLM and fallback APIs.',
      pt: 'Medição de latência P99 sob carga distribuída entre cluster local e APIs de contingência.'
    },
    sources: [
      { name: 'ACM SIGCOMM', type: 'IEEE', citation: 'ACM SIGCOMM 2025 Workshop on AI Systems and Network Co-Design, pp. 89-96.' }
    ],
    isPublished: true,
    readsCount: 890,
    rating: 4.7
  },
  {
    id: 'topic-06',
    topicNumber: 6,
    title: {
      es: 'Micro-Fábricas de Inferencia con Modelos Abiertos: DeepSeek-V3 y Llama 3.3 en FP8',
      en: 'Open-Weight Inference Micro-Factories: DeepSeek-V3 & Llama 3.3 in FP8',
      pt: 'Microfábricas de Inferência com Modelos Abertos: DeepSeek-V3 e Llama 3.3 em FP8'
    },
    category: 'MLOps',
    summary: {
      es: 'Implementación de servidores de inferencia de 70B y 671B parámetros con cuantización FP8 y costo marginal cero por token.',
      en: 'Deployment of 70B and 671B parameter models using FP8 quantization with near-zero marginal cost per token.',
      pt: 'Implementação de servidores de inferência de 70B e 671B com quantização FP8 e custo marginal zero.'
    },
    abstract: {
      es: 'Evaluación exhaustiva de benchmarks MMLU, GSM8K y HumanEval en modelos cuantizados frente a modelos FP16 completos, demostrando retención del 99.2% de precisión con 60% menos memoria VRAM.',
      en: 'Exhaustive benchmark evaluation (MMLU, GSM8K, HumanEval) on quantized models versus full FP16 weights, demonstrating 99.2% accuracy retention with 60% less VRAM.',
      pt: 'Avaliação de benchmarks demonstrando retenção de 99.2% de precisão com 60% menos VRAM.'
    },
    methodology: {
      es: 'Optimización de KV-Cache con FlashAttention-3 y Chunked Prefill en 4 GPUs L40S interconectadas vía PCIe Gen 4x16.',
      en: 'KV-Cache optimization with FlashAttention-3 and Chunked Prefill across 4x L40S GPUs interconnected via PCIe Gen 4x16.',
      pt: 'Otimização de KV-Cache com FlashAttention-3 em 4 GPUs L40S interconectadas.'
    },
    sources: [
      { name: 'arXiv AI', type: 'arXiv', citation: 'arXiv:2412.19437 [cs.CL] "DeepSeek-V3 Technical Report: Multi-Head Latent Attention"' }
    ],
    isPublished: true,
    readsCount: 2100,
    rating: 5.0
  },
  {
    id: 'topic-07',
    topicNumber: 7,
    title: {
      es: 'La Granja de Rendimiento de Tokens: Modelos de Suscripción y Venta de Endpoints RAG B2B',
      en: 'The Token Yield Farm: Subscription Models & B2B Private RAG Endpoints',
      pt: 'A Fazenda de Rendimento de Tokens: Modelos de Assinatura e Venda de RAG B2B'
    },
    category: 'Monetizacion',
    summary: {
      es: 'Cómo estructurar contratos de SLA y facturación recurrente mensual (MRR) vendiendo servicios de búsqueda semántica a corporaciones.',
      en: 'How to structure SLA contracts and recurring monthly billing (MRR) selling enterprise semantic search services.',
      pt: 'Como estruturar contratos de SLA e receita recorrente vendendo busca semântica para empresas.'
    },
    abstract: {
      es: 'Modelo de negocio B2B para monetizar infraestructura propia ofreciendo bases de conocimiento vectoriales encriptadas con aislamiento multi-tenant para bufetes legales, bancos y clínicas.',
      en: 'B2B business model for monetizing private infrastructure by offering encrypted vector knowledge bases with multi-tenant isolation.',
      pt: 'Modelo de negócios B2B para monetizar infraestrutura própria oferecendo bases vetoriais isoladas.'
    },
    methodology: {
      es: 'Estructuración de pricing por Tier (Base, Pro, Enterprise), cálculo de costo marginal de almacenamiento vectorial en Milvus y Qdrant.',
      en: 'Pricing tier structuring (Base, Pro, Enterprise), marginal cost calculation of vector storage on Milvus and Qdrant.',
      pt: 'Estruturação de preços por nível e cálculo de custo marginal de armazenamento vetorial.'
    },
    sources: [
      { name: 'Harvard Business Review Tech', type: 'Industry', citation: 'HBR Digital Operations: "Monetizing AI Infrastructure in Mid-Market Enterprises", 2025.' }
    ],
    isPublished: true,
    readsCount: 1750,
    rating: 4.9
  },
  {
    id: 'topic-08',
    topicNumber: 8,
    title: {
      es: 'Ciberseguridad y Soberanía de Datos en Telecomunicaciones: Prevención de Fugas de Información',
      en: 'Cybersecurity & Data Sovereignty in Telecom: Preventing Confidential Leaks',
      pt: 'Cibersegurança e Soberania de Dados em Telecomunicações: Prevenção de Vazamentos'
    },
    category: 'Seguridad',
    summary: {
      es: 'Aislamiento "Air-Gapped" y cumplimiento de leyes de protección de datos (LGPD / GDPR / Habeas Data) sin llamadas a APIs externas.',
      en: 'Air-gapped isolation and data protection compliance (LGPD / GDPR) eliminating external API telemetry leaks.',
      pt: 'Isolamento de rede e conformidade com leis de proteção de dados sem chamadas para APIs externas.'
    },
    abstract: {
      es: 'Análisis de vectores de ataque en APIs públicas de LLMs (Prompt Injection, Training Data Extraction) y cómo la infraestructura física local elimina el 100% del riesgo de exfiltración de propiedad intelectual.',
      en: 'Attack vector analysis on public LLM APIs (Prompt Injection, Data Extraction) and how on-premises hardware eliminates IP exfiltration risks.',
      pt: 'Análise de vetores de ataque em APIs públicas e como a infraestrutura local elimina o risco de vazamento de dados.'
    },
    methodology: {
      es: 'Auditoría de tráfico con Wireshark y eBPF; verificación de cero llamadas DNS/HTTPS externas durante la inferencia local.',
      en: 'Traffic auditing using Wireshark and eBPF; verification of zero outbound DNS/HTTPS calls during local inference.',
      pt: 'Auditoria de tráfego com eBPF confirmando zero chamadas externas durante a inferência.'
    },
    sources: [
      { name: 'NIST Cybersecurity Framework', type: 'Industry', citation: 'NIST AI 100-1 "Artificial Intelligence Risk Management Framework (AI RMF 1.0)"' }
    ],
    isPublished: true,
    readsCount: 1320,
    rating: 4.8
  },
  {
    id: 'topic-09',
    topicNumber: 9,
    title: {
      es: 'Trading Cuantitativo y Modelos de Lenguaje: Extracción de Señales Financieras de Reportes 10-K',
      en: 'Quantitative Trading & LLMs: Extracting Real-Time Alpha from 10-K Reports',
      pt: 'Trading Quantitativo e Modelos de Linguagem: Extração de Sinais Financeiros de Relatórios 10-K'
    },
    category: 'Banca',
    summary: {
      es: 'Algoritmos de procesamiento de lenguaje natural para detectar cambios semánticos en transcripciones de llamadas de ganancias trimestrales.',
      en: 'Natural language processing algorithms detecting subtle semantic shifts in quarterly earnings call transcripts.',
      pt: 'Algoritmos de processamento de linguagem natural para detectar mudanças semânticas em relatórios trimestrais.'
    },
    abstract: {
      es: 'Construcción de un pipeline de análisis de sentimiento cuantitativo de ultra-baja latencia que procesa presentaciones SEC en tiempo real para generar señales de cobertura (hedging) en mercados de derivados.',
      en: 'Construction of ultra-low latency quantitative sentiment pipeline processing SEC filings in real-time to generate hedging signals in derivatives markets.',
      pt: 'Construção de pipeline quantitativo de sentimento processando dados regulatórios em tempo real.'
    },
    methodology: {
      es: 'Tokenización financiera con FinBERT-v2 y evaluación de Sharpe Ratio en backtesting histórico de 2020 a 2026.',
      en: 'Financial tokenization with FinBERT-v2 and Sharpe Ratio evaluation across 2020-2026 historical backtesting.',
      pt: 'Tokenização financeira com FinBERT e avaliação de Sharpe Ratio em backtesting histórico.'
    },
    sources: [
      { name: 'Journal of Portfolio Management', type: 'Nature', citation: 'JPM 2025, Vol. 51, Issue 3, "NLP Alpha Extraction in High-Frequency Regimes".' }
    ],
    isPublished: true,
    readsCount: 1540,
    rating: 5.0
  },
  // Topics 10-15: Available in Admin Dashboard to toggle/publish
  {
    id: 'topic-10',
    topicNumber: 10,
    title: {
      es: 'Eficiencia Energética y Datacenters Verdes (PUE < 1.15) para Cargas de IA',
      en: 'Energy Efficiency & Green Datacenters (PUE < 1.15) for High-Density AI Workloads',
      pt: 'Eficiência Energética e Datacenters Verdes (PUE < 1.15) para Cargas de IA'
    },
    category: 'MLOps',
    summary: {
      es: 'Optimización de refrigeración líquida directa al chip (DLC) y gestión térmica de servidores de IA.',
      en: 'Direct-to-chip liquid cooling (DLC) optimization and thermal management for dense AI server clusters.',
      pt: 'Otimização de resfriamento líquido direto no chip e gestão térmica de servidores.'
    },
    abstract: {
      es: 'Metodología de ingeniería para reducir el PUE de 1.45 a 1.12 en racks de 35kW, reduciendo la factura eléctrica mensual en $1.800 USD por servidor.',
      en: 'Engineering methodology to reduce PUE from 1.45 to 1.12 in 35kW racks, cutting monthly power bills by $1,800 per server.',
      pt: 'Metodologia de engenharia para reduzir o PUE e a fatura elétrica em servidores de IA.'
    },
    methodology: {
      es: 'Modelado termodinámico CFD y monitoreo de sensores IPMI en tiempo real.',
      en: 'Thermodynamic CFD modeling and real-time IPMI sensor telemetry.',
      pt: 'Modelagem termodinâmica e monitoramento de sensores IPMI em tempo real.'
    },
    sources: [
      { name: 'ASHRAE Datacom Series', type: 'Industry', citation: 'ASHRAE TC 9.9 "Thermal Guidelines for Data Processing Environments, 5th Ed."' }
    ],
    isPublished: false,
    readsCount: 620,
    rating: 4.6
  },
  {
    id: 'topic-11',
    topicNumber: 11,
    title: {
      es: 'Automatización de Cobranzas y Atención al Cliente con Voz IA Neural Local',
      en: 'Debt Collection & Support Automation with Low-Latency Neural AI Voice',
      pt: 'Automação de Cobrança e Suporte ao Cliente com Voz IA Neural Local'
    },
    category: 'Finanzas',
    summary: {
      es: 'Agentes de voz bidireccionales con latencia <400ms para negociación de pagos y soporte técnico de nivel 1.',
      en: 'Bidirectional voice agents with <400ms latency for payment arrangements and Tier-1 technical support.',
      pt: 'Agentes de voz bidirecionais com latência <400ms para negociação e suporte nível 1.'
    },
    abstract: {
      es: 'Implementación de pipeline Speech-to-Speech con Whisper-v3 local + Kokoro TTS + LLM 8B, alcanzando tasas de recuperación de cartera vencida 34% superiores a canales tradicionales.',
      en: 'Speech-to-Speech pipeline with local Whisper-v3 + Kokoro TTS + 8B LLM, achieving 34% higher collection rates than traditional IVR.',
      pt: 'Implementação de pipeline de voz local alcançando recuperação de crédito 34% superior.'
    },
    methodology: {
      es: 'Integración Asterisk/SIP con streaming WebRTC de audio PCM en chunks de 40ms.',
      en: 'Asterisk/SIP integration with WebRTC streaming of PCM audio in 40ms chunks.',
      pt: 'Integração Asterisk/SIP com streaming WebRTC em chunks de 40ms.'
    },
    sources: [
      { name: 'Interspeech Conference', type: 'IEEE', citation: 'Proc. Interspeech 2025, pp. 2310-2314 "Ultra-Low Latency Conversational Voice Agents".' }
    ],
    isPublished: false,
    readsCount: 780,
    rating: 4.7
  },
  {
    id: 'topic-12',
    topicNumber: 12,
    title: {
      es: 'Tokenización de Activos de Infraestructura (RWA): Financiamiento de Clústeres de Cómputo',
      en: 'Infrastructure Real-World Asset (RWA) Tokenization: Financing GPU Compute Clusters',
      pt: 'Tokenização de Ativos Reais (RWA): Financiamento de Clusters de Computação'
    },
    category: 'Monetizacion',
    summary: {
      es: 'Emisión de certificados de rendimiento respaldados por horas de cómputo en servidores físicos.',
      en: 'Issuance of yield-generating certificates backed by physical server compute-hours.',
      pt: 'Emissão de certificados de rendimento lastreados em horas de computação em servidores físicos.'
    },
    abstract: {
      es: 'Estructuración legal y financiera para levantar capital de expansión mediante smart contracts que distribuyen ingresos netos de inferencia a inversionistas de forma automatizada.',
      en: 'Legal and financial framework to raise expansion capital via smart contracts distributing net inference revenue automatically to investors.',
      pt: 'Estruturação legal e financeira para captação de recursos via contratos inteligentes.'
    },
    methodology: {
      es: 'Contratos inteligentes ERC-3643 para valores tokenizados compatibles con regulación SEC/ESMA.',
      en: 'ERC-3643 compliant security token smart contracts aligning with SEC/ESMA rules.',
      pt: 'Contratos inteligentes compatíveis com regulação para ativos tokenizados.'
    },
    sources: [
      { name: 'Stanford Journal of Blockchain Law & Policy', type: 'SEC', citation: 'Stanford JBLP 2025, Vol. 8, "DePIN and RWA Compute Tokenization Frameworks".' }
    ],
    isPublished: false,
    readsCount: 510,
    rating: 4.5
  },
  {
    id: 'topic-13',
    topicNumber: 13,
    title: {
      es: 'Optimización de Enrutamiento Dinámico en Redes GPON con Redes Neuronales de Grafos (GNN)',
      en: 'Dynamic Routing Optimization in GPON Networks via Graph Neural Networks (GNN)',
      pt: 'Otimização de Roteamento Dinâmico em Redes GPON com Redes Neurais de Grafos'
    },
    category: 'Telecom',
    summary: {
      es: 'Predicción de congestión de buffers y reasignación de ancho de banda dinámico (DBA) en microsegundos.',
      en: 'Buffer congestion prediction and Dynamic Bandwidth Allocation (DBA) in microseconds.',
      pt: 'Previsão de congestionamento de buffer e alocação dinâmica de largura de banda em microsegundos.'
    },
    abstract: {
      es: 'Uso de GNNs para modelar la topología física y lógica de árboles PON, optimizando el intervalo de concesión de subida y reduciendo la fluctuación de fase (jitter) en un 72% para servicios VoIP y gaming.',
      en: 'Using GNNs to model physical and logical PON topology, optimizing upstream grant intervals and cutting jitter by 72% for VoIP and gaming.',
      pt: 'Uso de GNNs para modelar a topologia PON reduzindo jitter em 72%.'
    },
    methodology: {
      es: 'Simulador NS-3 acoplado con PyTorch Geometric en bucle de control en tiempo real.',
      en: 'NS-3 network simulator coupled with PyTorch Geometric in real-time control loop.',
      pt: 'Simulador NS-3 acoplado ao PyTorch Geometric em tempo real.'
    },
    sources: [
      { name: 'IEEE Journal on Selected Areas in Communications', type: 'IEEE', citation: 'IEEE JSAC, vol. 43, no. 2, pp. 512-525, 2025.' }
    ],
    isPublished: false,
    readsCount: 440,
    rating: 4.6
  },
  {
    id: 'topic-14',
    topicNumber: 14,
    title: {
      es: 'Valuación de Empresas en la Era de la IA: Cómo los Activos de Cómputo Elevan el Múltiplo EBITDA',
      en: 'Enterprise Valuation in the AI Era: How Sovereign Compute Assets Elevate EBITDA Multiples',
      pt: 'Valuation de Empresas na Era da IA: Como Ativos de Computação Elevam o Múltiplo EBITDA'
    },
    category: 'Finanzas',
    summary: {
      es: 'Por qué los fondos de Private Equity pagan múltiplos 3.2x mayores por empresas con infraestructura y modelos propios.',
      en: 'Why Private Equity funds pay 3.2x higher valuation multiples for firms with proprietary infrastructure and models.',
      pt: 'Por que fundos de Private Equity pagam múltiplos 3.2x maiores por empresas com infraestrutura própria.'
    },
    abstract: {
      es: 'Análisis econométrico de 120 transacciones de fusiones y adquisiciones (M&A) en el sector tecnológico y telecomunicaciones entre 2023 y 2026, demostrando que la soberanía de datos y hardware propio reduce el riesgo de dependencia técnica.',
      en: 'Econometric analysis of 120 M&A transactions in tech and telecom (2023-2026), proving that sovereign hardware and proprietary weights derisk target businesses and boost exit multiples.',
      pt: 'Análise econométrica de transações de M&A demonstrando que soberania de hardware reduz riscos e eleva o valuation.'
    },
    methodology: {
      es: 'Regresión multivariada por mínimos cuadrados ordinarios (OLS) controlando por crecimiento de ingresos, margen EBITDA y apalancamiento neto.',
      en: 'Multivariate OLS regression controlling for revenue growth, EBITDA margin, and net leverage.',
      pt: 'Regressão multivariada controlando por crescimento de receita e margem EBITDA.'
    },
    sources: [
      { name: 'Journal of Corporate Finance', type: 'Nature', citation: 'JCF 2025, 88: 102450. DOI: 10.1016/j.jcorpfin.2025.102450' }
    ],
    isPublished: false,
    readsCount: 930,
    rating: 4.9
  },
  {
    id: 'topic-15',
    topicNumber: 15,
    title: {
      es: 'Gobernanza Ética y Auditoría de Algoritmos: Marcos de Cumplimiento contra Sesgos y Multas',
      en: 'Ethical AI Governance & Algorithm Auditing: Compliance Frameworks against Fines',
      pt: 'Governança Ética e Auditoria de Algoritmos: Conformidade contra Multas Regulatórias'
    },
    category: 'Seguridad',
    summary: {
      es: 'Metodología paso a paso para certificar sistemas de IA ante el EU AI Act y legislaciones de América Latina.',
      en: 'Step-by-step methodology to certify AI systems under the EU AI Act and Latin American regional frameworks.',
      pt: 'Metodologia para certificar sistemas de IA perante o EU AI Act e marcos regulatórios da América Latina.'
    },
    abstract: {
      es: 'Guía técnica para implementar matrices de evaluabilidad, pruebas de estrés de robustez adversarial y registros inmutables de decisiones automatizadas para evitar sanciones de hasta 35M€ o el 7% del volumen de negocio anual.',
      en: 'Technical guide to implementing evaluability matrices, adversarial stress testing, and immutable logs to avert penalties up to €35M or 7% of annual turnover.',
      pt: 'Guia técnico para implementação de matrizes de avaliação e logs imutáveis para prevenir sanções regulatórias.'
    },
    methodology: {
      es: 'Aplicación del marco de evaluación Fairlearn y SHAP (SHapley Additive exPlanations) en modelos de scoring.',
      en: 'Implementation of Fairlearn framework and SHAP (SHapley Additive exPlanations) on decision scoring models.',
      pt: 'Aplicação do framework Fairlearn e SHAP em modelos de decisão automatizada.'
    },
    sources: [
      { name: 'Official Journal of the European Union', type: 'SEC', citation: 'Regulation (EU) 2024/1689 (Artificial Intelligence Act), OJ L 2024/1689.' }
    ],
    isPublished: false,
    readsCount: 670,
    rating: 4.8
  }
];

export const MONEY_FARM_TRENDS: MoneyFarmTrend[] = [
  {
    id: 'mf-1',
    number: 1,
    title: {
      es: 'Arbitraje de Inferencia: Clústeres Privados vs Nube',
      en: 'Inference Arbitrage: Private GPU Clusters vs Cloud',
      pt: 'Arbitragem de Inferência: Clusters Privados vs Nuvem'
    },
    headline: {
      es: 'Márgenes netos del 78% vendiendo tokens de inferencia local a empresas locales',
      en: '78% net profit margins selling private local inference tokens to regional enterprises',
      pt: 'Margens líquidas de 78% vendendo tokens de inferência local para empresas'
    },
    description: {
      es: 'Al instalar un nodo de 4x NVIDIA L40S ($48k), su costo marginal por millón de tokens es de ~$0.08 USD (electricidad + depreciación). La nube pública cobra $1.25 a $3.50 USD por millón. Vender capacidad ociosa a empresas locales genera un flujo de caja pasivo recurrente de $4.500 a $9.000 USD mensuales.',
      en: 'By hosting a 4x NVIDIA L40S node ($48k), your marginal cost per million tokens is ~$0.08 USD (power + hardware depreciation). Cloud providers charge $1.25 to $3.50 USD per million. Selling spare capacity generates $4,500 to $9,000 USD/month in recurring passive cashflow.',
      pt: 'Instalando um nó de 4x NVIDIA L40S ($48k), seu custo marginal por milhão de tokens é ~$0.08 USD. A nuvem cobra até $3.50. Vender capacidade ociosa gera $4.500 a $9.000 USD mensais.'
    },
    projectedRoi: '320% a 36 Meses',
    capitalRequired: '$48,000 USD (CAPEX Servidor)',
    timeToProfit: '3.4 Meses (Payback)',
    techStack: ['vLLM v0.6+', 'NVIDIA L40S 48GB', 'FastAPI', 'Docker', 'Stripe Billing'],
    keyRisk: {
      es: 'Requiere estabilidad eléctrica garantizada (UPS + Respaldo de Datacenter).',
      en: 'Requires guaranteed electrical stability (UPS + Datacenter backup).',
      pt: 'Requer estabilidade elétrica garantida (Nobreak + Gerador).'
    }
  },
  {
    id: 'mf-2',
    number: 2,
    title: {
      es: 'Fábrica de Agentes Autónomos B2B para Telecom & ISPs',
      en: 'B2B Autonomous Agent Factory for Telecom & ISPs',
      pt: 'Fábrica de Agentes Autônomos B2B para Telecom & ISPs'
    },
    headline: {
      es: 'Contratos mensuales de $3.000 a $8.000 USD/mes por cliente corporativo',
      en: 'Monthly recurring retainers of $3,000 to $8,000 USD/month per enterprise client',
      pt: 'Contratos mensais de $3.000 a $8.000 USD/mês por cliente corporativo'
    },
    description: {
      es: 'Despliegue de agentes inteligentes que se conectan a routers MikroTik, OLTs Huawei/ZTE y bases de datos Radius para diagnosticar caídas masivas, reconfigurar perfiles de clientes y recuperar cuentas morosas con llamadas de voz neural antes del corte.',
      en: 'Deployment of smart agents connecting to MikroTik routers, Huawei/ZTE OLTs, and Radius databases to diagnose fiber cuts, reconfigure ONU profiles, and recover delinquent accounts via neural voice before service suspension.',
      pt: 'Implantação de agentes que se conectam a MikroTik e OLTs para diagnosticar quedas e recuperar clientes inadimplentes.'
    },
    projectedRoi: '450% Anual',
    capitalRequired: '$5,000 - $12,000 USD (Software & Licenciamiento)',
    timeToProfit: 'Inmediato (Contrato B2B)',
    techStack: ['LangGraph', 'Python 3.12', 'SNMP / TR-069', 'PostgreSQL', 'Asterisk Voice'],
    keyRisk: {
      es: 'Requiere acuerdos de confidencialidad estrictos (NDA) con el operador.',
      en: 'Requires strict non-disclosure agreements (NDA) with the carrier.',
      pt: 'Requer acordos de confidencialidade estritos com a operadora.'
    }
  },
  {
    id: 'mf-3',
    number: 3,
    title: {
      es: 'Micro-SaaS Especializados con Modelos Cuantizados (FP8/INT4)',
      en: 'Niche Micro-SaaS Powered by Quantized Open Models (FP8/INT4)',
      pt: 'Micro-SaaS Especializados com Modelos Quantizados (FP8/INT4)'
    },
    headline: {
      es: 'MRR de $10.000 a $25.000 USD con costo de infraestructura <$400/mes',
      en: '$10,000 to $25,000 USD MRR with infrastructure overhead <$400/month',
      pt: 'MRR de $10.000 a $25.000 USD com custo de infraestrutura <$400/mês'
    },
    description: {
      es: 'Creación de herramientas web hiper-enfocadas (ej. generador automático de memorias de cálculo para ingenieros, auditor de contratos de arrendamiento, creador de exámenes médicos estructurados) operando con modelos Llama 3.3 8B cuantizados en instancias de bajo costo.',
      en: 'Building hyper-focused web tools (e.g., automated engineering calculation memos, real estate lease contract auditors, structured medical exam parsers) running quantized Llama 3.3 8B on low-cost server slices.',
      pt: 'Criação de ferramentas web hiperfocadas operando com modelos Llama 3.3 8B quantizados de baixo custo.'
    },
    projectedRoi: '600% Anual',
    capitalRequired: '$2,500 USD (Desarrollo y Campaña)',
    timeToProfit: '60 a 90 Días',
    techStack: ['React 18 / Vite', 'TailwindCSS', 'Ollama / vLLM', 'Paddle / LemonSqueezy'],
    keyRisk: {
      es: 'Sensibilidad a la adquisición de clientes orgánicos y retención.',
      en: 'Sensitive to organic customer acquisition and retention churn.',
      pt: 'Sensibilidade à aquisição e retenção de clientes.'
    }
  },
  {
    id: 'mf-4',
    number: 4,
    title: {
      es: 'Trading Algorítmico Cuantitativo y Arbitraje de Sentimiento',
      en: 'Quantitative Algorithmic Trading & Semantic Sentiment Arbitrage',
      pt: 'Trading Algorítmico Quantitativo e Arbitragem de Sentimento'
    },
    headline: {
      es: 'Rendimientos de alpha consistentes con ejecución de baja latencia',
      en: 'Consistent alpha returns with local ultra-low latency execution',
      pt: 'Rendimentos consistentes com execução de baixíssima latência'
    },
    description: {
      es: 'Algoritmos que procesan feeds de noticias financieras, declaraciones de bancos centrales y transacciones on-chain en tiempo real mediante LLMs locales, ejecutando órdenes en microsegundos sin retardos de red.',
      en: 'Algorithms parsing financial news feeds, central bank press releases, and on-chain transactions in real-time using local LLMs, executing orders in microseconds without cloud API latency spikes.',
      pt: 'Algoritmos que processam notícias financeiras e dados em tempo real executando ordens em microsegundos.'
    },
    projectedRoi: '18% a 35% Anualizado',
    capitalRequired: '$25,000 USD (Capital de Operación / Liquidez)',
    timeToProfit: '30 Días',
    techStack: ['CCXT', 'Python AsyncIO', 'FinBERT', 'TimescaleDB', 'Interactive Brokers API'],
    keyRisk: {
      es: 'Riesgo de mercado y volatilidad extrema en noticias no cuantificadas.',
      en: 'Market risk and sudden extreme volatility on black swan events.',
      pt: 'Risco de mercado e volatilidade extrema.'
    }
  },
  {
    id: 'mf-5',
    number: 5,
    title: {
      es: 'Infraestructura de Datos & Pipeline de Fine-Tuning LoRA B2B',
      en: 'Enterprise Data Infrastructure & B2B LoRA Fine-Tuning Pipelines',
      pt: 'Infraestrutura de Dados & Pipeline de Fine-Tuning LoRA B2B'
    },
    headline: {
      es: '$15.000 a $30.000 USD por proyecto de entrenamiento de modelo corporativo',
      en: '$15,000 to $30,000 USD per custom enterprise model fine-tuning project',
      pt: '$15.000 a $30.000 USD por projeto de treinamento de modelo corporativo'
    },
    description: {
      es: 'Empresas de salud, aseguradoras y firmas legales no pueden subir sus expedientes a OpenAI por secreto profesional. Ofrecerles el pipeline de limpieza de datos, extracción de sintaxis y entrenamiento de adaptadores LoRA sobre hardware propio certificado genera honorarios de alto calibre.',
      en: 'Healthcare firms, insurers, and law practices cannot upload client records to public cloud APIs due to legal privilege. Providing them on-premises dataset sanitization, syntactical alignment, and LoRA adapter training yields top-tier consulting retainers.',
      pt: 'Empresas com dados confidenciais contratam serviços de fine-tuning local garantindo privacidade total.'
    },
    projectedRoi: '280% por Proyecto',
    capitalRequired: '$8,000 USD (Herramientas y Compute Time)',
    timeToProfit: '45 Días por Entregable',
    techStack: ['Unsloth AI', 'PyTorch 2.5', 'Hugging Face TRL', 'Weights & Biases', 'Ray Train'],
    keyRisk: {
      es: 'Limpieza defectuosa del dataset del cliente (Garbage In, Garbage Out).',
      en: 'Poor raw data hygiene from client source files.',
      pt: 'Qualidade ruim da base de dados fornecida pelo cliente.'
    }
  },
  {
    id: 'mf-6',
    number: 6,
    title: {
      es: 'Fábrica de Publicaciones Científicas, White Papers y Documentación IEEE',
      en: 'Scientific Publishing Factory, White Papers & IEEE Documentation',
      pt: 'Fábrica de Publicações Científicas, White Papers e Documentação IEEE'
    },
    headline: {
      es: 'Monetización de reportes de investigación premium y memorias de cálculo',
      en: 'Monetizing premium industry research reports and computational blueprints',
      pt: 'Monetização de relatórios de pesquisa premium e memórias de cálculo'
    },
    description: {
      es: 'Generación automatizada de reportes técnicos auditados con fuentes académicas, fórmulas matemáticas LaTeX y bibliografía DOI para directores de tecnología, fondos de inversión y organismos de normalización.',
      en: 'Automated synthesis of audited technical white papers with academic citations, LaTeX formulas, and DOI bibliographies for CTOs, VC funds, and standards bodies.',
      pt: 'Geração automatizada de relatórios técnicos auditados com fontes acadêmicas e fórmulas LaTeX.'
    },
    projectedRoi: '380% Anual',
    capitalRequired: '$1,500 USD (Herramientas de Indexación)',
    timeToProfit: '15 Días',
    techStack: ['LaTeX / Typst', 'Gemini 3.7 Deep Research', 'Zotero API', 'React-Markdown', 'jsPDF'],
    keyRisk: {
      es: 'Exige verificación rigurosa de fuentes primarias para evitar alucinaciones.',
      en: 'Requires strict primary source validation to prevent hallucinated citations.',
      pt: 'Exige verificação rigorosa de fontes primárias.'
    }
  },
  {
    id: 'mf-7',
    number: 7,
    title: {
      es: 'Monetización de APIs de Conocimiento Vectorial (RAG Privado)',
      en: 'Vector Knowledge Base API Monetization (Private Enterprise RAG)',
      pt: 'Monetização de APIs de Conhecimento Vetorial (RAG Privado)'
    },
    headline: {
      es: 'Suscripciones corporativas de $1.200 a $4.500 USD/mes por base indexada',
      en: 'Enterprise retainers of $1,200 to $4,500 USD/month per indexed repository',
      pt: 'Assinaturas corporativas de $1.200 a $4.500 USD/mês por base indexada'
    },
    description: {
      es: 'Indexe normativas, jurisprudencia, manuales de telecomunicaciones y normativas tributarias en una base de datos vectorial de alta densidad (Qdrant/Milvus) y cobre acceso mensual por API con cuotas garantizadas de consultas.',
      en: 'Index regulations, jurisprudence, telecom manuals, and tax codes into a high-density vector database (Qdrant/Milvus) and charge monthly API access with guaranteed query SLAs.',
      pt: 'Indexe manuais, normas e leis em bases vetoriais e cobre mensalidade por acesso via API.'
    },
    projectedRoi: '400% Anual',
    capitalRequired: '$4,000 USD (Hosting Vectorial & Indexing)',
    timeToProfit: '30 Días',
    techStack: ['Qdrant / Milvus', 'BGE-M3 Embeddings', 'Hybrid Sparse-Dense Search', 'API Gateway'],
    keyRisk: {
      es: 'Mantenimiento y re-indexación continua ante cambios normativos.',
      en: 'Continuous re-indexing overhead upon regulatory amendments.',
      pt: 'Manutenção e re-indexação contínua diante de mudanças nas normas.'
    }
  }
];

export const INITIAL_SURVEY_QUESTIONS = [
  {
    id: 'survey-1',
    question: {
      es: '¿En qué área experimenta su organización el mayor costo de infraestructura hoy?',
      en: 'In which area is your organization facing the highest infrastructure overhead today?',
      pt: 'Em qual área sua empresa enfrenta o maior custo de infraestrutura hoje?'
    },
    options: [
      { id: 'opt-1', label: 'Consumo de Tokens en APIs Públicas (OpenAI/Anthropic/AWS)', votes: 84 },
      { id: 'opt-2', label: 'Servidores Nube / Instancias GPU Rentadas (AWS EC2 / Azure)', votes: 62 },
      { id: 'opt-3', label: 'Almacenamiento y Transferencia de Datos (Egress Fees)', votes: 31 },
      { id: 'opt-4', label: 'Mantenimiento de Redes de Telecomunicaciones & Churn', votes: 47 }
    ]
  },
  {
    id: 'survey-2',
    question: {
      es: '¿Qué sector industrial representa su empresa?',
      en: 'Which industry vertical does your business represent?',
      pt: 'Qual setor industrial sua empresa representa?'
    },
    options: [
      { id: 'opt-sec-1', label: 'Telecomunicaciones / Proveedores de Internet (ISP / FTTH)', votes: 95 },
      { id: 'opt-sec-2', label: 'FinTech, Banca & Servicios Financieros', votes: 78 },
      { id: 'opt-sec-3', label: 'Salud, Farmacéutica & Clínicas', votes: 24 },
      { id: 'opt-sec-4', label: 'Legal, Auditoría & Cumplimiento Normativo', votes: 39 },
      { id: 'opt-sec-5', label: 'Software, SaaS & Tecnología B2B', votes: 88 }
    ]
  }
];
