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
          <div className="pointer-events-auto flex h-[600px] max-h-[85vh] w-full flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-[#fffefa] text-black shadow-[0_20px_60px_rgba(15,23,42,0.20)] animate-in fade-in slide-in-from-bottom-8 duration-200 sm:w-[420px] sm:rounded-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-red-100 bg-white px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-black">CrisisAI Safety Guide</h3>
                    <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-semibold text-red-700">
                      SAFETY AI
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600">Emergency Protocol Guidance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mandatory Emergency Medical Disclaimer Alert */}
            <div className="flex items-start gap-2 border-b border-red-100 bg-red-50 px-4 py-2.5 text-[11px] text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <span>
                <strong>Notice:</strong> This information is general guidance and does not replace emergency services or professional medical care.
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-[#fffefa] p-4 no-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                      m.sender === 'user'
                        ? 'rounded-br-none bg-red-600 text-white shadow-md'
                        : 'rounded-bl-none border border-red-100 bg-white text-black shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="mt-1 px-1 text-[9px] text-slate-500">{m.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                  <div className="flex w-fit items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Reviewing emergency protocols...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5 border-t border-red-100 bg-white px-4 py-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="rounded-full border border-red-200 bg-white px-2.5 py-1 text-left text-[10px] text-red-700 transition-colors hover:bg-red-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="border-t border-red-100 bg-white p-3">
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
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-black placeholder:text-slate-500 transition-colors focus:border-red-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="rounded-xl bg-red-600 p-2.5 text-white transition-all hover:bg-red-700 disabled:opacity-40"
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
