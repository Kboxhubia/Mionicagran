import React, { useState } from 'react';
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
  Sliders
} from 'lucide-react';
import { exportExecutivePdfReport } from '../services/pdfExporter';
import { audioSynth } from '../services/audioSynth';

interface InteractiveRoiCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveRoiCalculator: React.FC<InteractiveRoiCalculatorProps> = ({
  isOpen,
  onClose
}) => {
  // Configurable CFO Parameters
  const [monthlyCloudSpend, setMonthlyCloudSpend] = useState<number>(15000); // $15,000/mo ($180k/yr)
  const [hardwareCapex, setHardwareCapex] = useState<number>(48000); // $48,000 (4x L40S)
  const [monthlyElectricity, setMonthlyElectricity] = useState<number>(650); // Power & Datacenter
  const [monthlyMlOps, setMonthlyMlOps] = useState<number>(2000); // MLOps amortized
  const [isExporting, setIsExporting] = useState<boolean>(false);

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

  // Generate chart data points for 12 months
  const months = Array.from({ length: 13 }, (_, i) => i);
  const chartPoints = months.map(m => {
    const cloudCum = m * monthlyCloudSpend;
    const onPremCum = hardwareCapex + (m * monthlyOnPremOpex);
    return { month: m, cloud: cloudCum, onPrem: onPremCum };
  });

  const maxVal = Math.max(
    chartPoints[12].cloud,
    chartPoints[12].onPrem,
    180000
  );

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#161618] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-gray-200 flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0E0E10] border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#1A1A1C] border border-[#333335] text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  CFO Financial Simulator: Dynamic CAPEX vs OPEX Break-Even
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#1A1A1C] text-emerald-400 border border-emerald-800/40">
                  Live Model
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
          <div className="lg:col-span-5 space-y-5 bg-[#0E0E10] p-4 rounded-xl border border-[#27272A]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Adjust Enterprise Parameters
            </h3>

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

          {/* Right Column: Dynamic Financial Metrics & Interactive SVG Curve (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            
            {/* Top 3 Metric Callout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0E0E10] border border-[#27272A] shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Break-Even
                </span>
                <div className="text-2xl font-bold text-white">
                  {breakEvenMonths > 36 ? '> 36 Mo' : `${breakEvenMonths.toFixed(1)} Mo`}
                </div>
                <span className="text-[11px] text-gray-500">
                  100% CAPEX Recovered
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
                  3-Year TCO Retained
                </span>
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                  ${Math.max(0, threeYearNetSavings).toLocaleString()}
                </div>
                <span className="text-[11px] text-gray-500">
                  Balance Sheet Capital
                </span>
              </div>
            </div>

            {/* Interactive SVG Cumulative Cost Curve */}
            <div className="bg-[#0E0E10] p-4 rounded-xl border border-[#27272A] relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">
                  12-Month Cumulative Cost Curve (CAPEX vs OPEX)
                </span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-rose-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                    Cloud API
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    On-Prem (4x L40S)
                  </span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="h-44 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 40, 80, 120, 160].map((y, i) => (
                    <line
                      key={i}
                      x1="40"
                      y1={y}
                      x2="490"
                      y2={y}
                      stroke="#27272a"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  ))}

                  {/* Cloud API Line (Linear climb) */}
                  <polyline
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    points={chartPoints
                      .map(p => {
                        const x = 40 + (p.month / 12) * 440;
                        const y = 150 - (p.cloud / maxVal) * 140;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* On-Prem Line (Starts high at CAPEX, rises very gently) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    points={chartPoints
                      .map(p => {
                        const x = 40 + (p.month / 12) * 440;
                        const y = 150 - (p.onPrem / maxVal) * 140;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Break-Even Intersection Marker */}
                  {breakEvenMonths <= 12 && (
                    <g>
                      <circle
                        cx={40 + (breakEvenMonths / 12) * 440}
                        cy={150 - ((breakEvenMonths * monthlyCloudSpend) / maxVal) * 140}
                        r="5"
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                      <text
                        x={Math.min(380, 40 + (breakEvenMonths / 12) * 440 + 8)}
                        y={Math.max(20, 150 - ((breakEvenMonths * monthlyCloudSpend) / maxVal) * 140 - 8)}
                        fill="#10b981"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        Break-Even ({breakEvenMonths.toFixed(1)} Mo)
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Chart X-Axis Labels */}
              <div className="flex justify-between text-[10px] text-gray-500 px-8 pt-1 font-mono">
                <span>Month 0</span>
                <span>Month 3</span>
                <span>Month 6</span>
                <span>Month 9</span>
                <span>Month 12</span>
              </div>
            </div>

            {/* Strategic Summary Box */}
            <div className="p-3 bg-[#0E0E10] rounded-lg border border-[#27272A] flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-gray-300">
                <span className="font-semibold text-white">Executive Takeaway: </span>
                Switching to dedicated hardware stops <span className="text-rose-400 font-bold">${monthlyCloudSpend.toLocaleString()}/mo</span> of unrecoverable SaaS drain. By Month <span className="text-emerald-400 font-bold">{breakEvenMonths.toFixed(1)}</span>, all capital is repaid and you own a high-performance $48k physical AI cluster.
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
