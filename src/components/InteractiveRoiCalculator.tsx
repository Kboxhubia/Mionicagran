import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  X, 
  TrendingUp, 
  DollarSign, 
  Server, 
  Zap, 
  Clock, 
  CheckCircle2, 
  FileDown, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Sliders,
  Calendar,
  Eye,
  RotateCcw,
  Save
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  Legend
} from 'recharts';
import { exportExecutivePdfReport } from '../services/pdfExporter';
import { audioSynth } from '../services/audioSynth';

export interface RoiCalculatorInputs {
  monthlyCloudSpend: number;
  hardwareCapex: number;
  monthlyElectricity: number;
  monthlyMlOps: number;
  timelineHorizon: 36 | 12;
}

export const DEFAULT_ROI_INPUTS: RoiCalculatorInputs = {
  monthlyCloudSpend: 15000, // $15,000/mo ($180k/yr)
  hardwareCapex: 48000,    // $48,000 (4x L40S)
  monthlyElectricity: 650, // Power & Datacenter
  monthlyMlOps: 2000,      // MLOps amortized
  timelineHorizon: 36      // 36-Month vs 12-Month
};

const STORAGE_KEY = 'kbox_roi_calculator_inputs';

function loadSavedRoiInputs(): RoiCalculatorInputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        monthlyCloudSpend: typeof parsed.monthlyCloudSpend === 'number' && !isNaN(parsed.monthlyCloudSpend) && parsed.monthlyCloudSpend >= 1000
          ? parsed.monthlyCloudSpend
          : DEFAULT_ROI_INPUTS.monthlyCloudSpend,
        hardwareCapex: typeof parsed.hardwareCapex === 'number' && !isNaN(parsed.hardwareCapex) && parsed.hardwareCapex >= 5000
          ? parsed.hardwareCapex
          : DEFAULT_ROI_INPUTS.hardwareCapex,
        monthlyElectricity: typeof parsed.monthlyElectricity === 'number' && !isNaN(parsed.monthlyElectricity)
          ? parsed.monthlyElectricity
          : DEFAULT_ROI_INPUTS.monthlyElectricity,
        monthlyMlOps: typeof parsed.monthlyMlOps === 'number' && !isNaN(parsed.monthlyMlOps)
          ? parsed.monthlyMlOps
          : DEFAULT_ROI_INPUTS.monthlyMlOps,
        timelineHorizon: parsed.timelineHorizon === 12 || parsed.timelineHorizon === 36
          ? parsed.timelineHorizon
          : DEFAULT_ROI_INPUTS.timelineHorizon
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_ROI_INPUTS;
}

interface InteractiveRoiCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveRoiCalculator: React.FC<InteractiveRoiCalculatorProps> = ({
  isOpen,
  onClose
}) => {
  // Configurable CFO Parameters with Browser Storage Persistence
  const [monthlyCloudSpend, setMonthlyCloudSpend] = useState<number>(() => loadSavedRoiInputs().monthlyCloudSpend);
  const [hardwareCapex, setHardwareCapex] = useState<number>(() => loadSavedRoiInputs().hardwareCapex);
  const [monthlyElectricity, setMonthlyElectricity] = useState<number>(() => loadSavedRoiInputs().monthlyElectricity);
  const [monthlyMlOps, setMonthlyMlOps] = useState<number>(() => loadSavedRoiInputs().monthlyMlOps);
  const [timelineHorizon, setTimelineHorizon] = useState<36 | 12>(() => loadSavedRoiInputs().timelineHorizon);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSavedIndicator, setIsSavedIndicator] = useState<boolean>(false);

  // Auto-persist inputs to browser localStorage
  useEffect(() => {
    try {
      const payload: RoiCalculatorInputs = {
        monthlyCloudSpend,
        hardwareCapex,
        monthlyElectricity,
        monthlyMlOps,
        timelineHorizon
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setIsSavedIndicator(true);
      const timer = setTimeout(() => setIsSavedIndicator(false), 2000);
      return () => clearTimeout(timer);
    } catch {
      // ignore storage errors
    }
  }, [monthlyCloudSpend, hardwareCapex, monthlyElectricity, monthlyMlOps, timelineHorizon]);

  const handleResetDefaults = () => {
    audioSynth.playClickSound();
    setMonthlyCloudSpend(DEFAULT_ROI_INPUTS.monthlyCloudSpend);
    setHardwareCapex(DEFAULT_ROI_INPUTS.hardwareCapex);
    setMonthlyElectricity(DEFAULT_ROI_INPUTS.monthlyElectricity);
    setMonthlyMlOps(DEFAULT_ROI_INPUTS.monthlyMlOps);
    setTimelineHorizon(DEFAULT_ROI_INPUTS.timelineHorizon);
  };

  if (!isOpen) return null;

  // Monthly On-Premises OPEX (Power + Maintenance)
  const monthlyOnPremOpex = monthlyElectricity + monthlyMlOps;
  // Net monthly savings compared to Cloud API
  const netMonthlyCashflowSavings = monthlyCloudSpend - monthlyOnPremOpex;
  // Break-even in months
  const breakEvenMonths = netMonthlyCashflowSavings > 0 
    ? hardwareCapex / netMonthlyCashflowSavings 
    : 999;

  // 1-Year Financials
  const annualCloudCost = monthlyCloudSpend * 12;
  const year1OnPremTotal = hardwareCapex + (monthlyOnPremOpex * 12);
  const year1NetSavings = annualCloudCost - year1OnPremTotal;

  // 3-Year TCO
  const threeYearCloudCost = monthlyCloudSpend * 36;
  const threeYearOnPremTotal = hardwareCapex + (monthlyOnPremOpex * 36);
  const threeYearNetSavings = threeYearCloudCost - threeYearOnPremTotal;

  // Generate 36-Month Recharts data points
  const maxMonths = timelineHorizon;
  const chartData = Array.from({ length: maxMonths + 1 }, (_, m) => {
    const cloudCum = m * monthlyCloudSpend;
    const onPremCum = hardwareCapex + (m * monthlyOnPremOpex);
    const netRetained = Math.max(0, cloudCum - onPremCum);
    return {
      monthNum: m,
      monthLabel: m === 0 ? 'M0' : `M${m}`,
      cloud: cloudCum,
      onPrem: onPremCum,
      netRetained: netRetained,
      isCrossover: Math.abs(m - Math.round(breakEvenMonths)) === 0 && breakEvenMonths <= maxMonths
    };
  });

  // Calculate crossover value for the reference dot
  const crossoverCost = breakEvenMonths <= maxMonths && breakEvenMonths > 0
    ? breakEvenMonths * monthlyCloudSpend
    : null;

  const handleExportWithSimulation = async () => {
    audioSynth.playClickSound();
    setIsExporting(true);
    try {
      await exportExecutivePdfReport({
        monthlySpend: monthlyCloudSpend,
        capex: hardwareCapex,
        breakEvenMonths: breakEvenMonths,
        year1Savings: year1NetSavings,
        threeYearSavings: threeYearNetSavings
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Custom Executive Tooltip for Recharts
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0]?.payload;
    if (!data) return null;

    const m = data.monthNum;
    const isPastBreakEven = m >= breakEvenMonths;
    const diff = data.cloud - data.onPrem;

    return (
      <div className="bg-[#121215] border border-[#333338] p-3 rounded-xl shadow-2xl text-xs font-sans min-w-[210px] backdrop-blur-md">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#27272A]">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Month {m} {m === 0 ? '(Deployment Day)' : m === 12 ? '(Year 1)' : m === 24 ? '(Year 2)' : m === 36 ? '(Year 3 Horizon)' : ''}
          </span>
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
            isPastBreakEven
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
              : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
          }`}>
            {isPastBreakEven ? 'Profitable' : 'Amortizing'}
          </span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              Cloud API Cumulative:
            </span>
            <span className="font-mono font-bold text-white">${data.cloud.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              On-Prem (4x L40S) TCO:
            </span>
            <span className="font-mono font-bold text-white">${data.onPrem.toLocaleString()}</span>
          </div>

          <div className="pt-1.5 mt-1 border-t border-[#27272A] flex items-center justify-between font-semibold">
            <span className="text-gray-400">
              {diff >= 0 ? 'Net Capital Retained:' : 'Amortization Gap:'}
            </span>
            <span className={`font-mono font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {diff >= 0 ? `+$${diff.toLocaleString()}` : `-$${Math.abs(diff).toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#161618] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-gray-200 flex flex-col my-auto max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0E0E10] border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  CFO Financial Simulator: 36-Month CAPEX vs OPEX Crossover
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Recharts Visual Model
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Simulate your enterprise AI token workload ROI, payback threshold, and 36-month TCO.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioSynth.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-[#1A1A1C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Sliders & Inputs (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 bg-[#0E0E10] p-4 rounded-xl border border-[#27272A]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Adjust Enterprise Parameters
              </h3>
              <div className="flex items-center gap-2">
                {isSavedIndicator && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono animate-fade-in">
                    <CheckCircle2 className="w-3 h-3" />
                    Saved
                  </span>
                )}
                <button
                  onClick={handleResetDefaults}
                  title="Reset to default baseline parameters"
                  className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white bg-[#1A1A1D] hover:bg-[#26262B] px-2 py-0.5 rounded border border-[#333338] transition-colors"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Slider 1: Monthly Cloud AI Spend */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-300 font-medium">Monthly Cloud API Bill (OPEX)</span>
                <span className="font-bold text-rose-400 text-sm font-mono">
                  ${monthlyCloudSpend.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="3000"
                max="50000"
                step="1000"
                value={monthlyCloudSpend}
                onChange={(e) => setMonthlyCloudSpend(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                <span>$3k</span>
                <span>$15k (Avg Enterprise)</span>
                <span>$50k</span>
              </div>
            </div>

            {/* Slider 2: On-Prem Server CAPEX */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-300 font-medium">Server Hardware Investment (CAPEX)</span>
                <span className="font-bold text-white text-sm font-mono">
                  ${hardwareCapex.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="120000"
                step="2000"
                value={hardwareCapex}
                onChange={(e) => setHardwareCapex(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                <span>$15k (2x GPU)</span>
                <span>$48k (4x L40S 192GB)</span>
                <span>$120k (8x Clustered)</span>
              </div>
            </div>

            {/* Slider 3: Monthly Power & Datacenter Cooling */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-300 font-medium">Monthly Electricity & Datacenter</span>
                <span className="font-semibold text-amber-400 text-xs font-mono">
                  ${monthlyElectricity.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={monthlyElectricity}
                onChange={(e) => setMonthlyElectricity(Number(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Slider 4: Monthly MLOps Support */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-300 font-medium">MLOps Maintenance Allocation</span>
                <span className="font-semibold text-gray-300 text-xs font-mono">
                  ${monthlyMlOps.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="6000"
                step="250"
                value={monthlyMlOps}
                onChange={(e) => setMonthlyMlOps(Number(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-gray-400"
              />
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-[#27272A]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Standard Executive Profiles</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    setMonthlyCloudSpend(8000);
                    setHardwareCapex(28000);
                    setMonthlyElectricity(450);
                    setMonthlyMlOps(1200);
                  }}
                  className="px-2 py-1.5 bg-[#1A1A1C] hover:bg-[#27272A] border border-[#333335] text-[11px] rounded-lg text-gray-300 transition-colors"
                >
                  Mid-Tier ISP
                </button>
                <button
                  onClick={() => {
                    setMonthlyCloudSpend(15000);
                    setHardwareCapex(48000);
                    setMonthlyElectricity(650);
                    setMonthlyMlOps(2000);
                  }}
                  className="px-2 py-1.5 bg-[#1A1A1C] text-amber-400 border border-amber-500/40 text-[11px] rounded-lg font-semibold shadow-sm"
                >
                  Jorge Huerta (4x L40S)
                </button>
                <button
                  onClick={() => {
                    setMonthlyCloudSpend(35000);
                    setHardwareCapex(96000);
                    setMonthlyElectricity(1200);
                    setMonthlyMlOps(3500);
                  }}
                  className="px-2 py-1.5 bg-[#1A1A1C] hover:bg-[#27272A] border border-[#333335] text-[11px] rounded-lg text-gray-300 transition-colors"
                >
                  Telco Tier-1
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Financial Metrics & Recharts Visual Crossover (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            
            {/* Top 3 Metric Callout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0E0E10] border border-[#27272A] shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Crossover Point
                </span>
                <div className="text-2xl font-bold text-white font-mono">
                  {breakEvenMonths > 36 ? '> 36 Mo' : `${breakEvenMonths.toFixed(1)} Mo`}
                </div>
                <span className="text-[11px] text-gray-500">
                  100% CAPEX Amortized
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E0E10] border border-[#27272A] shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Year 1 Net Savings
                </span>
                <div className="text-2xl font-bold text-white font-mono">
                  ${Math.max(0, year1NetSavings).toLocaleString()}
                </div>
                <span className="text-[11px] text-gray-500">
                  Net Post-Hardware
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E0E10] border border-[#27272A] shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  36-Mo Net Cashflow Retained
                </span>
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                  ${Math.max(0, threeYearNetSavings).toLocaleString()}
                </div>
                <span className="text-[11px] text-gray-500">
                  Sovereign Asset Equity
                </span>
              </div>
            </div>

            {/* Recharts Financial Crossover Graph */}
            <div className="bg-[#0E0E10] p-4 rounded-xl border border-[#27272A] relative">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    36-Month CAPEX vs OPEX Cumulative TCO & Crossover
                  </span>
                  {breakEvenMonths <= 36 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-700/50">
                      Cross @ {breakEvenMonths.toFixed(1)} mo
                    </span>
                  )}
                </div>

                {/* Horizon Switcher */}
                <div className="flex items-center gap-1 bg-[#18181C] p-1 rounded-lg border border-[#2A2A2E]">
                  <button
                    onClick={() => setTimelineHorizon(12)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-all ${
                      timelineHorizon === 12
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    12 Mo
                  </button>
                  <button
                    onClick={() => setTimelineHorizon(36)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-all ${
                      timelineHorizon === 36
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    36 Mo (3-Yr TCO)
                  </button>
                </div>
              </div>

              {/* Recharts Area & Line Chart Component */}
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 15, left: 5, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="cloudOpexGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="onPremCapexGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#232328" vertical={false} />
                    
                    <XAxis
                      dataKey="monthLabel"
                      stroke="#666"
                      tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                      interval={timelineHorizon === 36 ? 5 : 1}
                      axisLine={{ stroke: '#333' }}
                      tickLine={{ stroke: '#333' }}
                    />
                    
                    <YAxis
                      stroke="#666"
                      tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      axisLine={{ stroke: '#333' }}
                      tickLine={{ stroke: '#333' }}
                      width={42}
                    />
                    
                    <Tooltip content={<CustomChartTooltip />} />

                    {/* Milestone Reference Line at Year 1 & Year 2 (if 36 mo) */}
                    {timelineHorizon === 36 && (
                      <>
                        <ReferenceLine
                          x="M12"
                          stroke="#3f3f46"
                          strokeDasharray="2 2"
                          label={{ value: 'Yr 1', position: 'insideTopLeft', fill: '#71717a', fontSize: 9, fontFamily: 'monospace' }}
                        />
                        <ReferenceLine
                          x="M24"
                          stroke="#3f3f46"
                          strokeDasharray="2 2"
                          label={{ value: 'Yr 2', position: 'insideTopLeft', fill: '#71717a', fontSize: 9, fontFamily: 'monospace' }}
                        />
                      </>
                    )}

                    {/* Crossover Line Marker */}
                    {breakEvenMonths <= timelineHorizon && (
                      <ReferenceLine
                        x={`M${Math.round(breakEvenMonths)}`}
                        stroke="#10b981"
                        strokeDasharray="3 3"
                        strokeWidth={1.5}
                        label={{
                          value: `Crossover: ${breakEvenMonths.toFixed(1)}m`,
                          position: 'top',
                          fill: '#34d399',
                          fontSize: 10,
                          fontWeight: 'bold',
                          fontFamily: 'monospace'
                        }}
                      />
                    )}

                    {/* Cumulative Cloud OPEX Area & Line */}
                    <Area
                      type="monotone"
                      dataKey="cloud"
                      name="Cloud API (OPEX)"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#cloudOpexGradient)"
                      activeDot={{ r: 5, fill: '#f43f5e', stroke: '#fff', strokeWidth: 1.5 }}
                    />

                    {/* Cumulative On-Premises CAPEX + OPEX Area & Line */}
                    <Area
                      type="monotone"
                      dataKey="onPrem"
                      name="On-Prem (4x L40S CAPEX+OPEX)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#onPremCapexGradient)"
                      activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 1.5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Legend & Explanation */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#1F1F24] text-[11px] text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>
                    Cloud API OPEX (Linear Cumulative Spend)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
                    On-Premises CAPEX ($48k) + Low OPEX
                  </span>
                </div>
                <span className="font-mono text-emerald-400 text-[10px]">
                  Crossover @ Month {breakEvenMonths.toFixed(1)} • Total 3-Yr Delta: +${Math.max(0, threeYearNetSavings).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Strategic Summary Box */}
            <div className="p-3 bg-[#0E0E10] rounded-lg border border-[#27272A] flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-gray-300">
                <span className="font-semibold text-white">Executive Takeaway: </span>
                At month <span className="text-emerald-400 font-bold">{breakEvenMonths.toFixed(1)}</span>, the cumulative cost lines cross. From month {Math.ceil(breakEvenMonths)} to 36, the business captures <span className="text-emerald-400 font-bold">${Math.max(0, threeYearNetSavings).toLocaleString()}</span> in net capital retained on the balance sheet rather than sending it to third-party cloud providers.
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#27272A] gap-3">
              <button
                onClick={() => {
                  audioSynth.playClickSound();
                  onClose();
                }}
                className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white bg-[#1A1A1C] hover:bg-[#27272A] border border-[#333335] rounded-full transition-colors"
              >
                Close Simulator
              </button>

              <button
                onClick={handleExportWithSimulation}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-black bg-white hover:bg-gray-200 rounded-full shadow-md transition-all"
              >
                <FileDown className="w-4 h-4 stroke-[2.5]" />
                {isExporting ? 'Generating...' : 'Export PDF with this Simulation'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

