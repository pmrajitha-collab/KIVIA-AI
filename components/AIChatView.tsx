
import React, { useState, useRef, useEffect } from 'react';
import { getSaraResponseStream } from '../services/gemini';
import Logo from './Logo';

interface AIChatViewProps {
  onBack: () => void;
  context?: string;
}

const AIChatView: React.FC<AIChatViewProps> = ({ onBack, context = "" }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "I'm SARA, your AI assistant. I can help you understand complex topics, explain difficult concepts, or help you structure your study materials. What shall we explore today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Add a placeholder message for SARA that we'll update with the stream
    setMessages(prev => [...prev, { role: 'ai', text: '' }]);

    try {
      await getSaraResponseStream(userMsg, context, (fullText) => {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'ai', text: fullText };
          return newMessages;
        });
      });
    } catch (err) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: 'ai', text: "I encountered an error. Please try again." };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/10">
      <div className="p-8 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 transition-all text-slate-400 hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SARA</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">SARA</h2>
          </div>
        </div>
        <Logo className="w-12 h-12 text-slate-900" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm border ${m.role === 'ai' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-900'}`}>
                  {m.role === 'ai' ? <Logo className="w-6 h-6 text-slate-900" /> : <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                </div>
                <div className={`p-6 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none font-medium'
                }`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Logo className="w-6 h-6 animate-spin text-slate-900" />
                </div>
                <div className="p-6 bg-white border border-slate-100 rounded-2xl rounded-tl-none flex gap-2 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-slate-50 border-transparent rounded-xl px-8 py-5 text-sm focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-200 outline-none transition-all font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-slate-900 text-white p-5 rounded-xl shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
          >
            <svg className="w-6 h-6 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatView;
