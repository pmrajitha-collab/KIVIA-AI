
import React, { useState } from 'react';
import { Message, SmartNote, VideoSession } from '../types';
import { getSaraResponse, getSaraResponseStream, generateSmartNotes } from '../services/gemini';
import Logo from './Logo';

interface SARAPanelProps {
  onClose: () => void;
  messages: Message[];
  notes: SmartNote[];
  videos: VideoSession[];
  onAiResponse: (msg: Message) => void;
  onNewNote: (note: SmartNote) => void;
  activeGroupId: string;
}

const SARAPanel: React.FC<SARAPanelProps> = ({ onClose, messages, notes, videos, onAiResponse, onNewNote, activeGroupId }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Hello! I'm SARA, your AI assistant. Ask me to 'Summarize the chat', 'Analyze our latest video', or 'Generate notes' to get started." }
  ]);

  const handleAsk = async (explicitQuery?: string) => {
    const q = explicitQuery || query;
    if (!q.trim() || loading) return;
    
    setHistory(prev => [...prev, { role: 'user', text: q }]);
    setQuery('');
    setLoading(true);

    const lowerQ = q.toLowerCase();
    const isVideoAnalysis = lowerQ.includes('video') || lowerQ.includes('session');
    const isNoteGen = lowerQ.includes('create notes') || lowerQ.includes('generate notes') || lowerQ.includes('scan chat');
    
    try {
      if (isVideoAnalysis && videos.length > 0) {
        const latestVideo = videos[videos.length - 1];
        const analysisPrompt = `Summarize the video session titled "${latestVideo.title}". Extract the key takeaways. Context: ${latestVideo.transcript || 'Peer session'}`;
        const response = await getSaraResponse(analysisPrompt, `Group session analysis requested.`);
        
        onNewNote({
          id: 'vid-note-' + Date.now(),
          title: `Video Takeaways: ${latestVideo.title}`,
          content: response,
          tags: ['Session Analysis', 'Recap'],
          source: { type: 'video', id: latestVideo.id, title: latestVideo.title },
          createdAt: new Date().toISOString(),
          groupId: activeGroupId
        });

        setHistory(prev => [...prev, { role: 'ai', text: `I've analyzed that video session and added a note to your Notebook.` }]);
      } else if (isNoteGen) {
        const chatStr = messages.slice(-50).map(m => `${m.senderName}: ${m.text}`).join('\n');
        const newNotes = await generateSmartNotes(chatStr);
        if (newNotes && newNotes.length > 0) {
          newNotes.forEach((n: any) => {
            onNewNote({
              id: 'ai-note-' + Date.now() + Math.random(),
              title: n.title,
              content: n.content,
              tags: n.tags,
              source: { type: 'chat', id: 'ai-gen', title: 'Chat Synthesis' },
              createdAt: new Date().toISOString(),
              groupId: activeGroupId
            });
          });
          setHistory(prev => [...prev, { role: 'ai', text: `I've scanned your discussion and added ${newNotes.length} notes to your notebook.` }]);
        } else {
          setHistory(prev => [...prev, { role: 'ai', text: "I analyzed the recent messages but couldn't find enough information for a note yet." }]);
        }
      } else {
        const context = `
          Recent Discussion: ${messages.slice(-10).map(m => m.text).join(' | ')}
          Note Topics: ${notes.slice(0, 5).map(n => n.title).join(', ')}
        `;

        // Add placeholder for streaming response
        setHistory(prev => [...prev, { role: 'ai', text: '' }]);

        const response = await getSaraResponseStream(q, context, (fullText) => {
          setHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { role: 'ai', text: fullText };
            return newHistory;
          });
        });
        
        if (lowerQ.includes('summarize')) {
          onAiResponse({
              id: 'sara-' + Date.now(),
              senderId: 'sara',
              senderName: 'AI',
              text: response,
              timestamp: new Date().toISOString(),
              type: 'ai'
          });
        }
      }
    } catch (err) {
      setHistory(prev => {
        const newHistory = [...prev];
        if (newHistory[newHistory.length - 1].role === 'ai' && newHistory[newHistory.length - 1].text === '') {
          newHistory[newHistory.length - 1] = { role: 'ai', text: "I encountered an error. Please try again." };
        } else {
          newHistory.push({ role: 'ai', text: "I encountered an error. Please try again." });
        }
        return newHistory;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Logo className="w-12 h-12 shadow-sm text-slate-900" />
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">SARA</h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {history.map((h, i) => (
          <div key={i} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[90%] shadow-sm ${
              h.role === 'user' ? 'bg-slate-900 text-white font-medium rounded-tr-none' : 'bg-white text-slate-800 font-bold border border-slate-100 rounded-tl-none'
            }`}>
              {h.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none flex gap-2 items-center">
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-white">
        <div className="flex flex-col gap-2 mb-6">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-1">Actions</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Generate Notes", q: "Generate notes from chat" },
              { label: "Summarize Chat", q: "Summarize the chat" },
              { label: "Analyze Video", q: "Analyze video content" }
            ].map(s => (
              <button 
                key={s.label} 
                onClick={() => handleAsk(s.q)}
                className="text-[10px] bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask anything..."
            className="flex-1 bg-slate-50 border border-transparent rounded-xl px-6 py-4 text-xs font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all"
          />
          <button 
            onClick={() => handleAsk()}
            disabled={!query.trim() || loading}
            className="bg-slate-900 text-white p-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SARAPanel;
