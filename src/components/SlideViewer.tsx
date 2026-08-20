import React from 'react';
import { 
  Server, 
  Cpu, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Activity, 
  Clock, 
  DollarSign, 
  Radio, 
  Scale, 
  Mail, 
  ExternalLink, 
  Linkedin, 
  Github, 
  QrCode,
  MapPin,
  Bot,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  Flame,
  Globe2
} from 'lucide-react';
import { SlideData, Language } from '../types';
import { audioSynth } from '../services/audioSynth';
import { getLocalizedSlide, UI_TRANSLATIONS } from '../services/i18n';

interface SlideViewerProps {
  slide: SlideData;
  lang?: Language;
  onOpenCalculator?: () => void;
  onOpenPortalModal?: () => void;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slide,
  lang = 'es',
  onOpenCalculator,
  onOpenPortalModal
}) => {
  const currentLang = (lang || 'es') as Language;
  const localized = getLocalizedSlide(slide, currentLang);
  const t = UI_TRANSLATIONS[currentLang];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 lg:p-10 text-gray-200 select-none relative overflow-hidden bg-[#161618]">
      
      {/* Background Architectural Blueprint Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a1a_1px,transparent_1px),linear-gradient(to_bottom,#27272a1a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-zinc-700/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header of the Slide */}
      <div className="relative z-10 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-full bg-[#1A1A1C] text-amber-400 border border-amber-500/30 shadow-sm">
            {localized.badge}
          </span>
          <span className="text-xs font-mono text-gray-500">
            {slide.variantNumber} • {t.author_name}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
          {localized.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-normal max-w-4xl leading-relaxed">
          {localized.subtitle}
        </p>
      </div>

      {/* Main Slide Content Canvas */}
      <div className="relative z-10 my-auto py-3">
        {renderSlideBody(slide, currentLang, onOpenCalculator, onOpenPortalModal)}
      </div>

      {/* Footer Executive Takeaway */}
      <div className="relative z-10 mt-auto pt-3 border-t border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
            {t.key_takeaway}:
          </span>
          <span className="text-gray-300 font-medium leading-snug">
            {localized.takeaway}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] text-gray-500 font-mono">
          <span className="text-amber-500">Executive Briefing</span>
          <span>•</span>
          <span className="text-gray-400">{lang === 'es' ? 'Agosto 2026' : lang === 'pt' ? 'Agosto 2026' : 'August 2026'}</span>
        </div>
      </div>

    </div>
  );
};

function renderSlideBody(
  slide: SlideData,
  lang: Language,
  onOpenCalculator?: () => void,
  onOpenPortalModal?: () => void
) {
  switch (slide.type) {
    case 'cover':
      return <CoverSlide slide={slide} onOpenCalculator={onOpenCalculator} />;
    case 'problem_cloud_drain':
      return <ProblemCloudSlide slide={slide} />;
    case 'solution_roi':
      return <SolutionRoiSlide slide={slide} onOpenCalculator={onOpenCalculator} />;
    case 'hardware_architecture':
      return <HardwareArchitectureSlide slide={slide} />;
    case 'decision_matrix':
      return <DecisionMatrixSlide slide={slide} />;
    case 'telecom_cases_1':
      return <TelecomCases1Slide slide={slide} />;
    case 'telecom_cases_2':
      return <TelecomCases2Slide slide={slide} />;
    case 'mlops_strategy':
      return <MlOpsStrategySlide slide={slide} />;
    case 'hybrid_architecture':
      return <HybridArchitectureSlide slide={slide} />;
    case 'executive_profile':
      return <ExecutiveProfileSlide slide={slide} onOpenPortalModal={onOpenPortalModal} />;
    case 'cta_contact':
      return <CtaContactSlide slide={slide} onOpenPortalModal={onOpenPortalModal} />;
    default:
      return <DefaultDynamicSlide slide={slide} lang={lang} />;
  }
}

/* ------------------- SLIDE 1: COVER SLIDE ------------------- */
const CoverSlide: React.FC<{ slide: SlideData; onOpenCalculator?: () => void }> = ({ slide, onOpenCalculator }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* Left Blueprint Graphic (5 cols) */}
      <div className="lg:col-span-5 relative p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center">
        {/* Server Rack Blueprint SVG */}
        <div className="w-full max-w-[280px] h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 280 240" fill="none">
            {/* Server Rack Frame */}
            <rect x="20" y="10" width="100" height="220" rx="4" stroke="#06b6d4" strokeWidth="2" fill="#030712" />
            <line x1="20" y1="20" x2="120" y2="20" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="20" y1="220" x2="120" y2="220" stroke="#06b6d4" strokeWidth="1" />

            {/* 4x GPU Blades */}
            {[40, 75, 110, 145].map((y, i) => (
              <g key={i}>
                <rect x="26" y={y} width="88" height="28" rx="2" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <circle cx="36" cy={y + 14} r="3" fill="#10b981" className="animate-ping" />
                <circle cx="36" cy={y + 14} r="3" fill="#10b981" />
                <rect x="46" y={y + 8} width="40" height="4" rx="1" fill="#38bdf8" />
                <rect x="46" y={y + 16} width="28" height="4" rx="1" fill="#64748b" />
                <text x="92" y={y + 17} fill="#f59e0b" fontSize="8" fontWeight="bold">L40S</text>
              </g>
            ))}

            {/* Power & Cooling unit at bottom */}
            <rect x="26" y="180" width="88" height="32" rx="2" fill="#1e293b" stroke="#06b6d4" strokeWidth="1" />
            <circle cx="50" cy="196" r="8" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="90" cy="196" r="8" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
            <text x="70" y="200" textAnchor="middle" fill="#38bdf8" fontSize="7">N+1 Redundant</text>

            {/* Telemetry Charts on the right side */}
            <rect x="135" y="10" width="130" height="95" rx="4" stroke="#f59e0b" strokeWidth="1.5" fill="#030712" />
            <line x1="145" y1="90" x2="255" y2="90" stroke="#334155" strokeWidth="1" />
            <line x1="145" y1="20" x2="145" y2="90" stroke="#334155" strokeWidth="1" />
            {/* Downward Cloud OPEX drain vs Upward Asset Value */}
            <line x1="145" y1="85" x2="250" y2="25" stroke="#10b981" strokeWidth="2" />
            <line x1="145" y1="30" x2="250" y2="85" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx="198" cy="57" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />

            {/* Telemetry Bars */}
            <rect x="135" y="115" width="130" height="115" rx="4" stroke="#06b6d4" strokeWidth="1.5" fill="#030712" />
            <text x="145" y="132" fill="#38bdf8" fontSize="8" fontWeight="bold">TELEMETRY MATRIX</text>
            <rect x="145" y="140" width="110" height="6" rx="2" fill="#1e293b" />
            <rect x="145" y="140" width="85" height="6" rx="2" fill="#f59e0b" />
            <rect x="145" y="152" width="110" height="6" rx="2" fill="#1e293b" />
            <rect x="145" y="152" width="98" height="6" rx="2" fill="#06b6d4" />
            <rect x="145" y="164" width="110" height="6" rx="2" fill="#1e293b" />
            <rect x="145" y="164" width="70" height="6" rx="2" fill="#10b981" />
            
            {/* Status Indicator */}
            <text x="145" y="195" fill="#94a3b8" fontSize="8">FP8 Compute: 2,944 TFLOPS</text>
            <text x="145" y="210" fill="#10b981" fontSize="8" fontWeight="bold">● Sovereign Status: 100%</text>
          </svg>
        </div>

        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2 border-t border-slate-800 pt-2 font-mono">
          <span className="text-cyan-400">4x L40S Clustered</span>
          <span className="text-emerald-400">Break-Even: 3.4 Mo</span>
        </div>
      </div>

      {/* Right Content & Key Metrics (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            The Executive Financial Dilemma
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            Enterprise AI adoption in Telecom, Fiber Optics, and critical infrastructure has created an unmonitored capital leak. Monthly API token fees compound endlessly without creating tangible balance sheet assets.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-rose-950/80 text-rose-300 border border-rose-800">
              Cloud API: $180,000 / Year Drain
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              On-Prem CAPEX: $48,000 Total
            </span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {slide.metrics?.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                m.highlight
                  ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {m.label}
              </span>
              <div className={`text-xl font-black ${
                m.color === 'rose' ? 'text-rose-400' :
                m.color === 'emerald' ? 'text-emerald-400' : 'text-cyan-400'
              }`}>
                {m.value}
              </div>
              {m.subtext && (
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {m.subtext}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        {onOpenCalculator && (
          <div className="pt-1">
            <button
              onClick={() => {
                audioSynth.playClickSound();
                onOpenCalculator();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-950/50 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Interactive CFO ROI Simulator (Test Your Cloud Bill)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------- SLIDE 2: PROBLEM - CLOUD API DRAIN ------------------- */
const ProblemCloudSlide: React.FC<{ slide: SlideData }> = ({ slide }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* Exponential Cost Curve Graph (6 cols) */}
      <div className="lg:col-span-6 p-4 rounded-2xl bg-slate-950 border border-rose-900/50 relative shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              The Compounding Drain Curve
            </span>
          </div>
          <span className="text-[10px] text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
            &gt;$180,000 / Yr Drain
          </span>
        </div>

        {/* SVG Curve */}
        <div className="h-52 w-full">
          <svg className="w-full h-full" viewBox="0 0 400 180">
            {/* Grid */}
            {[30, 70, 110, 150].map((y, i) => (
              <line key={i} x1="30" y1={y} x2="380" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
            ))}

            {/* Enterprise Demand Line (Cyan) */}
            <path
              d="M 40 160 L 370 30"
              stroke="#38bdf8"
              strokeWidth="2.5"
              fill="none"
            />
            <text x="375" y="28" fill="#38bdf8" fontSize="9" fontWeight="bold">Enterprise Demand</text>

            {/* Cloud API Cost Area & Line (Orange/Amber) */}
            <path
              d="M 40 160 Q 200 130 260 90 T 370 50 L 370 160 Z"
              fill="url(#amberGradient)"
              opacity="0.3"
            />
            <path
              d="M 40 160 Q 200 130 260 90 T 370 50"
              stroke="#f59e0b"
              strokeWidth="3"
              fill="none"
            />
            <text x="375" y="54" fill="#f59e0b" fontSize="9" fontWeight="bold">Cloud API Cost</text>

            <defs>
              <linearGradient id="amberGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-200 mt-2 text-center font-semibold">
          Financial Drain: &gt;$180,000/YEAR PER ENTERPRISE Burning Capital on API Fees.
        </div>
      </div>

      {/* Right Column: Problem Breakdown (6 cols) */}
      <div className="lg:col-span-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Outflow</span>
            <span className="text-xl font-black text-rose-400">$15,000 / mo</span>
            <span className="text-[10px] text-slate-500 block">Baseline recurring fee</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">3-Year Cloud Sunk</span>
            <span className="text-xl font-black text-amber-400">$540,000</span>
            <span className="text-[10px] text-slate-500 block">$0 balance sheet equity</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Critical Strategic Vulnerabilities of Cloud APIs
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Linear Cost Explosion:</strong> Every additional user, prompt, or telemetry scan directly raises monthly OPEX without economy of scale.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Data Sovereignty & Compliance:</strong> Telecom logs and subscriber data leave private network boundaries to third-party endpoints.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>High & Unpredictable Latency:</strong> 350ms-1200ms cloud roundtrip breaks real-time fiber optimization and automated switching.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

/* ------------------- SLIDE 3: SOLUTION - ON-PREM ROI ------------------- */
const SolutionRoiSlide: React.FC<{ slide: SlideData; onOpenCalculator?: () => void }> = ({ slide, onOpenCalculator }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* Left Comparison Pillars (5 cols) */}
      <div className="lg:col-span-5 grid grid-cols-2 gap-3">
        {/* CAPEX Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/80 to-slate-950 border-2 border-emerald-500/70 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">CAPEX</span>
              <Server className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-300 mb-1">$48k</div>
            <span className="text-xs text-slate-300 font-medium block mb-3">(Asset Approach)</span>
            
            <ul className="text-[11px] text-slate-300 space-y-1.5 border-t border-emerald-900/50 pt-2">
              <li>• Upfront Investment</li>
              <li>• Owns Infrastructure</li>
              <li>• Depreciation Benefits</li>
              <li>• Lower Long-Term Cost</li>
            </ul>
          </div>

          <div className="mt-3 pt-2 border-t border-emerald-900/50 text-[10px] text-emerald-400 font-bold">
            Monthly: ~$14k (over 3.4 mo)
          </div>
        </div>

        {/* OPEX Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/80 to-slate-950 border border-blue-600/50 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">OPEX</span>
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-blue-300 mb-1">$180k</div>
            <span className="text-xs text-slate-300 font-medium block mb-3">(Cloud Service)</span>
            
            <ul className="text-[11px] text-slate-300 space-y-1.5 border-t border-blue-900/50 pt-2">
              <li>• Monthly/Yearly Fees</li>
              <li>• Scalability with Cost</li>
              <li>• Immediate Access</li>
              <li>• Higher Cumulative Exp.</li>
            </ul>
          </div>

          <div className="mt-3 pt-2 border-t border-blue-900/50 text-[10px] text-rose-400 font-bold">
            Monthly Rate: ~$15k / mo
          </div>
        </div>
      </div>

      {/* Right Break-Even Visual Graph & Strategic Highlights (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/50 relative shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Break-Even Intersection: 3.4 Months
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
              100% Capital Payback
            </span>
          </div>

          {/* SVG Chart */}
          <div className="h-44 w-full">
            <svg className="w-full h-full" viewBox="0 0 450 160">
              {/* Horizontal Line: $48k CAPEX On-Premise */}
              <line x1="40" y1="120" x2="420" y2="120" stroke="#10b981" strokeWidth="3" />
              <text x="320" y="112" fill="#10b981" fontSize="9" fontWeight="bold">CAPEX (On-Premise) $48k</text>

              {/* Diagonal Line: Cloud Cumulative OPEX */}
              <line x1="40" y1="150" x2="420" y2="20" stroke="#f59e0b" strokeWidth="3" />
              <text x="380" y="32" fill="#f59e0b" fontSize="9" fontWeight="bold">Cloud OPEX</text>

              {/* Intersection circle at Month 3.4 */}
              <circle cx="150" cy="120" r="7" fill="#00e5ff" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
              
              {/* Callout box */}
              <rect x="110" y="55" width="115" height="40" rx="4" fill="#030712" stroke="#00e5ff" strokeWidth="1.5" />
              <text x="167" y="72" textAnchor="middle" fill="#00e5ff" fontSize="11" fontWeight="black">3.4-Month</text>
              <text x="167" y="86" textAnchor="middle" fill="#94a3b8" fontSize="8">Break-Even Point</text>
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 px-6 font-mono">
            <span>Month 0</span>
            <span className="text-cyan-300 font-bold">Month 3.4 (Break-Even)</span>
            <span>Month 6</span>
            <span>Month 12</span>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Rapid ROI & Predictable Budgeting</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Full Data Sovereignty & Security</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Optimized Performance for AI Workloads</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Long-Term Corporate Asset Value</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------- SLIDE 4: HARDWARE ARCHITECTURE ------------------- */
const HardwareArchitectureSlide: React.FC<{ slide: SlideData }> = ({ slide }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* 3D Isometric Server Isometric Blueprint (7 cols) */}
      <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-950 border border-cyan-500/50 relative shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            High-Density Server Blueprint (2U Chassis)
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">4x NVIDIA L40S (192GB VRAM)</span>
        </div>

        {/* Isometric SVG Render */}
        <div className="h-60 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 500 240">
            {/* Server Chassis 3D Box */}
            <polygon points="120,60 380,40 450,110 190,140" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            <polygon points="120,60 190,140 190,190 120,110" fill="#030712" stroke="#06b6d4" strokeWidth="1.5" />
            <polygon points="190,140 450,110 450,160 190,190" fill="#090d16" stroke="#06b6d4" strokeWidth="1.5" />

            {/* Front Drive Bays & Fiber ports */}
            <line x1="125" y1="80" x2="185" y2="155" stroke="#f59e0b" strokeWidth="2" />
            <line x1="125" y1="95" x2="185" y2="170" stroke="#f59e0b" strokeWidth="2" />
            <rect x="140" y="125" width="30" height="15" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="1" />

            {/* 4x GPU Accelerators inside chassis */}
            {[0, 1, 2, 3].map(i => {
              const xOff = 180 + i * 55;
              const yOff = 75 - i * 5;
              return (
                <g key={i}>
                  <polygon
                    points={`${xOff},${yOff} ${xOff + 40},${yOff - 4} ${xOff + 55},${yOff + 25} ${xOff + 15},${yOff + 30}`}
                    fill="#1e293b"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                  <circle cx={xOff + 28} cy={yOff + 12} r="6" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                </g>
              );
            })}

            {/* Power & Cooling Fans at rear */}
            <circle cx="390" cy="65" r="10" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="415" cy="78" r="10" stroke="#38bdf8" strokeWidth="1" />

            {/* Callout Labels */}
            <line x1="260" y1="70" x2="230" y2="25" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x="160" y="10" width="140" height="22" rx="4" fill="#030712" stroke="#f59e0b" strokeWidth="1" />
            <text x="230" y="24" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold">4x NVIDIA L40S GPUs</text>

            <line x1="140" y1="130" x2="70" y2="130" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x="10" y="118" width="115" height="22" rx="4" fill="#030712" stroke="#06b6d4" strokeWidth="1" />
            <text x="67" y="132" textAnchor="middle" fill="#06b6d4" fontSize="8" fontWeight="bold">100GbE Fiber Optics</text>

            <line x1="410" y1="70" x2="440" y2="40" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x="375" y="25" width="115" height="22" rx="4" fill="#030712" stroke="#10b981" strokeWidth="1" />
            <text x="432" y="39" textAnchor="middle" fill="#10b981" fontSize="8" fontWeight="bold">N+1 Power & Cooling</text>
          </svg>
        </div>

        {/* Optical Distribution schematic */}
        <div className="flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800 pt-2">
          <span>Dual 2000W Platinum Titanium PSUs</span>
          <span className="text-emerald-400 font-mono">192GB GDDR6 with ECC</span>
        </div>
      </div>

      {/* Right Column: Hardware Metrics (5 cols) */}
      <div className="lg:col-span-5 space-y-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase mb-1">
            <Cpu className="w-4 h-4" />
            4x NVIDIA L40S 48GB Cluster
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Optimized for enterprise LLMs (Llama 3.3 70B, DeepSeek, Mistral) and telecom predictive neural nets with FP8 transformer acceleration.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-1">
            <Zap className="w-4 h-4" />
            100GbE Optical Interconnect
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Sub-millisecond data transport directly linked to optical fiber aggregation switches, eliminating bandwidth bottlenecks.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            Zero Data Egress Charges
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Continuous local training, embedding generation, and fine-tuning with 100% predictable fixed power costs.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------- SLIDE 5: FINANCIAL DECISION MATRIX ------------------- */
const DecisionMatrixSlide: React.FC<{ slide: SlideData }> = ({ slide }) => {
  const matrixData = [
    { metric: 'Costo por 1M Tokens', cloud: '$5.00 - $15.00', onprem: '$0.10 - $0.50', impact: 'Ahorro masivo en alto volumen (96-98%)' },
    { metric: 'Punto de Equilibrio (ROI)', cloud: 'N/A (Gasto perpetuo)', onprem: '3.4 - 5.5 Meses', impact: 'Retorno de capital acelerado' },
    { metric: 'Latencia de Inferencia', cloud: 'Variable (350-1200ms)', onprem: '< 50ms Local', impact: 'Crítico para apps de telecom en tiempo real' },
    { metric: 'Soberanía de Datos', cloud: 'Terceros / Compartida', onprem: '100% On-Premise', impact: 'Esencial para compliance y seguridad regulatoria' },
    { metric: 'Tratamiento Contable', cloud: 'Gasto Operativo (OPEX)', onprem: 'Activo Fijo (CAPEX)', impact: 'Depreciación fiscal 30-40% anual' },
    { metric: 'Rendimiento vLLM', cloud: 'Rate-Limits de API', onprem: 'Sin límites de cuota', impact: '4.2x mayor rendimiento en batching continuo' }
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-cyan-800/60 shadow-xl bg-slate-950">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-cyan-800/80 text-cyan-300 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Métrica Financiera / Operativa</th>
              <th className="py-3 px-4 text-rose-400">Cloud API (OPEX Puro)</th>
              <th className="py-3 px-4 text-emerald-400">On-Premise (CAPEX + OPEX)</th>
              <th className="py-3 px-4 text-cyan-300">Impacto Estratégico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {matrixData.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? 'bg-slate-950/60' : 'bg-slate-900/40 hover:bg-slate-900/80 transition-colors'}
              >
                <td className="py-3 px-4 font-semibold text-slate-100">{row.metric}</td>
                <td className="py-3 px-4 text-rose-400 font-medium">{row.cloud}</td>
                <td className="py-3 px-4 text-emerald-300 font-bold bg-emerald-950/20">{row.onprem}</td>
                <td className="py-3 px-4 text-slate-300">{row.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-300">
          <strong className="text-amber-400">Conclusión para el CFO: </strong>
          La combinación de bajo costo marginal por token ($0.10) y propiedad del activo convierte el presupuesto de IA en valor patrimonial duradero.
        </span>
      </div>
    </div>
  );
};

/* ------------------- SLIDE 6: TELECOM USE CASES (PART 1) ------------------- */
const TelecomCases1Slide: React.FC<{ slide: SlideData }> = ({ slide }) => {
  const cases = [
    {
      number: '1',
      title: 'Predictive Network Maintenance',
      summary: 'Proactively identify and address equipment failures before they occur. Minimizes downtime by 42%.',
      capexImpact: 'High Initial Hardware / Low Marginal OPEX',
      badge: 'Telecom Core'
    },
    {
      number: '2',
      title: 'Automated Customer Churn Prediction in ISPs',
      summary: 'Analyze subscriber bandwidth, latency tolerance, and billing history to prevent churn and increase retention.',
      capexImpact: 'Lower Long-Term OPEX for High-Volume Data',
      badge: 'ISP Revenue'
    },
    {
      number: '3',
      title: 'Real-time Fiber Signal Optimization',
      summary: 'Dynamic adjustments for peak optical signal quality and dispersion correction with sub-10ms latency.',
      capexImpact: 'Max Efficiency with Minimal Roundtrip Latency',
      badge: 'Physical Layer'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cases.map((c, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-800/60 shadow-lg flex flex-col justify-between space-y-3 hover:border-cyan-500 transition-all"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/50">
                {c.number}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300">
                {c.badge}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white leading-snug">
              {c.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {c.summary}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-300 font-medium">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Financial Impact:</span>
            {c.capexImpact}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ------------------- SLIDE 7: TELECOM USE CASES (PART 2) ------------------- */
const TelecomCases2Slide: React.FC<{ slide: SlideData }> = ({ slide }) => {
  const cases = [
    {
      title: '4. Dynamic CAPEX Allocation Models',
      desc: 'AI-optimized investment vs traditional models (Q1-Q4).',
      stat: '-22% Upfront CAPEX',
      color: 'emerald'
    },
    {
      title: '5. Automated GIS Mapping for Fiber Rollout',
      desc: 'Autonomous fiber path routing over 5,400+ km network routes.',
      stat: '90% Faster Velocity',
      color: 'cyan'
    },
    {
      title: '6. AI-Driven Billing Fraud Detection',
      desc: 'Real-time billing anomaly detection preventing leakage.',
      stat: 'Blocked Loss: $1.2M',
      color: 'amber'
    },
    {
      title: '7. 24/7 Technical Support LLMs',
      desc: 'First contact resolution with automated agent hand-off.',
      stat: '95% FCR (-30% Support OPEX)',
      color: 'emerald'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cases.map((c, i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-amber-500/50 transition-all"
        >
          <div>
            <h4 className="text-xs font-bold text-slate-100 mb-1.5 leading-snug">
              {c.title}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {c.desc}
            </p>
          </div>

          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
            <span className={`text-xs font-black ${
              c.color === 'emerald' ? 'text-emerald-400' :
              c.color === 'cyan' ? 'text-cyan-400' : 'text-amber-400'
            }`}>
              {c.stat}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ------------------- SLIDE 8: MLOPS STRATEGY ------------------- */
const MlOpsStrategySlide: React.FC<{ slide: SlideData }> = ({ slide }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* Visual Balance Scale: Hardware is Cheap vs Talent is Expensive (5 cols) */}
      <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-cyan-800/60 shadow-xl flex flex-col items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3">
          The Executive Talent Balance
        </span>

        {/* Balance Scale SVG */}
        <div className="w-full h-40 relative">
          <svg className="w-full h-full" viewBox="0 0 300 160">
            {/* Fulcrum base */}
            <polygon points="150,90 140,140 160,140" fill="#06b6d4" />
            <circle cx="150" cy="90" r="4" fill="#ffffff" />
            <line x1="50" y1="140" x2="250" y2="140" stroke="#334155" strokeWidth="3" />

            {/* Beam tilted: Talent is heavier (expensive) */}
            <line x1="60" y1="75" x2="240" y2="105" stroke="#f59e0b" strokeWidth="4" />

            {/* Left Pan (Hardware is Cheap) */}
            <line x1="60" y1="75" x2="60" y2="100" stroke="#64748b" strokeWidth="1.5" />
            <rect x="30" y="100" width="60" height="24" rx="3" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            <text x="60" y="112" textAnchor="middle" fill="#06b6d4" fontSize="7" fontWeight="bold">Hardware</text>
            <text x="60" y="120" textAnchor="middle" fill="#94a3b8" fontSize="6">is Cheap ($48k)</text>

            {/* Right Pan (Talent is Expensive) */}
            <line x1="240" y1="105" x2="240" y2="125" stroke="#64748b" strokeWidth="1.5" />
            <rect x="210" y="125" width="60" height="24" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
            <text x="240" y="137" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="bold">Talent</text>
            <text x="240" y="145" textAnchor="middle" fill="#f59e0b" fontSize="6">is Expensive</text>
          </svg>
        </div>

        <p className="text-[11px] text-slate-300 text-center mt-2 leading-relaxed">
          Maximizing engineer productivity through modern open-source stacks multiplies ROI without hiring additional overhead.
        </p>
      </div>

      {/* Right Column: 3 Levers (7 cols) */}
      <div className="lg:col-span-7 space-y-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4" />
            vLLM (Virtual Large Language Models)
          </h4>
          <p className="text-xs text-slate-300 mb-1.5">
            Continuous PagedAttention batching reduces compute idle time to &lt;8% and accelerates throughput by 4.2x.
          </p>
          <span className="text-[10px] text-emerald-400 font-mono">Optimizes Server Utilization</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4" />
            Quantization (INT4 & FP8)
          </h4>
          <p className="text-xs text-slate-300 mb-1.5">
            Shrinks model memory footprint by 70%, allowing 70-Billion parameter models to execute on a single node with zero loss in fidelity.
          </p>
          <span className="text-[10px] text-cyan-400 font-mono">Faster Inference on Edge</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4" />
            Dynamic Model Routing
          </h4>
          <p className="text-xs text-slate-300 mb-1.5">
            Intelligently triages 80% of lightweight tasks to instant 8B models and routes only complex queries to deep reasoning clusters.
          </p>
          <span className="text-[10px] text-amber-300 font-mono">Cost-Effective Scaling</span>
        </div>
      </div>
    </div>
  );
};

/* ------------------- SLIDE 9: HYBRID ARCHITECTURE ------------------- */
const HybridArchitectureSlide: React.FC<{ slide: SlideData }> = ({ slide }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* On-Prem Base Load Card (90%) */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-cyan-950/70 to-slate-950 border-2 border-cyan-500/70 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              On-Premises (90% Base Load)
            </span>
            <span className="text-xs font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
              CAPEX
            </span>
          </div>

          <div className="text-2xl font-black text-white mb-1">High Fixed Costs, Long-Term Value</div>
          <p className="text-xs text-slate-300 mb-3">
            Absorbs predictable, daily telecom workloads with flat electrical costs and zero per-token metering surprises.
          </p>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-cyan-900/60 text-xs text-cyan-300 font-semibold">
            Token Economics: Fixed Flat Allocation • Predictable Margin
          </div>
        </div>

        {/* Cloud Peak Load Card (10%) */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/70 to-slate-950 border border-amber-500/50 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Cloud (10% Peak Burst Load)
            </span>
            <span className="text-xs font-black text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
              OPEX
            </span>
          </div>

          <div className="text-2xl font-black text-white mb-1">Variable Costs, Elastic Scaling</div>
          <p className="text-xs text-slate-300 mb-3">
            Acts as an on-demand relief valve during sudden unexpected network surges without overprovisioning local hardware.
          </p>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-900/60 text-xs text-amber-300 font-semibold">
            Token Economics: On-Demand Usage • Controlled Margin Flexibility
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-300">
          <strong className="text-emerald-400">The CFO Golden Ratio: </strong>
          90% On-Prem + 10% Cloud delivers an average <strong>78.4% reduction in TCO</strong> while ensuring 99.999% availability.
        </span>
      </div>
    </div>
  );
};

/* ------------------- SLIDE 10: PROFESSIONAL PROFILE ------------------- */
const ExecutiveProfileSlide: React.FC<{ slide: SlideData; onOpenPortalModal?: () => void }> = ({ slide, onOpenPortalModal }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* Profile Photo & Badges (4 cols) */}
      <div className="lg:col-span-4 flex flex-col items-center p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-xl text-center space-y-3">
        {/* Professional Portrait Framing with High Fidelity Circular Mask */}
        <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center relative">
            {/* SVG Rendered Professional Executive Avatar with suit & tie matching Foto-Jorge_Huerta */}
            <svg className="w-full h-full" viewBox="0 0 140 140">
              <rect width="140" height="140" fill="#0f172a" />
              {/* Background gradient subtle */}
              <circle cx="70" cy="70" r="68" fill="#1e293b" />
              {/* Head & Skin */}
              <circle cx="70" cy="52" r="28" fill="#d49a6a" />
              {/* Hair */}
              <path d="M 42 46 C 42 22 98 22 98 46 C 98 32 42 32 42 46 Z" fill="#1c1917" />
              {/* Suit Jacket */}
              <path d="M 20 140 L 45 92 L 95 92 L 120 140 Z" fill="#090d16" />
              {/* Shirt */}
              <polygon points="58,92 82,92 70,125" fill="#f8fafc" />
              {/* Striped Tie */}
              <polygon points="66,92 74,92 77,135 70,140 63,135" fill="#881337" />
              <line x1="66" y1="102" x2="74" y2="100" stroke="#ffffff" strokeWidth="1" />
              <line x1="66" y1="115" x2="74" y2="113" stroke="#ffffff" strokeWidth="1" />
              <line x1="66" y1="128" x2="74" y2="126" stroke="#ffffff" strokeWidth="1" />
            </svg>
          </div>
          <span className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
          </span>
        </div>

        <div>
          <h3 className="text-lg font-black text-white">Ing. Jorge Huerta</h3>
          <p className="text-xs text-amber-300 font-medium">
            Telecom Executive & AI Infrastructure Strategist
          </p>
          <p className="text-[11px] text-slate-400">15+ Years Experience (CAPEX vs OPEX)</p>
        </div>

        {/* Quick Contact Badges */}
        <div className="w-full space-y-1.5 pt-2 border-t border-slate-800">
          <a
            href="mailto:kuboxhubia@gmail.com"
            className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center justify-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>kuboxhubia@gmail.com</span>
          </a>

          <button
            onClick={() => {
              audioSynth.playClickSound();
              if (onOpenPortalModal) onOpenPortalModal();
            }}
            className="w-full py-1.5 px-3 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-xs text-blue-200 flex items-center justify-center gap-1.5 font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Visit Kboxhubia Hub</span>
          </button>
        </div>
      </div>

      {/* Right Column: Bio & Core Expertise (8 cols) */}
      <div className="lg:col-span-8 space-y-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Executive Summary
          </h4>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Telecom Executive with 15+ years of experience in strategic financial planning, optical fiber infrastructure deployment, and high-density AI cluster optimization. Proven track record arbitrating multi-million dollar CAPEX vs OPEX budgets for Tier-1 operators, regional ISPs, and enterprise datacenters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block">Core Competencies</span>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• Telecom & Optical Long-Haul Strategy</li>
              <li>• High-Density GPU Rack Engineering</li>
              <li>• Financial TCO & ROI Modeling</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Specialized Value</span>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• CAPEX vs OPEX Arbitrage</li>
              <li>• vLLM & Quantization Implementation</li>
              <li>• Enterprise Data Sovereignty</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------- SLIDE 11: CTA & CONTACT ------------------- */
const CtaContactSlide: React.FC<{ slide: SlideData; onOpenPortalModal?: () => void }> = ({ slide, onOpenPortalModal }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center text-center lg:text-left">
      {/* Left Contact & Action Details (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="space-y-2">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-950 text-amber-300 border border-amber-700">
            Transform Your AI Infrastructure Today
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Are You Ready to Stop Burning Capital?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Book a 48-hour Financial Architecture Diagnostic for your organization. We will audit your current cloud token drain, design your on-premise GPU cluster topology, and deliver a board-ready break-even roadmap.
          </p>
        </div>

        {/* Direct Email Display */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-950 to-cyan-950/70 border border-amber-500/60 shadow-xl">
          <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider block mb-1">
            Direct Executive Contact
          </span>
          <div className="text-lg sm:text-2xl font-black text-white select-all">
            kuboxhubia@gmail.com
          </div>
        </div>

        {/* Web Hub Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              audioSynth.playClickSound();
              if (onOpenPortalModal) onOpenPortalModal();
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-950/50 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Explore Kboxhubia Hub & Embed Widgets</span>
          </button>
        </div>
      </div>

      {/* Right QR Codes & Channels (5 cols) */}
      <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-cyan-800/60 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block text-center">
          Instant Mobile Access
        </span>

        <div className="grid grid-cols-2 gap-4">
          {/* QR Code 1: LinkedIn */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center space-y-2">
            <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* QR Visual representation */}
                <rect x="0" y="0" width="30" height="30" fill="#000" />
                <rect x="5" y="5" width="20" height="20" fill="#fff" />
                <rect x="10" y="10" width="10" height="10" fill="#000" />

                <rect x="70" y="0" width="30" height="30" fill="#000" />
                <rect x="75" y="5" width="20" height="20" fill="#fff" />
                <rect x="80" y="10" width="10" height="10" fill="#000" />

                <rect x="0" y="70" width="30" height="30" fill="#000" />
                <rect x="5" y="75" width="20" height="20" fill="#fff" />
                <rect x="10" y="80" width="10" height="10" fill="#000" />

                {/* QR Matrix dots */}
                <rect x="40" y="10" width="15" height="10" fill="#0077b5" />
                <rect x="40" y="30" width="20" height="15" fill="#000" />
                <rect x="70" y="40" width="20" height="20" fill="#000" />
                <rect x="35" y="65" width="25" height="25" fill="#0077b5" />
                <rect x="70" y="75" width="15" height="15" fill="#000" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-200">LinkedIn Profile</span>
          </div>

          {/* QR Code 2: Web Portfolio */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center space-y-2">
            <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* QR Visual representation */}
                <rect x="0" y="0" width="30" height="30" fill="#000" />
                <rect x="5" y="5" width="20" height="20" fill="#fff" />
                <rect x="10" y="10" width="10" height="10" fill="#000" />

                <rect x="70" y="0" width="30" height="30" fill="#000" />
                <rect x="75" y="5" width="20" height="20" fill="#fff" />
                <rect x="80" y="10" width="10" height="10" fill="#000" />

                <rect x="0" y="70" width="30" height="30" fill="#000" />
                <rect x="5" y="75" width="20" height="20" fill="#fff" />
                <rect x="10" y="80" width="10" height="10" fill="#000" />

                {/* QR Matrix dots */}
                <rect x="35" y="15" width="25" height="10" fill="#06b6d4" />
                <rect x="45" y="35" width="15" height="20" fill="#000" />
                <rect x="70" y="45" width="15" height="15" fill="#06b6d4" />
                <rect x="40" y="70" width="20" height="20" fill="#000" />
                <rect x="75" y="70" width="20" height="15" fill="#06b6d4" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-200">Kboxhubia Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Dynamic / AI Generated Slide Component */
const DefaultDynamicSlide: React.FC<{ slide: SlideData; lang: Language }> = ({ slide, lang }) => {
  const localized = getLocalizedSlide(slide, lang);

  return (
    <div className="space-y-6">
      {/* 3 Metrics Cards */}
      {localized.metrics && localized.metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {localized.metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border backdrop-blur-sm ${
                metric.highlight
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
                  : 'bg-[#18181B]/80 border-[#27272A] text-slate-200'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
              <div className={`text-2xl font-bold font-mono ${
                metric.color === 'emerald' ? 'text-emerald-400' :
                metric.color === 'cyan' ? 'text-cyan-400' :
                metric.color === 'rose' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bullets List & Insights */}
      <div className="p-6 rounded-2xl bg-[#111114] border border-[#27272A] space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {lang === 'es' ? 'Pilares Clave & Estrategia' : lang === 'pt' ? 'Pilares Chave & Estratégia' : 'Key Pillars & Strategy'}
        </h4>
        <div className="space-y-2.5">
          {localized.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

