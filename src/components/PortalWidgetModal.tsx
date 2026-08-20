import React, { useState } from 'react';
import { 
  Globe, 
  X, 
  ExternalLink, 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  Layers,
  Share2,
  Linkedin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioSynth } from '../services/audioSynth';

interface PortalWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortalWidgetModal: React.FC<PortalWidgetModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedWidget, setSelectedWidget] = useState<'roi' | 'ticker' | 'matrix'>('roi');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const portalUrl = 'https://kboxhubia-github-io.vercel.app/';

  const getEmbedCode = (format: 'iframe' | 'react' | 'markdown') => {
    if (format === 'iframe') {
      return `<iframe 
  src="${portalUrl}?widget=${selectedWidget}&theme=dark" 
  width="100%" 
  height="380" 
  frameborder="0" 
  style="border-radius: 12px; border: 1px solid #06b6d4;" 
  title="Kboxhubia Financial AI Widget"
></iframe>`;
    }
    if (format === 'react') {
      return `import { FinancialAiWidget } from '@kboxhubia/widgets';

export default function ProfileSection() {
  return (
    <FinancialAiWidget 
      variant="${selectedWidget}" 
      theme="dark" 
      author="Ing. Jorge Huerta" 
      portalUrl="${portalUrl}" 
    />
  );
}`;
    }
    return `[![AI Financial Architecture Widget](https://img.shields.io/badge/Kboxhubia-AI_Financial_Widget-00e5ff?style=for-the-badge&logo=ai&logoColor=black)](${portalUrl})`;
  };

  const handleCopy = (format: 'iframe' | 'react' | 'markdown') => {
    audioSynth.playClickSound();
    const code = getEmbedCode(format);
    navigator.clipboard.writeText(code);
    setCopiedFormat(format);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#161618] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-gray-200 flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0E0E10] border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#1A1A1C] border border-[#333335] text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Kboxhubia Web Portal & Dynamic LinkedIn Widgets
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#1A1A1C] text-amber-400 border border-amber-500/30">
                  Official Hub
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Created by Ing. Jorge Huerta • Financial Architecture & AI Infrastructure
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
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Banner advertising the portal */}
          <div className="p-5 rounded-xl bg-[#0E0E10] border border-[#27272A] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Direct Portal Access
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                https://kboxhubia-github-io.vercel.app/
              </h3>
              <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                Explore real-time telecom analytics, interactive GPU token calculators, and next-generation FinOps algorithms directly in your browser.
              </p>
            </div>

            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioSynth.playClickSound()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-gray-200 text-black font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              <span>Visit Portal Now</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Widget Generator & Embed System */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  Integrate Dynamic Financial Widgets in LinkedIn & Portals
                </h4>
                <p className="text-xs text-gray-400">
                  Allow your network, investors, and clients to interact with live ROI models on your profile.
                </p>
              </div>

              {/* Widget Type Selector */}
              <div className="flex items-center bg-[#0E0E10] p-1 rounded-lg border border-[#27272A] text-xs">
                <button
                  onClick={() => {
                    audioSynth.playClickSound();
                    setSelectedWidget('roi');
                  }}
                  className={`px-3 py-1 rounded font-medium transition-all ${
                    selectedWidget === 'roi'
                      ? 'bg-white text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  3.4-Mo ROI Card
                </button>
                <button
                  onClick={() => {
                    audioSynth.playClickSound();
                    setSelectedWidget('ticker');
                  }}
                  className={`px-3 py-1 rounded font-medium transition-all ${
                    selectedWidget === 'ticker'
                      ? 'bg-white text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Live Market Ticker
                </button>
                <button
                  onClick={() => {
                    audioSynth.playClickSound();
                    setSelectedWidget('matrix');
                  }}
                  className={`px-3 py-1 rounded font-medium transition-all ${
                    selectedWidget === 'matrix'
                      ? 'bg-white text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Decision Matrix
                </button>
              </div>
            </div>

            {/* Live Widget Preview Card */}
            <div className="p-4 rounded-xl bg-[#0E0E10] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between text-[11px] text-gray-400 pb-2 border-b border-[#27272A]">
                <span className="flex items-center gap-1.5 text-amber-400 font-mono">
                  <Cpu className="w-3.5 h-3.5" />
                  Live Widget Preview ({selectedWidget.toUpperCase()})
                </span>
                <span className="text-emerald-400 font-medium">Ready to Embed</span>
              </div>

              {/* Rendered Widget Sample */}
              {selectedWidget === 'roi' && (
                <div className="p-4 rounded-lg bg-[#161618] border border-[#27272A] grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#0E0E10] rounded-lg border border-rose-900/30">
                    <span className="text-[10px] text-rose-400 font-bold uppercase block">Cloud API Drain</span>
                    <span className="text-lg font-bold text-rose-300 font-mono">$180,000 / yr</span>
                    <span className="text-[10px] text-gray-500 block">Pure recurring OPEX</span>
                  </div>
                  <div className="p-3 bg-[#0E0E10] rounded-lg border border-[#333335]">
                    <span className="text-[10px] text-gray-300 font-bold uppercase block">4x L40S Cluster</span>
                    <span className="text-lg font-bold text-white font-mono">$48,000 CAPEX</span>
                    <span className="text-[10px] text-gray-500 block">Sovereign On-Prem</span>
                  </div>
                  <div className="p-3 bg-[#0E0E10] rounded-lg border border-emerald-900/30">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">Break-Even Milestone</span>
                    <span className="text-lg font-bold text-emerald-300 font-mono">3.4 Months</span>
                    <span className="text-[10px] text-emerald-400/80 block">100% Capital Payback</span>
                  </div>
                </div>
              )}

              {selectedWidget === 'ticker' && (
                <div className="p-3.5 rounded-lg bg-[#161618] border border-[#27272A] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    <span className="text-xs text-gray-300 font-medium">
                      Cloud API Price Inflation Alert: +18.4% projected for Q4 2026.
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-[#1A1A1C] px-2.5 py-1 rounded-full border border-amber-500/30">
                    Migrate to On-Prem
                  </span>
                </div>
              )}

              {selectedWidget === 'matrix' && (
                <div className="p-3 rounded-lg bg-[#161618] border border-[#27272A] text-xs">
                  <div className="grid grid-cols-3 font-semibold text-gray-300 pb-1.5 border-b border-[#27272A]">
                    <span>Metric</span>
                    <span>Cloud API</span>
                    <span>On-Prem (L40S)</span>
                  </div>
                  <div className="grid grid-cols-3 text-gray-400 py-1.5 border-b border-[#27272A]">
                    <span>1M Tokens</span>
                    <span className="text-rose-400 font-mono">$5.00 - $15.00</span>
                    <span className="text-emerald-400 font-bold font-mono">$0.10 - $0.50</span>
                  </div>
                  <div className="grid grid-cols-3 text-gray-400 py-1.5">
                    <span>Latency</span>
                    <span className="text-gray-500 font-mono">350 - 1200ms</span>
                    <span className="text-white font-bold font-mono">&lt; 50ms Local</span>
                  </div>
                </div>
              )}

              <div className="text-[10px] text-gray-500 text-right">
                Powered by Ing. Jorge Huerta • Kboxhubia Hub
              </div>
            </div>

            {/* Code Snippets for Copying */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleCopy('iframe')}
                className="flex items-center justify-center gap-2 p-3 bg-[#0E0E10] hover:bg-[#1A1A1C] border border-[#27272A] rounded-xl text-xs font-semibold text-gray-200 transition-all"
              >
                {copiedFormat === 'iframe' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copiedFormat === 'iframe' ? 'Copied HTML Iframe!' : 'Copy HTML Iframe'}</span>
              </button>

              <button
                onClick={() => handleCopy('react')}
                className="flex items-center justify-center gap-2 p-3 bg-[#0E0E10] hover:bg-[#1A1A1C] border border-[#27272A] rounded-xl text-xs font-semibold text-gray-200 transition-all"
              >
                {copiedFormat === 'react' ? <Check className="w-4 h-4 text-emerald-400" /> : <Code2 className="w-4 h-4 text-amber-400" />}
                <span>{copiedFormat === 'react' ? 'Copied React JSX!' : 'Copy React Component'}</span>
              </button>

              <button
                onClick={() => handleCopy('markdown')}
                className="flex items-center justify-center gap-2 p-3 bg-[#0E0E10] hover:bg-[#1A1A1C] border border-[#27272A] rounded-xl text-xs font-semibold text-gray-200 transition-all"
              >
                {copiedFormat === 'markdown' ? <Check className="w-4 h-4 text-emerald-400" /> : <Linkedin className="w-4 h-4 text-amber-400" />}
                <span>{copiedFormat === 'markdown' ? 'Copied Markdown!' : 'Copy Profile Badge'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
