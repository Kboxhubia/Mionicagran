import React from 'react';
import { 
  Bell, 
  X, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Cpu, 
  DollarSign, 
  Radio,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { PredictiveAlert } from '../types';
import { audioSynth } from '../services/audioSynth';

interface PredictiveNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: PredictiveAlert[];
  onSelectAlert?: (alert: PredictiveAlert) => void;
}

export const PredictiveNotifications: React.FC<PredictiveNotificationsProps> = ({
  isOpen,
  onClose,
  alerts,
  onSelectAlert
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#0E0E10] border-l border-[#27272A] h-full flex flex-col shadow-2xl text-gray-200 animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-4 bg-[#0E0E10] border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#1A1A1C] text-amber-400 border border-[#333335]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Predictive Market Signals
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">
                Real-time AI Infrastructure & Telecom Trends
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
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-[10px] uppercase tracking-widest font-bold text-amber-500 mb-1">
            Active Strategic Signals ({alerts.length})
          </div>

          {alerts.map((alt) => {
            const isCritical = alt.impact === 'Critical';
            return (
              <div
                key={alt.id}
                onClick={() => {
                  audioSynth.playAlertPulseSound();
                  if (onSelectAlert) onSelectAlert(alt);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCritical
                    ? 'bg-[#161618] border-rose-900/40 hover:border-rose-600'
                    : 'bg-[#161618] border-[#27272A] hover:border-[#333335]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isCritical
                      ? 'bg-rose-950/40 text-rose-300 border-rose-800'
                      : 'bg-[#1A1A1C] text-amber-400 border border-amber-500/30'
                  }`}>
                    {alt.category} • {alt.impact}
                  </span>
                  
                  <span className="text-[10px] text-gray-500 font-mono">
                    {alt.timestamp}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mb-1 leading-snug">
                  {alt.title}
                </h4>

                <p className="text-[11px] text-gray-300 mb-2.5 leading-relaxed">
                  {alt.description}
                </p>

                {/* Metric & Trend Box */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A1A1C] border border-[#27272A] mb-2">
                  <span className="text-[11px] text-gray-400">Market Impact Metric</span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1 font-mono">
                    {alt.trend === 'up' && <TrendingUp className="w-3 h-3 text-rose-400" />}
                    {alt.trend === 'down' && <TrendingDown className="w-3 h-3 text-emerald-400" />}
                    {alt.metric}
                  </span>
                </div>

                {/* Executive Recommendation */}
                <div className="text-[10px] text-gray-300 bg-[#1A1A1C] p-2 rounded-lg border border-[#333335]">
                  <span className="font-semibold text-amber-400">Recommendation: </span>
                  {alt.recommendation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#0E0E10] border-t border-[#27272A] text-[11px] text-gray-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Live Market Telemetry Active
          </span>
          <button
            onClick={() => {
              audioSynth.playAlertPulseSound();
            }}
            className="text-[10px] text-amber-400 hover:text-white font-medium"
          >
            Refresh Telemetry
          </button>
        </div>

      </div>
    </div>
  );
};
