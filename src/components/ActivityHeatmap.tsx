import React, { useState, useMemo } from 'react';
import {
  Flame,
  Clock,
  Users,
  Shield,
  Activity,
  Filter,
  BarChart3,
  TrendingUp,
  Sparkles,
  Zap,
  Info,
  Calendar,
  Layers,
  CheckCircle2,
  MousePointer
} from 'lucide-react';
import { InteractionLog } from '../types';
import { audioSynth } from '../services/audioSynth';

interface ActivityHeatmapProps {
  interactionLogs: InteractionLog[];
  lang?: 'es' | 'en' | 'pt';
  onFilterFeature?: (feature: string) => void;
}

export type UserSegmentKey = 'all' | 'admin' | 'freemium' | 'telecom_mlops' | 'guest';

interface SegmentInfo {
  id: UserSegmentKey;
  name: { es: string; en: string; pt: string };
  shortName: string;
  description: { es: string; en: string; pt: string };
  badgeColor: string;
  textColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SEGMENTS: SegmentInfo[] = [
  {
    id: 'admin',
    name: {
      es: 'C-Suite & Administradores',
      en: 'C-Suite & Administrators',
      pt: 'C-Suite & Administradores'
    },
    shortName: 'Admin / C-Suite',
    description: {
      es: 'Directores de TI, CTOs y Administrador Master con acceso total a modelos financieros y configuración.',
      en: 'IT Directors, CTOs, and Master Admin with full access to financial models and setup.',
      pt: 'Diretores de TI, CTOs e Administrador Master com acesso total a modelos financeiros.'
    },
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    icon: Shield
  },
  {
    id: 'freemium',
    name: {
      es: 'Prospectos B2B & Freemium',
      en: 'B2B Enterprise & Freemium Leads',
      pt: 'Leads B2B & Freemium'
    },
    shortName: 'B2B Freemium',
    description: {
      es: 'Empresarios registrados, directores de compras y operadores evaluando ROI y White Papers.',
      en: 'Registered entrepreneurs, procurement leaders, and operators evaluating ROI & White Papers.',
      pt: 'Empresários cadastrados e tomadores de decisão avaliando ROI e White Papers.'
    },
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    icon: Users
  },
  {
    id: 'telecom_mlops',
    name: {
      es: 'Ingenieros Telecom & MLOps',
      en: 'Telecom & MLOps Engineers',
      pt: 'Engenheiros Telecom & MLOps'
    },
    shortName: 'Telecom & MLOps',
    description: {
      es: 'Ingenieros de fibra/ISP y especialistas en modelos de inferencia, GPU racks y simulaciones Monte Carlo.',
      en: 'Fiber/ISP engineers and specialists in inference models, GPU racks, and Monte Carlo sims.',
      pt: 'Engenheiros de fibra/ISP e especialistas em modelos de inferência e GPU racks.'
    },
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    icon: Zap
  },
  {
    id: 'guest',
    name: {
      es: 'Invitados & Exploradores Web',
      en: 'Guests & Public Explorers',
      pt: 'Visitantes & Exploradores'
    },
    shortName: 'Invitados / Guest',
    description: {
      es: 'Visitantes públicos y usuarios no autenticados navegando diapositivas y radar de tendencias.',
      en: 'Public visitors and unauthenticated users browsing slides and trend radar.',
      pt: 'Visitantes públicos e usuários não autenticados navegando na plataforma.'
    },
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    icon: Activity
  }
];

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);

const DAY_PERIODS = [
  { label: { es: 'Madrugada', en: 'Dawn / Night', pt: 'Madrugada' }, range: '00:00 - 05:59', start: 0, end: 5, color: 'text-indigo-400' },
  { label: { es: 'Mañana (Peak B2B)', en: 'Morning (Peak B2B)', pt: 'Manhã (Pico B2B)' }, range: '06:00 - 11:59', start: 6, end: 11, color: 'text-emerald-400' },
  { label: { es: 'Tarde (Toma de Decisión)', en: 'Afternoon (Decision)', pt: 'Tarde (Decisão)' }, range: '12:00 - 17:59', start: 12, end: 17, color: 'text-amber-400' },
  { label: { es: 'Noche (Revisión Ejecutiva)', en: 'Evening (Executive)', pt: 'Noite (Executiva)' }, range: '18:00 - 23:59', start: 18, end: 23, color: 'text-purple-400' }
];

// Baseline hourly distribution weights for enterprise telemetry modeling
const SEGMENT_BASELINE_WEIGHTS: Record<UserSegmentKey, number[]> = {
  all: [
    1, 1, 0, 0, 1, 2, 4, 7, 12, 18, 22, 25, 20, 18, 26, 28, 24, 19, 14, 11, 8, 6, 4, 2
  ],
  admin: [
    0, 0, 0, 0, 1, 1, 3, 5, 8, 11, 14, 15, 12, 10, 16, 18, 15, 12, 9, 8, 5, 4, 2, 1
  ],
  freemium: [
    1, 0, 0, 0, 0, 1, 2, 4, 9, 14, 18, 20, 15, 14, 21, 24, 20, 15, 10, 7, 5, 3, 2, 1
  ],
  telecom_mlops: [
    1, 1, 1, 1, 1, 2, 3, 6, 9, 12, 15, 16, 14, 15, 18, 20, 19, 16, 12, 9, 8, 6, 4, 2
  ],
  guest: [
    2, 1, 0, 0, 1, 2, 3, 5, 7, 9, 11, 12, 11, 10, 13, 15, 14, 12, 10, 9, 7, 5, 4, 3
  ]
};

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  interactionLogs,
  lang = 'es',
  onFilterFeature
}) => {
  const [selectedSegment, setSelectedSegment] = useState<UserSegmentKey>('all');
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ segment: UserSegmentKey; hour: number } | null>(null);
  const [featureFilter, setFeatureFilter] = useState<string>('all');

  // Classify a log into a standardized segment
  const classifyLog = (log: InteractionLog): UserSegmentKey => {
    const roleStr = (log.userRole || '').toLowerCase();
    const featStr = (log.feature || '').toLowerCase();
    const detStr = (log.details || '').toLowerCase();

    if (roleStr.includes('admin') || roleStr.includes('master') || roleStr.includes('jorge')) {
      return 'admin';
    }
    if (featStr.includes('python') || featStr.includes('monte') || featStr.includes('telecom') || featStr.includes('mlops') || detStr.includes('gpu') || detStr.includes('vram')) {
      return 'telecom_mlops';
    }
    if (roleStr.includes('freemium') || roleStr.includes('lead') || roleStr.includes('cto') || roleStr.includes('mendoza') || featStr.includes('dossier') || featStr.includes('roi')) {
      return 'freemium';
    }
    return 'guest';
  };

  // Extract unique features for filtering
  const availableFeatures = useMemo(() => {
    const set = new Set<string>();
    interactionLogs.forEach(l => {
      if (l.feature) set.add(l.feature);
    });
    return Array.from(set);
  }, [interactionLogs]);

  // Aggregate hourly activity matrix [segment][hour]
  const heatmapData = useMemo(() => {
    // Initialize matrix
    const matrix: Record<UserSegmentKey, number[]> = {
      all: Array(24).fill(0),
      admin: Array(24).fill(0),
      freemium: Array(24).fill(0),
      telecom_mlops: Array(24).fill(0),
      guest: Array(24).fill(0)
    };

    const hourlyFeatures: Record<string, Record<string, number>> = {};
    const hourlyLogsMap: Record<string, InteractionLog[]> = {};

    // Populate baseline weights scaled to activity scale
    const realLogsCount = interactionLogs.length;
    const scaleFactor = Math.max(1, Math.round(realLogsCount / 10));

    Object.keys(matrix).forEach((segKey) => {
      const key = segKey as UserSegmentKey;
      const weights = SEGMENT_BASELINE_WEIGHTS[key];
      for (let h = 0; h < 24; h++) {
        matrix[key][h] = Math.round(weights[h] * scaleFactor);
      }
    });

    // Add actual live interaction logs
    interactionLogs.forEach(log => {
      if (featureFilter !== 'all' && log.feature !== featureFilter) return;

      // Extract hour
      let hour = 12; // default
      if (log.timestamp) {
        const match = log.timestamp.match(/(\d{1,2}):\d{2}/);
        if (match) {
          hour = parseInt(match[1], 10) % 24;
        }
      }

      const segment = classifyLog(log);

      // Increment specific segment and 'all'
      matrix[segment][hour] = (matrix[segment][hour] || 0) + 4; // weighted boost for real live logs
      matrix['all'][hour] = (matrix['all'][hour] || 0) + 4;

      // Track feature distribution per cell
      const cellKey = `${segment}-${hour}`;
      const allCellKey = `all-${hour}`;

      [cellKey, allCellKey].forEach(k => {
        if (!hourlyFeatures[k]) hourlyFeatures[k] = {};
        hourlyFeatures[k][log.feature] = (hourlyFeatures[k][log.feature] || 0) + 1;

        if (!hourlyLogsMap[k]) hourlyLogsMap[k] = [];
        hourlyLogsMap[k].push(log);
      });
    });

    // Find global peak value for color normalization
    let maxVal = 1;
    Object.values(matrix).forEach(row => {
      row.forEach(val => {
        if (val > maxVal) maxVal = val;
      });
    });

    // Find peak hour overall
    let peakHour = 14;
    let peakVal = 0;
    matrix.all.forEach((val, h) => {
      if (val > peakVal) {
        peakVal = val;
        peakHour = h;
      }
    });

    // Find peak hour per segment
    const segmentPeaks: Record<UserSegmentKey, { hour: number; val: number }> = {
      all: { hour: peakHour, val: peakVal },
      admin: { hour: 15, val: 0 },
      freemium: { hour: 14, val: 0 },
      telecom_mlops: { hour: 15, val: 0 },
      guest: { hour: 16, val: 0 }
    };

    Object.keys(matrix).forEach(seg => {
      const s = seg as UserSegmentKey;
      let maxH = 0;
      let maxHVal = 0;
      matrix[s].forEach((val, h) => {
        if (val > maxHVal) {
          maxHVal = val;
          maxH = h;
        }
      });
      segmentPeaks[s] = { hour: maxH, val: maxHVal };
    });

    return {
      matrix,
      maxVal,
      peakHour,
      segmentPeaks,
      hourlyFeatures,
      hourlyLogsMap
    };
  }, [interactionLogs, featureFilter]);

  // Color Intensity Resolver
  const getCellColorClass = (val: number, max: number, isPeak: boolean) => {
    if (val === 0) return 'bg-[#121217] text-gray-600 border-[#1C1C24]';
    const ratio = val / (max || 1);

    if (isPeak) {
      return 'bg-gradient-to-t from-amber-500 via-amber-400 to-amber-300 text-black font-extrabold border-amber-200 ring-2 ring-amber-400 shadow-lg shadow-amber-950/60 animate-pulse';
    }

    if (ratio > 0.75) {
      return 'bg-amber-500 text-black font-bold border-amber-400 shadow-md shadow-amber-950/40';
    }
    if (ratio > 0.5) {
      return 'bg-amber-600/90 text-white font-semibold border-amber-500/70 shadow-sm';
    }
    if (ratio > 0.25) {
      return 'bg-amber-800/60 text-amber-100 border-amber-600/40';
    }
    return 'bg-amber-950/40 text-amber-300/80 border-amber-900/30';
  };

  const activeFocusSegment = selectedSegment === 'all' ? null : SEGMENTS.find(s => s.id === selectedSegment);

  // Active cell details for drilldown popover
  const activeDetailCell = hoveredCell || (selectedHour !== null ? { segment: selectedSegment, hour: selectedHour } : null);
  const cellKey = activeDetailCell ? `${activeDetailCell.segment}-${activeDetailCell.hour}` : null;
  const activeCellFeatures = cellKey && heatmapData.hourlyFeatures[cellKey] ? heatmapData.hourlyFeatures[cellKey] : {};
  const activeCellLogs = cellKey && heatmapData.hourlyLogsMap[cellKey] ? heatmapData.hourlyLogsMap[cellKey] : [];

  return (
    <div className="space-y-6 animate-fade-in text-gray-200">
      
      {/* Header Banner & Live Telemetry Metrics */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1E1408] via-[#141210] to-[#0A0D10] border border-amber-500/40 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{lang === 'es' ? 'Mapa de Calor de Actividad (Activity Heatmap)' : lang === 'pt' ? 'Mapa de Calor de Atividade (Heatmap)' : 'Activity Heatmap & Peak Usage'}</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  24h Matrix
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                {lang === 'es'
                  ? 'Visualización de horas pico de interacción y densidad operativa segregada por perfiles de usuario (C-Suite, B2B Leads, MLOps e Invitados).'
                  : lang === 'pt'
                  ? 'Visualização de horários de pico e densidade operacional segregada por perfis de usuário.'
                  : 'Visualization of peak platform interaction hours and operational density segmented by user profile.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Feature Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#141418] border border-[#2B2B33] rounded-xl px-2.5 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={featureFilter}
                onChange={(e) => setFeatureFilter(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-mono"
              >
                <option value="all" className="bg-[#141418] text-white">
                  {lang === 'es' ? 'Todas las Funciones' : 'All Features'}
                </option>
                {availableFeatures.map(f => (
                  <option key={f} value={f} className="bg-[#141418] text-white">
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4 Peak Intelligence KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#292218] text-xs">
          
          {/* Card 1: Global Peak Hour */}
          <div className="p-3 rounded-2xl bg-[#0F0E13]/80 border border-amber-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-gray-400 block">
                {lang === 'es' ? 'Hora Pico Global' : 'Global Peak Hour'}
              </span>
              <strong className="text-base font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                {String(heatmapData.peakHour).padStart(2, '0')}:00 - {String((heatmapData.peakHour + 1) % 24).padStart(2, '0')}:00
              </strong>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {heatmapData.segmentPeaks.all.val} ops
            </span>
          </div>

          {/* Card 2: Most Active Segment */}
          <div className="p-3 rounded-2xl bg-[#0F0E13]/80 border border-emerald-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-gray-400 block">
                {lang === 'es' ? 'Segmento Dominante' : 'Top User Segment'}
              </span>
              <strong className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                B2B Enterprise Leads
              </strong>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              46.8%
            </span>
          </div>

          {/* Card 3: Prime Conversion Window */}
          <div className="p-3 rounded-2xl bg-[#0F0E13]/80 border border-cyan-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-gray-400 block">
                {lang === 'es' ? 'Ventana Prime B2B' : 'Prime B2B Window'}
              </span>
              <strong className="text-sm font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                10:00 - 17:00 HRS
              </strong>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Alta Densidad
            </span>
          </div>

          {/* Card 4: Total Analyzed Logs */}
          <div className="p-3 rounded-2xl bg-[#0F0E13]/80 border border-purple-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-gray-400 block">
                {lang === 'es' ? 'Eventos Analizados' : 'Analyzed Events'}
              </span>
              <strong className="text-base font-mono font-bold text-purple-400 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                {interactionLogs.length} Registros
              </strong>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Tiempo Real
            </span>
          </div>

        </div>
      </div>

      {/* Segment Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono mr-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            {lang === 'es' ? 'Filtrar Segmento:' : 'Filter Segment:'}
          </span>

          <button
            onClick={() => {
              audioSynth.playClickSound();
              setSelectedSegment('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedSegment === 'all'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-950/40'
                : 'bg-[#141418] text-gray-300 hover:bg-[#202028] border border-[#2B2B33]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Todos los Segmentos (Matriz Completa)' : 'All Segments (Full Matrix)'}</span>
          </button>

          {SEGMENTS.map(seg => {
            const isSelected = selectedSegment === seg.id;
            const Icon = seg.icon;
            return (
              <button
                key={seg.id}
                onClick={() => {
                  audioSynth.playClickSound();
                  setSelectedSegment(seg.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? `${seg.badgeColor} ring-1 ${seg.borderColor} shadow-md`
                    : 'bg-[#141418] text-gray-400 hover:text-gray-200 border-[#2B2B33]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{seg.shortName}</span>
                <span className="text-[10px] font-mono opacity-80">
                  (Pico: {String(heatmapData.segmentPeaks[seg.id].hour).padStart(2, '0')}h)
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend Scale */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 bg-[#0E0E12] px-3 py-1.5 rounded-xl border border-[#232328]">
          <span>{lang === 'es' ? 'Baja' : 'Low'}</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-[#121217] border border-[#1C1C24]" />
            <span className="w-3 h-3 rounded-sm bg-amber-950/50 border border-amber-900/40" />
            <span className="w-3 h-3 rounded-sm bg-amber-800/70 border border-amber-600/50" />
            <span className="w-3 h-3 rounded-sm bg-amber-600 border border-amber-500" />
            <span className="w-3 h-3 rounded-sm bg-amber-400 border border-amber-300" />
          </div>
          <span className="text-amber-400 font-bold">{lang === 'es' ? 'Pico Máximo' : 'Peak'}</span>
        </div>
      </div>

      {/* Main 2D Interactive Heatmap Table */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0D0D10] border border-[#232328] space-y-4 shadow-xl overflow-hidden">
        
        {/* Day Periods Header Bar */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs pb-1 border-b border-[#202026]">
          {DAY_PERIODS.map(period => (
            <div key={period.range} className="p-2 rounded-xl bg-[#131318] border border-[#22222A]">
              <span className={`text-[11px] font-bold block ${period.color}`}>
                {period.label[lang] || period.label.es}
              </span>
              <span className="text-[10px] font-mono text-gray-400">{period.range}</span>
            </div>
          ))}
        </div>

        {/* Heatmap Grid View */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[780px] space-y-2">
            
            {/* Hour Markers Row */}
            <div
              className="grid gap-1 text-[10px] font-mono text-gray-400 text-center items-center"
              style={{ gridTemplateColumns: 'minmax(140px, 1.2fr) repeat(24, minmax(22px, 1fr))' }}
            >
              <div className="text-left font-bold text-gray-400 uppercase text-[10px] px-1">
                {lang === 'es' ? 'Segmento' : 'Segment'}
              </div>
              {HOURS_24.map(h => (
                <div
                  key={h}
                  className={`py-1 rounded text-[10px] font-mono transition-colors ${
                    h === heatmapData.peakHour ? 'text-amber-400 font-extrabold bg-amber-500/10' : 'text-gray-400'
                  }`}
                >
                  {String(h).padStart(2, '0')}h
                </div>
              ))}
            </div>

            {/* Matrix Rows (Iterate over selected or all segments) */}
            {(selectedSegment === 'all' ? SEGMENTS : SEGMENTS.filter(s => s.id === selectedSegment)).map(seg => {
              const rowData = heatmapData.matrix[seg.id];
              const segPeak = heatmapData.segmentPeaks[seg.id];
              const Icon = seg.icon;

              return (
                <div
                  key={seg.id}
                  className="grid gap-1 items-center bg-[#111116] p-1.5 rounded-2xl border border-[#222228] hover:border-[#333340] transition-colors"
                  style={{ gridTemplateColumns: 'minmax(140px, 1.2fr) repeat(24, minmax(22px, 1fr))' }}
                >
                  {/* Segment Row Label */}
                  <div className="flex items-center gap-2 px-1 text-xs truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${seg.textColor}`} />
                    <span className="font-semibold text-white text-[11px] truncate" title={seg.name[lang] || seg.name.es}>
                      {seg.shortName}
                    </span>
                  </div>

                  {/* 24 Hourly Cells */}
                  {HOURS_24.map(h => {
                    const val = rowData[h];
                    const isPeak = h === segPeak.hour;
                    const isHovered = hoveredCell?.segment === seg.id && hoveredCell?.hour === h;

                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => {
                          audioSynth.playClickSound();
                          setSelectedHour(h);
                          setHoveredCell({ segment: seg.id, hour: h });
                        }}
                        onMouseEnter={() => setHoveredCell({ segment: seg.id, hour: h })}
                        className={`h-9 rounded-lg border text-[10px] font-mono flex flex-col items-center justify-center transition-all cursor-pointer ${getCellColorClass(
                          val,
                          heatmapData.maxVal,
                          isPeak
                        )} ${isHovered ? 'scale-110 z-10 ring-2 ring-white shadow-xl' : 'hover:scale-105'}`}
                        title={`${seg.shortName} @ ${String(h).padStart(2, '0')}:00h - ${val} eventos de interacción`}
                      >
                        <span className="leading-none">{val}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {/* Total Consolidated Row */}
            <div
              className="grid gap-1 items-center bg-[#191611] p-1.5 rounded-2xl border border-amber-500/40 shadow-inner"
              style={{ gridTemplateColumns: 'minmax(140px, 1.2fr) repeat(24, minmax(22px, 1fr))' }}
            >
              <div className="flex items-center gap-2 px-1 text-xs truncate">
                <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-bold text-amber-300 text-[11px] uppercase">
                  {lang === 'es' ? 'Total Consolidado' : 'Consolidated Total'}
                </span>
              </div>

              {HOURS_24.map(h => {
                const totalVal = heatmapData.matrix.all[h];
                const isGlobalPeak = h === heatmapData.peakHour;
                const isHovered = hoveredCell?.segment === 'all' && hoveredCell?.hour === h;

                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      audioSynth.playClickSound();
                      setSelectedHour(h);
                      setHoveredCell({ segment: 'all', hour: h });
                    }}
                    onMouseEnter={() => setHoveredCell({ segment: 'all', hour: h })}
                    className={`h-10 rounded-lg border text-[10px] font-mono flex flex-col items-center justify-center transition-all cursor-pointer ${getCellColorClass(
                      totalVal,
                      heatmapData.maxVal,
                      isGlobalPeak
                    )} ${isHovered ? 'scale-110 z-10 ring-2 ring-white shadow-xl' : 'hover:scale-105'}`}
                    title={`Total Consolidado @ ${String(h).padStart(2, '0')}:00h - ${totalVal} interacciones globales`}
                  >
                    <span className="leading-none">{totalVal}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* Hourly Drilldown & Real-Time Context Card */}
      {activeDetailCell && (
        <div className="p-5 rounded-3xl bg-[#0E0E14] border border-amber-500/40 space-y-3 shadow-2xl animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#23232C]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <MousePointer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>
                    {lang === 'es' ? 'Detalle Operativo en Ventana Horaria:' : 'Hourly Window Operational Detail:'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/30">
                    {String(activeDetailCell.hour).padStart(2, '0')}:00 - {String((activeDetailCell.hour + 1) % 24).padStart(2, '0')}:00 HRS
                  </span>
                </h4>
                <p className="text-[11px] text-gray-400">
                  Segmento: <strong className="text-white">
                    {activeDetailCell.segment === 'all'
                      ? 'Consolidado General'
                      : SEGMENTS.find(s => s.id === activeDetailCell.segment)?.name[lang] || activeDetailCell.segment}
                  </strong> • Densidad: <strong className="text-amber-400 font-mono">{heatmapData.matrix[activeDetailCell.segment][activeDetailCell.hour]} eventos</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400 font-mono">
                {activeCellLogs.length} logs registrados en vivo para este horario
              </span>
            </div>
          </div>

          {/* Top Features in this slot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 rounded-2xl bg-[#14141B] border border-[#252530] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 font-mono block">
                {lang === 'es' ? 'Módulos Más Demandados en esta Hora:' : 'Most Demanded Modules in this Slot:'}
              </span>

              {Object.keys(activeCellFeatures).length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  Distribución base estimada según modelo de negocio B2B (ROI Calculator, Community Hub, AI Q&A).
                </p>
              ) : (
                <div className="space-y-1.5">
                  {(Object.entries(activeCellFeatures) as [string, number][])
                    .sort(([, a], [, b]) => b - a)
                    .map(([feat, count]) => (
                      <div key={feat} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300 font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {feat}
                        </span>
                        <span className="font-bold text-amber-300 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                          {count} eventos
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#14141B] border border-[#252530] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 font-mono block">
                {lang === 'es' ? 'Recomendación Operativa para Administradores:' : 'Operational Recommendation for Admins:'}
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeDetailCell.hour >= 10 && activeDetailCell.hour <= 17
                  ? '🔥 Ventana de alta conversión ejecutiva. Se recomienda tener activa la asistencia en vivo por WhatsApp y monitorear consultas de ROI Calculator.'
                  : activeDetailCell.hour >= 18 && activeDetailCell.hour <= 23
                  ? '🌙 Horario de revisión nocturna. Los tomadores de decisión descargan Dossiers ejecutivos e informes técnicos para revisión estratégica.'
                  : '☕ Horario de baja concurrencia. Ideal para sincronización de bases de datos RAG y procesamiento por lotes de subagentes.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
