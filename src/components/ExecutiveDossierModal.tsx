import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Server,
  DollarSign
} from 'lucide-react';
import { exportExecutivePdfReport } from '../services/pdfExporter';
import { audioSynth } from '../services/audioSynth';

interface ExecutiveDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveDossierModal: React.FC<ExecutiveDossierModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    audioSynth.playClickSound();
    setIsExporting(true);
    try {
      await exportExecutivePdfReport();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#161618] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-gray-200 flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0E0E10] border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#1A1A1C] text-amber-400 border border-[#333335]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Executive Dossier & Boardroom Report Preview
              </h2>
              <p className="text-xs text-gray-400">
                Optimized PDF Document for CEOs, CFOs, and Investment Committees
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

        {/* Body Preview */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Executive Overview Card */}
          <div className="p-5 rounded-xl bg-[#0E0E10] border border-[#27272A] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                  Document ID: EXP-2026-JH-01
                </span>
                <h3 className="text-base font-bold text-white">
                  The $180,000 USD Error: Why Your AI Strategy is Burning Capital
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#1A1A1C] text-emerald-400 border border-emerald-800/40 text-xs font-bold">
                Board Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-[#161618] border border-[#27272A]">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">Cloud SaaS Drain</span>
                <span className="text-xl font-bold text-rose-300 font-mono">&gt;$180,000 / yr</span>
                <span className="text-[10px] text-gray-500 block">Pure linear OPEX</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#161618] border border-[#27272A]">
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider block">4x L40S Server Cluster</span>
                <span className="text-xl font-bold text-white font-mono">$48,000 CAPEX</span>
                <span className="text-[10px] text-gray-500 block">192GB VRAM asset</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#161618] border border-[#27272A]">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Full Capital Payback</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">3.4 Months</span>
                <span className="text-[10px] text-gray-500 block">100% Break-Even</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
              <p>
                <strong className="text-white">Summary of Findings: </strong>
                Cloud API token consumption models represent an unsustainable financial liability for enterprises with continuous telemetry or high-volume workflows. Transitioning 90% of base load to dedicated on-premise hardware recovers all upfront capital in under 3.5 months.
              </p>
              <p>
                <strong className="text-white">Deliverable Inclusions: </strong>
                2-Page Executive Dossier including full financial decision matrix, telecom fiber use cases, MLOps acceleration benchmarks, and contact info for Ing. Jorge Huerta.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-[#27272A]">
            <span className="text-xs text-gray-400 font-mono">
              Generated in High-Resolution Vector PDF Format
            </span>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-gray-200 text-black font-bold text-sm shadow-md transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isExporting ? 'Compiling Dossier...' : 'Download Executive PDF Now'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
