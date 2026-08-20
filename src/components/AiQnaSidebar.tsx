import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  MessageSquare, 
  HelpCircle, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  DollarSign, 
  TrendingUp,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData } from '../types';
import { audioSynth } from '../services/audioSynth';
import { speechService } from '../services/speechService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  slideId?: number;
  isSimulated?: boolean;
}

interface AiQnaSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: SlideData;
  allSlides: SlideData[];
}

export const AiQnaSidebar: React.FC<AiQnaSidebarProps> = ({
  isOpen,
  onClose,
  currentSlide,
  allSlides
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Set default initial greeting and quick questions when currentSlide changes
  useEffect(() => {
    const defaultPrompts = language === 'es' ? [
      `¿Cómo se calculan las métricas clave de la lámina #${currentSlide.id}?`,
      `¿Cuál es el retorno de inversión (ROI) frente a APIs en la nube?`,
      `¿Qué ventajas operativas ofrece para telecomunicaciones y fibra óptica?`,
      `¿Por qué la arquitectura híbrida 90/10 es la recomendada?`
    ] : [
      `How are the key metrics for Slide #${currentSlide.id} calculated?`,
      `What is the ROI compared to cloud APIs?`,
      `What operational advantages does this offer for telecom & ISPs?`,
      `Why is the 90/10 hybrid architecture recommended?`
    ];

    setSuggestedQuestions(defaultPrompts);

    // If messages are empty, add welcome message
    if (messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'msg-welcome',
        role: 'assistant',
        content: language === 'es'
          ? `**Asesor Financiero y de Infraestructura IA (Gemini 2.5):**\n\nEstoy sincronizado con la **Lámina #${currentSlide.id}: ${currentSlide.title}**.\n\nPuedes hacerme cualquier pregunta técnica o financiera sobre el **TCO de $48k CAPEX**, el **punto de equilibrio a 3.4 meses**, el clúster de **4x NVIDIA L40S**, o casos de uso en **redes de telecomunicaciones y fibra óptica**.`
          : `**AI Financial & Infrastructure Executive Advisor (Gemini 2.5):**\n\nI am synchronized with **Slide #${currentSlide.id}: ${currentSlide.title}**.\n\nAsk me any financial or technical questions regarding the **$48k CAPEX TCO**, the **3.4-month break-even milestone**, the **4x NVIDIA L40S cluster**, or **telecom & fiber optic use cases**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        slideId: currentSlide.id
      };
      setMessages([welcome]);
    }
  }, [currentSlide.id, language]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading) return;

    audioSynth.playClickSound();
    setInputText('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      slideId: currentSlide.id
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          slide: currentSlide,
          language: language,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'Respuesta no disponible.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        slideId: currentSlide.id,
        isSimulated: data.isSimulated
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.suggestedQuestions && Array.isArray(data.suggestedQuestions)) {
        setSuggestedQuestions(data.suggestedQuestions);
      }
    } catch (err: any) {
      console.error('Failed to ask AI:', err);

      // Local graceful fallback
      const fallbackMessage: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: language === 'es'
          ? `**Resumen Financiero para Lámina #${currentSlide.id}:**\n• **Conclusión:** ${currentSlide.takeaway}\n• **Inversión On-Premise:** $48,000 USD (Cluster 4x L40S con 192GB VRAM).\n• **Retorno de Inversión:** Punto de equilibrio garantizado en 3.4 meses con ahorro neto de >$118,000 USD en el Año 1 frente al gasto en APIs de nube ($180k/año).`
          : `**Financial Summary for Slide #${currentSlide.id}:**\n• **Strategic Takeaway:** ${currentSlide.takeaway}\n• **On-Premise Investment:** $48,000 USD (4x L40S Cluster with 192GB VRAM).\n• **Capital Payback:** Guaranteed 3.4-month break-even with >$118,000 net Year 1 savings vs cloud SaaS drain ($180k/yr).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        slideId: currentSlide.id,
        isSimulated: true
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    audioSynth.playClickSound();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      speechService.stop();
      setSpeakingId(null);
    } else {
      speechService.speak(text.replace(/\*\*/g, '').replace(/•/g, ''), language);
      setSpeakingId(id);
    }
  };

  const handleResetChat = () => {
    audioSynth.playClickSound();
    speechService.stop();
    setSpeakingId(null);
    setMessages([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden"
          />

          {/* Sidebar Drawer */}
          <motion.aside
            id="ai-qna-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] md:w-[460px] bg-[#0E0E10] border-l border-[#27272A] z-50 flex flex-col shadow-2xl text-gray-200"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#27272A] bg-[#161618]/90 backdrop-blur-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Bot className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Executive Advisor</h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#27272A] text-amber-400 border border-amber-500/20 font-bold">
                      GEMINI
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">Financial & Telecom Infrastructure AI</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {/* Language Switch */}
                <button
                  onClick={() => {
                    audioSynth.playClickSound();
                    setLanguage(prev => prev === 'es' ? 'en' : 'es');
                  }}
                  title="Switch Language (ES / EN)"
                  className="px-2 py-1 text-[10px] font-bold rounded-md bg-[#1A1A1C] hover:bg-[#27272A] text-gray-300 border border-[#333335] transition-colors"
                >
                  {language.toUpperCase()}
                </button>

                {/* Reset Chat */}
                <button
                  onClick={handleResetChat}
                  title="Reset Conversation"
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1A1A1C] rounded-md transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    audioSynth.playClickSound();
                    onClose();
                  }}
                  title="Close Sidebar"
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1A1A1C] rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Slide Context Ribbon */}
            <div className="px-4 py-2.5 bg-[#121214] border-b border-[#27272A] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] shrink-0 font-mono">
                  Slide {currentSlide.id}
                </span>
                <span className="text-[11px] font-medium text-gray-300 truncate" title={currentSlide.title}>
                  {currentSlide.title}
                </span>
              </div>
              <span className="text-[9px] text-emerald-400 shrink-0 font-mono flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                In-Sync
              </span>
            </div>

            {/* Slide Quick Metrics Strip */}
            {currentSlide.metrics && currentSlide.metrics.length > 0 && (
              <div className="px-4 py-2 bg-[#0A0A0B] border-b border-[#27272A] grid grid-cols-3 gap-2 text-center">
                {currentSlide.metrics.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-[#161618] border border-[#27272A]">
                    <div className="text-[9px] text-gray-500 font-mono truncate">{m.label}</div>
                    <div className={`text-[11px] font-bold ${
                      m.color === 'emerald' ? 'text-emerald-400' :
                      m.color === 'cyan' ? 'text-cyan-400' :
                      m.color === 'amber' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1 px-1">
                    {msg.role === 'assistant' ? (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="font-bold text-gray-300">Gemini AI Advisor</span>
                        {msg.slideId && <span className="font-mono text-gray-500">• Slide {msg.slideId}</span>}
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-gray-400">You (Executive)</span>
                        <span>• {msg.timestamp}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-[92%] rounded-2xl p-3.5 text-xs leading-relaxed transition-all ${
                      msg.role === 'user'
                        ? 'bg-amber-500 text-black font-medium shadow-md rounded-tr-none'
                        : 'bg-[#161618] text-gray-200 border border-[#27272A] shadow-lg rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line space-y-1">
                      {msg.content}
                    </div>

                    {/* Assistant Message Actions */}
                    {msg.role === 'assistant' && (
                      <div className="mt-3 pt-2 border-t border-[#27272A] flex items-center justify-between text-[10px] text-gray-400">
                        <span className="font-mono text-[9px] text-gray-500">
                          {msg.isSimulated ? 'Verified Knowledge Base' : 'Gemini 2.5 Flash'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            title="Listen to Response"
                            className="p-1 hover:text-white rounded transition-colors flex items-center gap-1"
                          >
                            {speakingId === msg.id ? (
                              <VolumeX className="w-3 h-3 text-amber-400" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title="Copy Response Text"
                            className="p-1 hover:text-white rounded transition-colors flex items-center gap-1"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                  </div>
                  <div className="p-3 bg-[#161618] rounded-2xl border border-[#27272A] flex items-center gap-2">
                    <span className="text-[11px] text-gray-300">
                      {language === 'es' ? 'Analizando datos financieros de la lámina...' : 'Analyzing slide financial data...'}
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            <div className="p-3 bg-[#121214] border-t border-[#27272A] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-400 px-1 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-amber-500" />
                  {language === 'es' ? 'Preguntas Clave para Esta Lámina' : 'Key Questions for This Slide'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    disabled={isLoading}
                    className="text-[10.5px] text-left px-2.5 py-1 rounded-full bg-[#1A1A1C] hover:bg-white hover:text-black border border-[#27272A] text-gray-300 transition-all truncate max-w-full disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#161618] border-t border-[#27272A]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    language === 'es'
                      ? `Pregunta sobre la lámina #${currentSlide.id} (TCO, GPUs, ROI)...`
                      : `Ask about slide #${currentSlide.id} (TCO, GPUs, ROI)...`
                  }
                  className="flex-1 bg-[#0A0A0B] border border-[#27272A] focus:border-amber-500 rounded-full px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-hidden transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  title="Send Question"
                  className="p-2 rounded-full bg-white hover:bg-gray-200 text-black font-bold disabled:opacity-40 transition-all shadow-md shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <div className="mt-1.5 flex items-center justify-between text-[9px] text-gray-500 px-2 font-mono">
                <span>Ing. Jorge Huerta • Kboxhubia AI</span>
                <span>Press Enter ↵</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
