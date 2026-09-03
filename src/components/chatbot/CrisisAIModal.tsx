import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, AlertCircle, Sparkles } from 'lucide-react';
import { aiService, CrisisAIMessage } from '../../services/aiService';

export const CrisisAIModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CrisisAIMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello, I am CrisisAI. I can provide immediate first-aid guidance and safety instructions while emergency responders are alerted. How can I assist you?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: CrisisAIMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputValue('');
    setIsTyping(true);

    try {
      const reply = await aiService.getGuidance(textToSend);
      const botMsg: CrisisAIMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const sampleQuestions = [
    'What should I do if someone is unconscious?',
    'How can I help someone who is bleeding?',
    'Where can I find emergency assistance?'
  ];

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open CrisisAI emergency assistant"
        className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emergency-600 to-emergency-500 hover:from-emergency-500 hover:to-emergency-400 text-white rounded-full shadow-emergency-glow transition-all transform hover:scale-105 active:scale-95 group"
      >
        <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="font-bold text-xs tracking-wider uppercase hidden sm:inline">CrisisAI</span>
        <span className="w-2 h-2 rounded-full bg-white animate-ping hidden sm:inline" />
      </button>

      {/* Floating Glassmorphic Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end sm:pr-8 sm:pb-8 p-0 pointer-events-none">
          <div className="w-full sm:w-[420px] max-h-[85vh] h-[600px] pointer-events-auto rounded-t-3xl sm:rounded-2xl glass-panel shadow-2xl flex flex-col overflow-hidden border border-theme-mint/40 dark:border-theme-mint/30 animate-in fade-in slide-in-from-bottom-8 duration-200">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-theme-mint/30 bg-white/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-theme-dark">CrisisAI Safety Guide</h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30">
                      SAFETY AI
                    </span>
                  </div>
                  <p className="text-[10px] text-theme-forest/80">Emergency Protocol Guidance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-theme-forest/80 hover:text-theme-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mandatory Emergency Medical Disclaimer Alert */}
            <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-2 text-[11px] text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                <strong>Notice:</strong> This information is general guidance and does not replace emergency services or professional medical care.
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                      m.sender === 'user'
                        ? 'bg-sky-600 text-theme-dark rounded-br-none shadow-md'
                        : 'bg-white/10 dark:bg-theme-sage/80 text-theme-dark rounded-bl-none border border-theme-mint/30'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-theme-forest/60 mt-1 px-1">{m.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-xs text-sky-400 px-3 py-2 bg-white/5 rounded-xl w-fit">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Reviewing emergency protocols...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-theme-mint/20 bg-white/50 flex flex-wrap gap-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-theme-forest hover:text-theme-dark border border-theme-mint/30 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 border-t border-theme-mint/30 bg-white/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask for first-aid or safety guidance..."
                  className="flex-1 bg-theme-sage/80 border border-theme-mint/30 rounded-xl px-3.5 py-2.5 text-xs text-theme-dark placeholder:text-theme-forest/60 focus:outline-none focus:border-sky-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-theme-dark transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
