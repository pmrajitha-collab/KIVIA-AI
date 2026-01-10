import React from 'react';
import { Group, User, AppTab } from '../types';
import Logo from './Logo';

interface SidebarProps {
  groups: Group[];
  activeGroupId: string | null;
  onGroupSelect: (id: string) => void;
  onGroupSettingsSelect: (id: string) => void;
  currentUser: User;
  onLogout: () => void;
  onCreateGroup: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onShareGroupLink: (group: Group) => void;
  onClose?: () => void;
}

// Sidebar component providing navigation and group selection
const Sidebar: React.FC<SidebarProps> = ({ 
  groups, 
  activeGroupId, 
  onGroupSelect, 
  onGroupSettingsSelect,
  currentUser, 
  onLogout, 
  onCreateGroup, 
  activeTab,
  setActiveTab,
  onShareGroupLink,
  onClose
}) => {
  const navItems = [
    { id: AppTab.PLANNER, label: 'Study Planner', icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { id: AppTab.AI_CHAT, label: 'Deep Reasoning', icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" /> },
    { id: AppTab.GROUPS_HUB, label: 'Groups Hub', icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
    { id: AppTab.PROFILE_HUB, label: 'My Profile', icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
  ];

  const groupSpecificItems = [
    { id: AppTab.CHAT, label: 'Group Chat', icon: <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> },
    { id: AppTab.VIDEO, label: 'Video Hub', icon: <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /> },
    { id: AppTab.NOTEBOOK, label: 'Notebook', icon: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { id: AppTab.FLASHCARDS, label: 'Study Cards', icon: <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
    { id: AppTab.FLASHCARD_GEN, label: 'Flashcards Generator', icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" /> },
    { id: AppTab.SCHEDULE, label: 'Session Plan', icon: <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" onClick={() => setActiveTab(AppTab.HOME)} />
          <h1 className="text-xl font-black text-gray-900 tracking-tight cursor-pointer" onClick={() => setActiveTab(AppTab.HOME)}>KIVIA</h1>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {/* Global Navigation */}
        <section className="space-y-1">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-3">Global Hub</h2>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-gray-500 hover:bg-white hover:text-indigo-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>{item.icon}</svg>
              {item.label}
            </button>
          ))}
        </section>

        {/* Group Specific Navigation */}
        {activeGroupId && activeTab !== AppTab.HOME && activeTab !== AppTab.GROUPS_HUB && activeTab !== AppTab.PROFILE_HUB && activeTab !== AppTab.PLANNER && activeTab !== AppTab.AI_CHAT && (
          <section className="space-y-1">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-3">Active Squad</h2>
            {groupSpecificItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === item.id 
                    ? item.id === AppTab.FLASHCARD_GEN ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-100' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : item.id === AppTab.FLASHCARD_GEN ? 'text-yellow-600 hover:bg-yellow-50/50' : 'text-gray-500 hover:bg-white hover:text-indigo-600'
              }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>{item.icon}</svg>
                {item.label}
              </button>
            ))}
          </section>
        )}

        {/* Study Groups List */}
        <section className="space-y-2">
          <div className="flex items-center justify-between mb-3 px-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">My Squads</h2>
            <button 
              onClick={onCreateGroup}
              className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          <div className="space-y-1">
            {groups.map(group => (
              <div 
                key={group.id}
                className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${activeGroupId === group.id ? 'bg-white shadow-sm ring-1 ring-gray-100' : 'hover:bg-white/50'}`}
                onClick={() => onGroupSelect(group.id)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activeGroupId === group.id ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                  <div className="min-w-0">
                    <p className={`text-xs font-black uppercase tracking-tight truncate ${activeGroupId === group.id ? 'text-indigo-600' : 'text-gray-500'}`}>{group.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{group.lastMessage || 'No messages'}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onShareGroupLink(group); }}
                  className="p-2 text-gray-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white space-y-4">
        <div className="flex items-center gap-3 px-2">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-indigo-50" alt={currentUser.name} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-900 truncate tracking-tight">{currentUser.name}</p>
            <div className="flex items-center gap-1.5">
               <span className={`w-1.5 h-1.5 rounded-full ${currentUser.status === 'online' ? 'bg-green-500' : currentUser.status === 'busy' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{currentUser.status}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;