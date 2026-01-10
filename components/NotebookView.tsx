
import React, { useState } from 'react';
import { SmartNote } from '../types';
import Logo from './Logo';

interface NotebookViewProps {
  notes: SmartNote[];
  onBack: () => void;
}

const NotebookView: React.FC<NotebookViewProps> = ({ notes, onBack }) => {
  const [filter, setFilter] = useState('');

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(filter.toLowerCase()) || 
    n.content.toLowerCase().includes(filter.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col bg-gray-50/20">
      <div className="p-8 border-b border-gray-100 bg-white/50 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white hover:bg-gray-100 rounded-2xl shadow-sm border border-gray-100 transition-all text-gray-400 hover:text-indigo-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Knowledge Base</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Smart Notebook</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">SARA's synthesis of group discussions and resources.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Filter topics..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-transparent rounded-[1.25rem] pl-11 pr-5 py-3 text-sm w-full md:w-72 shadow-xl shadow-gray-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium"
            />
          </div>
          <Logo className="hidden md:block w-10 h-10 opacity-60" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/50 border-2 border-dashed border-gray-100 rounded-[3rem]">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center mb-10 text-indigo-100">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Empty Notebook</h3>
            <p className="text-gray-500 max-w-sm mt-3 font-medium mx-auto">Click the SARA button and ask her to "Create Notes" to populate your group's brain.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredNotes.map(note => (
              <div key={note.id} className="break-inside-avoid p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#F9FBEC] rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full uppercase tracking-[0.15em]">
                      {note.source.type}
                    </span>
                    <Logo className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight tracking-tight">{note.title}</h3>
                  <div className="text-sm text-gray-600 leading-relaxed font-medium line-clamp-6">
                    {note.content}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-8">
                    {note.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-gray-400 border border-gray-100 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                        #{tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                    <div className="flex items-center gap-2 truncate pr-4">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                      {note.source.title}
                    </div>
                    <span className="whitespace-nowrap bg-gray-50 px-2 py-1 rounded-lg">{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotebookView;
