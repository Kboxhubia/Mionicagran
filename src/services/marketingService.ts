import { RoadmapMilestone } from '../data/roadmapData';

export interface GeneratedMarketingAsset {
  id: string;
  platform: string;
  format: string;
  hook: string;
  content: string;
  hashtags: string[];
  targetAudience: string;
  characterCount?: number;
}

export interface MarketingGenerationRequest {
  milestone: RoadmapMilestone;
  platform?: string;
  tone?: 'executive' | 'technical' | 'viral' | 'investor';
  language?: 'es' | 'en' | 'pt';
  customFocus?: string;
}

export const marketingService = {
  async generateAssets(req: MarketingGenerationRequest): Promise<{ assets: GeneratedMarketingAsset[]; isSimulated?: boolean }> {
    try {
      const response = await fetch('/api/ai/marketing-assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Falling back to local marketing generation:', error);
      // Local graceful fallback
      return {
        assets: [
          {
            id: 'asset-local-1',
            platform: 'LinkedIn',
            format: 'Executive Long-Form Post',
            hook: `🚀 Estrategia de IA Soberana [${req.milestone.quarter}]: Desacople de APIs Cloud & Retorno en 3.4 Meses`,
            content: `🚨 El Error de $180,000 USD: La mayoría de las empresas queman más de $15,000 USD mensuales en tokens en la nube sin crear patrimonio en su balance general.\n\nEn Kuboxhubia AI Financial Systems avanzamos en nuestro Roadmap: *${req.milestone.title.es}*.\n\n📌 Objetivos Clave:\n${req.milestone.keyDeliverables.map(d => `• ${d}`).join('\n')}\n\n💡 Impacto Financiero: ${req.milestone.metricsTarget}\n\nCon clústeres propios de 4x NVIDIA L40S, las empresas logran payback en 3.4 meses y reducen el costo unitario de inferencia hasta en un 98%.\n\n📩 Agende una sesión con el Ing. Jorge Huerta (kuboxhubia@gmail.com).\n\n#InteligenciaArtificial #CFO #AIInfrastructure #Kuboxhubia #DeepTech`,
            hashtags: ['#InteligenciaArtificial', '#CFO', '#AIInfrastructure', '#Kuboxhubia'],
            targetAudience: 'CEOs, CFOs, CTOs y Directores de Telecomunicaciones',
            characterCount: 780
          },
          {
            id: 'asset-local-2',
            platform: 'X / Twitter',
            format: 'Post Punchy',
            hook: `Dejar de rentar IA para ser dueños de nuestra propia infraestructura. ⚡`,
            content: `⚡ Roadmap [${req.milestone.quarter}]: ${req.milestone.title.es}\n\n• Payback: 3.4 meses\n• Meta: ${req.milestone.metricsTarget}\n• 100% soberanía de datos y cero latencia de red 🛡️\n\nDemo interactiva: https://kboxhubia-github-io.vercel.app/`,
            hashtags: ['#IA', '#DeepTech', '#GPU'],
            targetAudience: 'MLOps Engineers y Founders',
            characterCount: 260
          },
          {
            id: 'asset-local-3',
            platform: 'WhatsApp VIP Broadcast',
            format: 'Mensaje Directo C-Suite',
            hook: `*Actualización Estratégica Kuboxhubia [${req.milestone.quarter}]*`,
            content: `*INFORME ESTRATÉGICO | KUBOXHUBIA AI FINANCIAL SYSTEMS*\n\nEstimado Directivo:\n\nLe presentamos el hito activo en nuestro Roadmap de Infraestructura:\n🎯 *${req.milestone.title.es}*\n\n📌 *Entregables:*\n${req.milestone.keyDeliverables.slice(0, 3).map(d => `• ${d}`).join('\n')}\n\n📈 *Objetivo Financiero:* ${req.milestone.metricsTarget}\n\nPara revisar el dimensionamiento de hardware de su empresa, contáctenos directamente al WhatsApp *+58 412-3931011* o vía correo a *kuboxhubia@gmail.com*.`,
            hashtags: [],
            targetAudience: 'Prospectos Ejecutivos',
            characterCount: 520
          }
        ],
        isSimulated: true
      };
    }
  }
};
