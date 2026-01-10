
import React from 'react';
import { User, Message, SmartNote, VideoSession, Group } from '../types';

interface SearchViewProps {
  query: string;
  users: User[];
  messages: Message[];
  notes: SmartNote[];
  videos: VideoSession[];
  groups: Group[];
  onNavigate: (groupId: string, tab: any) => void;
  onClose: () => void;
}

const SearchView: React.FC<SearchViewProps> = ({ query, users, messages, notes, videos, groups, onNavigate, onClose }) => {
  const q = query.toLowerCase();

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(q));
  const filteredMessages = messages.filter(m => m.text.toLowerCase().includes(q));
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  const filteredVideos = videos.filter(v => v.title.toLowerCase().includes(q));

  const getGroupName = (groupId: string) => groups.find(g => g.id === groupId)?.name || "Unknown Group";

  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col p-8 overflow-y-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Search Results for <span className="text-indigo-600">"{query}"</span></h2>
        <button onClick={onClose} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Users Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Peers ({filteredUsers.length})
          </h3>
          {filteredUsers.map(user => (
            <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all group">
              <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-100" />
              <div>
                <p className="font-bold text-sm text-gray-900">{user.name}</p>
                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-tighter">{user.status}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Messages Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            Discussions ({filteredMessages.length})
          </h3>
          {filteredMessages.map(msg => (
            <div 
              key={msg.id} 
              onClick={() => onNavigate(msg.metadata?.groupId || '', 'chat')}
              className="p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
            >
              <p className="text-xs font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">"{msg.text}"</p>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">In {getGroupName(msg.metadata?.groupId || '')}</p>
            </div>
          ))}
        </section>

        {/* Notes Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Notebook ({filteredNotes.length})
          </h3>
          {filteredNotes.map(note => (
            <div 
              key={note.id} 
              onClick={() => onNavigate(note.groupId, 'notebook')}
              className="p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-green-100 transition-all cursor-pointer group"
            >
              <p className="text-xs font-black text-gray-900 line-clamp-1 mb-1 group-hover:text-green-600 transition-colors">{note.title}</p>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest truncate">From {getGroupName(note.groupId)}</p>
            </div>
          ))}
        </section>

        {/* Videos Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Recordings ({filteredVideos.length})
          </h3>
          {filteredVideos.map(vid => (
            <div 
              key={vid.id} 
              onClick={() => onNavigate(vid.groupId, 'video')}
              className="p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer group flex items-center gap-3"
            >
              <div className="w-12 h-8 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img src={vid.thumbnail} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{vid.title}</p>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest truncate">{getGroupName(vid.groupId)}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {(filteredUsers.length === 0 && filteredMessages.length === 0 && filteredNotes.length === 0 && filteredVideos.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400 font-bold">No results found for your query.</p>
        </div>
      )}
    </div>
  );
};

export default SearchView;
