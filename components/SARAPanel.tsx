
import React, { useState } from 'react';
import { Message, SmartNote, VideoSession } from '../types';
import { getSaraResponse, generateSmartNotes } from '../services/gemini';
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
    { role: 'ai', text: "Hello! I'm SARA. Ask me to 'Summarize the chat', 'Analyze our latest video', or 'Generate smart notes' to get started." }
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
        const analysisPrompt = `Synthesize the video session titled "${latestVideo.title}". Extract the top academic takeaways. Context: ${latestVideo.transcript || 'Peer session'}`;
        const response = await getSaraResponse(analysisPrompt, `Group session analysis requested.`);
        
        onNewNote({
          id: 'vid-note-' + Date.now(),
          title: `Video Key Takeaways: ${latestVideo.title}`,
          content: response,
          tags: ['Session Analysis', 'Peer Recap'],
          source: { type: 'video', id: latestVideo.id, title: latestVideo.title },
          createdAt: new Date().toISOString(),
          groupId: activeGroupId
        });

        setHistory(prev => [...prev, { role: 'ai', text: `I've distilled that video session into a smart note! You can find it in your Notebook now.` }]);
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
          setHistory(prev => [...prev, { role: 'ai', text: `Brilliant! I've scanned your discussion and added ${newNotes.length} conceptual notes to your group notebook.` }]);
        } else {
          setHistory(prev => [...prev, { role: 'ai', text: "I analyzed the recent messages but couldn't extract enough academic substance for a high-quality note yet. Let's keep studying!" }]);
        }
      } else {
        const context = `
          Recent Discussion: ${messages.slice(-10).map(m => m.text).join(' | ')}
          Note Topics: ${notes.slice(0, 5).map(n => n.title).join(', ')}
        `;
        const response = await getSaraResponse(q, context);
        setHistory(prev => [...prev, { role: 'ai', text: response }]);
        
        if (lowerQ.includes('summarize')) {
          onAiResponse({
              id: 'sara-' + Date.now(),
              senderId: 'sara',
              senderName: 'SARA',
              text: response,
              timestamp: new Date().toISOString(),
              type: 'ai'
          });
        }
      }
    } catch (err) {
      setHistory(prev => [...prev, { role: 'ai', text: "Oops, my academic neurons misfired. Could you try asking that again?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Logo className="w-12 h-12 shadow-xl shadow-indigo-100 rounded-full" />
          <div className="flex flex-col">
            <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">SARA AI</h3>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Analyzing Live
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2.5 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-gray-100">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        {history.map((h, i) => (
          <div key={i} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[90%] shadow-sm ${
              h.role === 'user' ? 'bg-indigo-600 text-white font-medium rounded-tr-none' : 'bg-white text-gray-800 font-bold border border-gray-100 rounded-tl-none'
            }`}>
              {h.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-none flex gap-2 items-center">
              <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full animate-bounce [animation-delay:0s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="flex flex-col gap-2 mb-6">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] px-1">Grounded Actions</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Generate Notes", q: "Generate smart notes from chat" },
              { label: "Study Recap", q: "Summarize our latest session" },
              { label: "Analyze Video", q: "Analyze video content" }
            ].map(s => (
              <button 
                key={s.label} 
                onClick={() => handleAsk(s.q)}
                className="text-[10px] bg-white border border-gray-100 text-indigo-600 px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
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
            placeholder="Ask SARA anything..."
            className="flex-1 bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-xs font-medium focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
          />
          <button 
            onClick={() => handleAsk()}
            disabled={!query.trim() || loading}
            className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SARAPanel;
