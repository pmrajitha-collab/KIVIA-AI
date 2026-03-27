import React, { useState, useRef } from 'react';
import { SmartNote } from '../types';
import Logo from './Logo';

interface NotebookViewProps {
  notes: SmartNote[];
  onBack: () => void;
}

const NotebookView: React.FC<NotebookViewProps> = ({ notes, onBack }) => {
  const [filter, setFilter] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(filter.toLowerCase()) || 
    n.content.toLowerCase().includes(filter.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowScrollTop(scrollRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/10 relative">
      <div className="p-6 md:p-8 border-b border-slate-200 bg-white/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all text-slate-400 hover:text-slate-900 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Notebook</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Knowledge Base</p>
          </div>
        </div>
        <div className="relative w-full md:w-72">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-slate-400 outline-none transition-all font-medium shadow-sm"
          />
        </div>
      </div>

      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-8 scroll-smooth no-scrollbar"
      >
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
            <Logo className="w-10 h-10 mb-4 opacity-10 text-slate-900" />
            <h3 className="text-base font-bold text-slate-400 tracking-tight uppercase">Notebook Empty</h3>
            <p className="text-xs text-slate-300 mt-2 font-medium max-w-xs mx-auto italic">Your notes will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredNotes.map(note => (
              <div key={note.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[8px] font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                    {note.source.type}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-slate-900 transition-colors leading-snug tracking-tight">{note.title}</h3>
                <div className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-5 mb-6 flex-1">
                  {note.content}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto border-t border-slate-50 pt-4">
                  {note.tags.map(tag => (
                    <span key={tag} className="text-[8px] font-bold text-slate-400 border border-slate-100 bg-slate-50 px-2 py-1 rounded-md uppercase tracking-widest">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all z-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7 7 7M12 3v18" /></svg>
        </button>
      )}
    </div>
  );
};

export default NotebookView;