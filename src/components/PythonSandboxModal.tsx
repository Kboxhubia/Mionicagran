import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Download,
  X,
  Code2,
  Cpu,
  Sparkles,
  Zap,
  TrendingUp,
  FileText,
  Clock,
  RotateCcw
} from 'lucide-react';
import { PYTHON_PRESETS } from '../data/slidesData';
import { Language, PythonSandboxPreset } from '../types';
import { executePythonScript, PythonRunResult } from '../services/pythonRunner';
import { audioSynth } from '../services/audioSynth';
import { UI_TRANSLATIONS } from '../services/i18n';

interface PythonSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const PythonSandboxModal: React.FC<PythonSandboxModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PythonSandboxPreset>(PYTHON_PRESETS[0]);
  const [customCode, setCustomCode] = useState<string>(PYTHON_PRESETS[0].code);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [outputResult, setOutputResult] = useState<PythonRunResult | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);

  const t = UI_TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleSelectPreset = (preset: PythonSandboxPreset) => {
    audioSynth.playClickSound();
    setSelectedPreset(preset);
    setCustomCode(preset.code);
    setOutputResult(null);
  };

  const handleRunScript = async () => {
    audioSynth.playTone(520, 0.1, 'triangle', 0.08);
    setIsRunning(true);
    const res = await executePythonScript(customCode);
    setOutputResult(res);
    setIsRunning(false);
    audioSynth.playAlertChime();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(customCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyOutput = () => {
    if (outputResult?.stdout) {
      navigator.clipboard.writeText(outputResult.stdout);
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  const handleDownloadPy = () => {
    audioSynth.playClickSound();
    const element = document.createElement('a');
    const file = new Blob([customCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedPreset.id}_kboxhubia.py`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-6xl bg-[#0E0E10] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#141416]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {t.python_suite} (Python 3.12 Engine)
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Pyodide / WASM
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {lang === 'es'
                    ? 'Motor matemático y financiero ejecutable para auditorías de TCO, VRAM y Churn'
                    : lang === 'pt'
                    ? 'Motor matemático e financeiro executável para auditorias de TCO, VRAM e Churn'
                    : 'Executable mathematical & financial engine for TCO, VRAM, and Churn audits'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                audioSynth.playClickSound();
                onClose();
              }}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#27272A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
            {/* Left Sidebar: 7 Python Presets */}
            <div className="lg:col-span-4 border-r border-[#27272A] bg-[#111113] p-4 flex flex-col gap-2.5 overflow-y-auto max-h-[40vh] lg:max-h-full">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 px-2">
                <Sparkles className="w-3.5 h-3.5" />
                {t.seven_ideas}
              </span>

              {PYTHON_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                        : 'bg-[#18181B]/70 border-[#27272A] text-gray-300 hover:bg-[#202024] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {preset.title}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-400/90 border border-[#333]">
                        {preset.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {preset.description[lang]}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Editor & Console Area */}
            <div className="lg:col-span-8 flex flex-col bg-[#0A0A0C] p-4 gap-4 overflow-y-auto">
              {/* Editor Header Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#27272A]">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>script.py</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-300 hover:text-white bg-[#1A1A1D] hover:bg-[#27272A] border border-[#333] rounded-lg transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? t.copied : t.copy}</span>
                  </button>

                  <button
                    onClick={handleDownloadPy}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-300 hover:text-white bg-[#1A1A1D] hover:bg-[#27272A] border border-[#333] rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.download_code}</span>
                  </button>

                  <button
                    onClick={handleRunScript}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 active:scale-95 disabled:opacity-50 rounded-lg shadow-md transition-all"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? t.python_running : t.python_runner}</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea Area */}
              <div className="relative">
                <textarea
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  rows={10}
                  className="w-full bg-[#111114] border border-[#27272A] rounded-xl p-3.5 font-mono text-xs text-emerald-400/90 focus:border-amber-500/70 focus:outline-none leading-relaxed resize-none shadow-inner"
                  spellCheck={false}
                />
              </div>

              {/* Live Output Console */}
              <div className="flex flex-col bg-[#111113] border border-[#27272A] rounded-xl overflow-hidden shadow-md">
                <div className="flex items-center justify-between px-3.5 py-2 bg-[#17171A] border-b border-[#27272A]">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.python_output}</span>
                    {outputResult && (
                      <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {outputResult.executionTimeMs}ms
                      </span>
                    )}
                  </div>
                  {outputResult && (
                    <button
                      onClick={handleCopyOutput}
                      className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedOutput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedOutput ? t.copied : t.copy}</span>
                    </button>
                  )}
                </div>

                <div className="p-3.5 font-mono text-xs text-gray-200 overflow-x-auto min-h-[140px] max-h-[220px] whitespace-pre bg-[#0A0A0C]">
                  {isRunning ? (
                    <div className="flex items-center gap-2 text-amber-400 animate-pulse">
                      <Zap className="w-4 h-4" />
                      <span>{t.python_running}</span>
                    </div>
                  ) : outputResult ? (
                    <span className="text-emerald-400">{outputResult.stdout}</span>
                  ) : (
                    <span className="text-gray-500 italic">
                      {lang === 'es'
                        ? 'Presiona "Ejecutar Script Python" para compilar y visualizar el informe matemático en tiempo real.'
                        : lang === 'pt'
                        ? 'Pressione "Executar Script Python" para compilar e visualizar o relatório matemático em tempo real.'
                        : 'Click "Run Python Script" to compile and view real-time mathematical reports.'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
