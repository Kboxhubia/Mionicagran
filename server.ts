import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    });
  });

  // AI-Powered Q&A Endpoint for Slides & Financial Data
  app.post('/api/ai/ask', async (req, res) => {
    try {
      const { question, slide, chatHistory, language } = req.body;

      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question is required' });
      }

      const lang = language === 'en' ? 'English' : 'Spanish';

      // Build context from slide data
      const slideContext = slide ? `
CURRENT SLIDE DATA:
- Slide #${slide.id} (${slide.badge || ''}): "${slide.title}"
- Subtitle: "${slide.subtitle}"
- Category: ${slide.category}
- Strategic Takeaway: "${slide.takeaway}"
- Key Metrics: ${JSON.stringify(slide.metrics || [])}
- Bullets / Highlights: ${JSON.stringify(slide.bullets || [])}
- Speaker Narration:
  ES: "${slide.narration?.es || ''}"
  EN: "${slide.narration?.en || ''}"
` : 'No specific slide selected. Rely on global presentation context.';

      const systemPrompt = `You are the AI Financial & Telecom Infrastructure Executive Advisor embedded in the presentation "AI Financial Architecture: The $180,000 USD Error" authored by Ing. Jorge Huerta (Telecom Executive with 15+ years experience, Founder of Kboxhubia AI Financial Systems).

YOUR ROLE & TONE:
- Target Audience: CEOs, CFOs, CTOs, Telecom VPs, and Board Members.
- Persona: Highly analytical, mathematically rigorous, authoritative, concise, and focused on capital efficiency, balance sheet equity (CAPEX) vs unconstrained SaaS drainage (OPEX), data sovereignty, and telecom network performance.
- Language: Respond in ${lang}.
- Format: Use crisp executive bullet points, bold key financial metrics and numbers, and provide actionable takeaways. Keep answers concise (under 250 words unless detailed mathematical breakdown is requested).

CORE FACTUAL BASELINE:
1. Cloud API baseline drain: >$180,000/year ($15,000/mo) for mid-size enterprise AI token consumption ($5-$15 per 1M tokens), resulting in $0 balance sheet equity after 3 years ($540,000 pure loss).
2. On-Premise Solution: $48,000 CAPEX for a high-density 4x NVIDIA L40S GPU server (192GB VRAM total, 2,944 TFLOPS FP8 compute, 100GbE optical fabric, N+1 redundant 2000W power).
3. Financial Payback: 3.4 Months break-even milestone. Year 1 Net Savings >$118,000 (after ~$14,000 power/cooling/maintenance OPEX). 3-Year TCO Advantage >$412,000.
4. Token Unit Economics: Token cost drops from $5-$15 in cloud to $0.10 - $0.50 on-premise (95-98% unit cost reduction). Inference latency drops from 350-1200ms in cloud to <50ms deterministic local response.
5. Recommended Enterprise Strategy: 90/10 Hybrid Architecture (90% steady-state base load on sovereign on-prem GPUs, 10% peak surge elasticity to cloud).
6. Telecom Use Cases: Predictive optical fiber maintenance (-42% downtime), ISP subscriber churn prevention (+18.5% retention, $840k ARR saved), automated GIS fiber route deployment (90% faster, -22% upfront CAPEX), AI billing anomaly/fraud prevention ($1.2M/yr saved), and 24/7 Level-1 AI agents (95% first-contact resolution).
7. MLOps Stack: vLLM continuous tensor batching (4.2x throughput), INT4/FP8 quantization (-70% VRAM footprint, <8% idle time).
8. Presenter & Web Portal: Ing. Jorge Huerta (Email: kuboxhubia@gmail.com, Official Portal: https://kboxhubia-github-io.vercel.app/).

${slideContext}
`;

      // Build conversation prompt
      let fullPrompt = `${systemPrompt}\n\nUSER QUESTION: "${question}"\n\n`;

      if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
        const recentHistory = chatHistory.slice(-4).map((msg: any) => `${msg.role === 'user' ? 'User' : 'Advisor'}: ${msg.content}`).join('\n');
        fullPrompt = `${systemPrompt}\n\nRECENT CONVERSATION HISTORY:\n${recentHistory}\n\nUSER QUESTION: "${question}"\n\n`;
      }

      // Check if GEMINI_API_KEY is available
      if (!process.env.GEMINI_API_KEY) {
        // Deterministic intelligent fallback if key is not yet set in environment
        const fallbackAnswers = generateFallbackResponse(question, slide, lang);
        return res.json({
          answer: fallbackAnswers.answer,
          suggestedQuestions: fallbackAnswers.suggestions,
          isSimulated: true
        });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          temperature: 0.25,
          maxOutputTokens: 800,
        }
      });

      const answerText = response.text || 'No response generated.';

      // Generate suggested followup questions
      const suggestions = generateSuggestedFollowups(slide, lang);

      res.json({
        answer: answerText,
        suggestedQuestions: suggestions,
        isSimulated: false
      });

    } catch (error: any) {
      console.error('Error in /api/ai/ask:', error);
      
      // Fallback on error to ensure seamless user experience
      const { question, slide, language } = req.body || {};
      const lang = language === 'en' ? 'English' : 'Spanish';
      const fallback = generateFallbackResponse(question || '', slide, lang);
      
      res.json({
        answer: fallback.answer,
        suggestedQuestions: fallback.suggestions,
        isSimulated: true,
        errorNotice: error.message || 'Processed using financial knowledge base'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Financial Presentation Server running on http://0.0.0.0:${PORT}`);
  });
}

// Helper: Intelligent Fallback Generator based on Slide Financial Knowledge Base
function generateFallbackResponse(question: string, slide: any, lang: string) {
  const isEn = lang === 'English';
  const q = question.toLowerCase();

  let answer = '';
  if (q.includes('breakeven') || q.includes('payback') || q.includes('retorno') || q.includes('meses') || q.includes('equilibrio')) {
    answer = isEn
      ? `**Break-Even Analysis & Capital Recovery Horizon:**
• **Initial Investment (CAPEX):** $48,000 USD (Turnkey 4x NVIDIA L40S 192GB VRAM Cluster).
• **Baseline Monthly Cloud API Spend:** $15,000 USD / month.
• **On-Premise Operating Cost (OPEX):** ~$1,150 USD / month (Power @ 2kW continuous, cooling & facility allocation).
• **Net Monthly Cash Liberation:** ~$13,850 USD / month.
• **Exact Break-Even Milestone:** **3.46 Months** ($48,000 ÷ $13,850).
• **Year 1 Net Capital Retained:** **$118,200 USD**, transforming unrecoverable cloud fees into tangible corporate equity.`
      : `**Análisis del Punto de Equilibrio y Retorno de Inversión:**
• **Inversión Inicial (CAPEX):** $48,000 USD (Servidor 4x NVIDIA L40S con 192GB VRAM).
• **Gasto Mensual en Cloud APIs:** $15,000 USD / mes ($180,000/año).
• **Costo Operativo On-Premise (OPEX):** ~$1,150 USD / mes (Energía a 2kW continuos, enfriamiento y mantenimiento).
• **Liberación Neta Mensual de Flujo:** ~$13,850 USD / mes.
• **Hito de Retorno de Capital:** **3.46 Meses** ($48,000 ÷ $13,850).
• **Ahorro Neto en el Año 1:** **$118,200 USD**, transformando un gasto irrecuperable en un activo corporativo amortizable.`;
  } else if (q.includes('gpu') || q.includes('hardware') || q.includes('l40s') || q.includes('h100') || q.includes('vram')) {
    answer = isEn
      ? `**GPU Hardware & Architectural Sizing:**
• **Accelerators:** 4x NVIDIA L40S (48GB GDDR6 with ECC each = **192GB VRAM total**).
• **Inference Advantage vs H100:** L40S delivers superior price-to-performance for FP8/INT4 inference workloads at 1/3 the acquisition cost of H100/H200 nodes.
• **Throughput:** Accommodates Llama-3.3 70B, Qwen-2.5 72B, and DeepSeek-V3 quantized models at over **1,200 tokens/sec continuous output**.
• **Network & Power:** 100GbE Optical Interconnect fabric and redundant 2000W Platinum PSUs.`
      : `**Dimensionamiento de Hardware y GPUs:**
• **Aceleradores:** 4x NVIDIA L40S (48GB GDDR6 con ECC por tarjeta = **192GB VRAM total**).
• **Ventaja vs H100:** Para inferencia pura y modelos cuantizados FP8/INT4, el cluster L40S ofrece el mejor costo-beneficio del mercado a 1/3 del costo de adquisición de un nodo H100.
• **Rendimiento:** Permite ejecutar modelos de 70B parámetros (Llama-3.3, Qwen-2.5, DeepSeek) superando los **1,200 tokens/segundo de throughput continuo**.
• **Conectividad:** Interfaces ópticas de 100GbE y fuentes redundantes de 2000W con certificación Titanium.`;
  } else if (q.includes('telecom') || q.includes('isp') || q.includes('fibra') || q.includes('churn') || q.includes('red')) {
    answer = isEn
      ? `**Telecom & Fiber Optics Operational Impact:**
• **Predictive Maintenance:** Real-time optical telemetry processing reduces network downtime by **42%**.
• **Churn Mitigation:** Sub-50ms behavioral models identify subscriber attrition risk, capturing an additional **+18.5% subscriber retention** ($840,000 retained ARR).
• **Automated GIS Mapping:** AI-driven route optimization accelerates fiber rollout velocity by **90%** while cutting upfront trenching CAPEX by **22%**.
• **Billing Fraud Detection:** Blocks **$1.2M/year** in telecom billing discrepancies.`
      : `**Impacto Operativo en Telecomunicaciones y Fibra Óptica:**
• **Mantenimiento Predictivo:** El procesamiento en tiempo real de telemetría óptica reduce las caídas de red en un **42%**.
• **Prevención de Abandono (Churn):** Modelos locales con latencia <50ms detectan anomalías de clientes, logrando un **+18.5% en retención** ($840,000 USD de ARR protegido).
• **Mapeo GIS Automatizado:** Optimización de rutas de fibra óptica que acelera el despliegue en un **90%** y reduce el CAPEX en zanjado en un **22%**.
• **Detección de Fraude:** Bloquea **$1.2M USD anuales** en anomalías de facturación e interconexión.`;
  } else {
    const slideTitle = slide ? slide.title : 'AI Financial Architecture';
    answer = isEn
      ? `**Executive Briefing on ${slideTitle}:**
• **Core Insight:** ${slide?.takeaway || 'Transitioning AI workloads from cloud API OPEX to on-premise hardware creates immediate capital efficiency.'}
• **Financial Impact:** Lowers per-token cost by **up to 98%** ($0.10-$0.50/1M tokens vs $5-$15/1M tokens in cloud).
• **Data Sovereignty:** Enterprise customer records and telecom telemetry never cross external network perimeters.
• **Recommended Action:** Execute a 48-hour financial architecture audit with Ing. Jorge Huerta (kuboxhubia@gmail.com).`
      : `**Resumen Ejecutivo sobre ${slideTitle}:**
• **Conclusión Clave:** ${slide?.takeaway || 'La transición de inferencia de IA desde APIs de nube (OPEX) a infraestructura propia (CAPEX) genera un ahorro masivo y control soberano.'}
• **Impacto Financiero:** Reduce el costo unitario de inferencia hasta en un **98%** ($0.10 - $0.50 por millón de tokens frente a $5 - $15 en la nube).
• **Soberanía y Seguridad:** La información confidencial y telemetría de red permanece 100% dentro del perímetro corporativo.
• **Siguiente Paso:** Solicitar una sesión de diagnóstico financiero de 48 horas con el Ing. Jorge Huerta (kuboxhubia@gmail.com).`;
  }

  const suggestions = generateSuggestedFollowups(slide, lang);
  return { answer, suggestions };
}

function generateSuggestedFollowups(slide: any, lang: string): string[] {
  const isEn = lang === 'English';
  if (!slide) {
    return isEn 
      ? ['What is the payback horizon?', 'Why 4x L40S over cloud APIs?', 'How to adopt the 90/10 hybrid model?']
      : ['¿Cómo se calcula el punto de equilibrio?', '¿Por qué 4x L40S en vez de APIs en la nube?', '¿En qué consiste el modelo híbrido 90/10?'];
  }

  switch (slide.slug) {
    case 'problem-cloud-cost':
      return isEn
        ? ['How fast do enterprise token bills compound?', 'What are the hidden egress & compliance costs?', 'How does SaaS pricing compare to fixed CAPEX?']
        : ['¿Cómo escala el gasto en tokens a 3 años?', '¿Cuáles son los costos ocultos de latencia y egress?', '¿Por qué la nube no genera balance sheet equity?'];
    case 'solution-on-prem-roi':
      return isEn
        ? ['Can we customize the break-even for our company?', 'What maintenance and power costs are included?', 'How does Year 1 savings reach $118,000?']
        : ['¿Qué costos de energía y enfriamiento se incluyen?', '¿Cómo se calculan los $118,000 de ahorro neto?', '¿Cómo impacta la depreciación fiscal del hardware?'];
    case 'hardware-infrastructure':
      return isEn
        ? ['Why NVIDIA L40S instead of H100 for inference?', 'What are the 100GbE optical network requirements?', 'How many tokens/sec does the cluster produce?']
        : ['¿Por qué NVIDIA L40S y no H100 para inferencia?', '¿Cuáles son los requerimientos eléctricos y de fibra?', '¿Qué modelos abiertos (70B) se pueden ejecutar?'];
    case 'telecom-cases-1':
    case 'telecom-cases-2':
      return isEn
        ? ['How does predictive AI reduce fiber downtime by 42%?', 'How does churn prevention save $840k ARR?', 'How is GIS route mapping automated?']
        : ['¿Cómo reduce la IA el downtime de fibra en 42%?', '¿Cómo se integra la prevención de churn con el CRM?', '¿Cómo funciona la optimización de rutas GIS?'];
    case 'mlops-strategy':
      return isEn
        ? ['How does vLLM continuous batching work?', 'What is the precision loss in INT4 quantization?', 'How does MLOps maximize hardware utilization?']
        : ['¿Cómo funciona el continuous batching en vLLM?', '¿Hay pérdida de precisión al usar INT4 o FP8?', '¿Cómo mantener la utilización de GPUs sobre el 92%?'];
    case 'hybrid-ai-architecture':
      return isEn
        ? ['Why is 90/10 the golden ratio for CFOs?', 'How are burst spikes routed to public cloud?', 'What security policies govern the hybrid pipeline?']
        : ['¿Por qué la regla 90/10 es ideal para CFOs?', '¿Cómo se enrutan automáticamente los picos a la nube?', '¿Qué latencias se logran en la carga base local?'];
    default:
      return isEn
        ? ['What is the payback period for my company?', 'What are the hardware specifications?', 'How do I contact Ing. Jorge Huerta?']
        : ['¿Cuál es el tiempo de recuperación de capital?', '¿Cuáles son las especificaciones técnicas?', '¿Cómo agendar una sesión con el Ing. Jorge Huerta?'];
  }
}

startServer();
