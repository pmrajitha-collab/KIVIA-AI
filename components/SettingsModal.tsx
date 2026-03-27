import React, { useState, useRef } from 'react';
import { User, Group, UserStatus } from '../types';
import Logo from './Logo';

export enum SettingsTab {
  PROFILE = 'profile',
  GROUP = 'group',
  JOIN = 'join'
}

interface SettingsModalProps {
  user: User;
  activeGroup: Group | null;
  initialTab?: SettingsTab;
  onClose: () => void;
  onUpdateUser: (updatedUser: Partial<User>) => void;
  onUpdateGroup: (updatedGroup: Partial<Group>) => void;
  onDeleteGroup: () => void;
  onClearChat: () => void;
  onExitGroup: () => void;
  onJoinGroup: (code: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  user, 
  activeGroup, 
  initialTab = SettingsTab.PROFILE, 
  onClose, 
  onUpdateUser, 
  onUpdateGroup, 
  onDeleteGroup,
  onClearChat,
  onExitGroup,
  onJoinGroup
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile State
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [academicLevel, setAcademicLevel] = useState(user.academicLevel || '');
  const [classLevel, setClassLevel] = useState(user.classLevel || '');
  const [division, setDivision] = useState(user.division || '');

  // Group State
  const [groupName, setGroupName] = useState(activeGroup?.name || '');

  // Join State
  const [joinInput, setJoinInput] = useState('');

  const handleRandomizeAvatar = () => {
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
    setAvatar(newAvatar);
  };

  const handleCustomAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    onUpdateUser({ name, avatar, status, academicLevel, classLevel, division });
    onClose();
  };

  const handleSaveGroup = () => {
    onUpdateGroup({ name: groupName });
    onClose();
  };

  const handleJoin = () => {
    let code = joinInput.trim();
    if (code.includes('#join-')) {
      code = code.split('#join-')[1];
    }
    onJoinGroup(code);
    onClose();
  };

  const handleRegenerateCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    onUpdateGroup({ joinCode: newCode });
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row h-[600px] max-h-[90vh] border border-gray-100">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-60 bg-gray-50 border-r border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <Logo className="w-6 h-6" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Settings</h2>
          </div>
          
          <nav className="space-y-1.5 flex-1">
            <button 
              onClick={() => setActiveTab(SettingsTab.PROFILE)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === SettingsTab.PROFILE ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              My Profile
            </button>
            
            {activeGroup && (
              <button 
                onClick={() => setActiveTab(SettingsTab.GROUP)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === SettingsTab.GROUP ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Group
              </button>
            )}

            <button 
              onClick={() => setActiveTab(SettingsTab.JOIN)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === SettingsTab.JOIN ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Join
            </button>
          </nav>

          <button onClick={onClose} className="mt-auto text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors py-2 border-t border-gray-100 pt-4">Dismiss</button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          {activeTab === SettingsTab.PROFILE && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
                <div className="relative group">
                  <img src={avatar} className="w-20 h-20 rounded-xl border border-gray-200 shadow-inner object-cover" />
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <button onClick={handleRandomizeAvatar} className="bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Display Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:border-indigo-500 outline-none transition-all bg-gray-50/30" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Study Level</label>
                  <select value={academicLevel} onChange={e => setAcademicLevel(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none bg-gray-50/30">
                    <option value="High School">High School</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as UserStatus)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none bg-gray-50/30">
                    <option value="online">Online</option>
                    <option value="studying">Studying</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button onClick={handleSaveProfile} className="w-full bg-gray-900 text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">Update Account</button>
              </div>
            </div>
          )}

          {activeTab === SettingsTab.GROUP && activeGroup && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Squad Name</label>
                  <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 outline-none transition-all bg-gray-50/30" />
                </div>
                <div className="p-4 bg-indigo-50/30 rounded-lg border border-indigo-100 flex items-center justify-between">
                  <div>
                    <label className="block text-[8px] font-black text-indigo-400 uppercase tracking-widest">Share ID</label>
                    <p className="text-xl font-black text-indigo-700">{activeGroup.joinCode}</p>
                  </div>
                  <button onClick={handleRegenerateCode} className="p-2 bg-white text-gray-400 hover:text-indigo-600 rounded-lg border border-gray-100 shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <button onClick={handleSaveGroup} className="w-full bg-indigo-600 text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all">Save Changes</button>
                
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { if(confirm("Clear chat?")) { onClearChat(); onClose(); } }} className="w-full border border-gray-200 text-gray-500 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-gray-50">Clear Chat</button>
                  <button onClick={() => { if(confirm("Exit squad?")) { onExitGroup(); onClose(); } }} className="w-full border border-orange-200 text-orange-600 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-orange-50">Exit Squad</button>
                </div>

                <button onClick={() => { if(confirm("Delete group for everyone?")) { onDeleteGroup(); onClose(); } }} className="w-full bg-white text-red-600 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-red-100 hover:bg-red-50 transition-all">Delete Group Permanently</button>
              </div>
            </div>
          )}

          {activeTab === SettingsTab.JOIN && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900 uppercase">Join Collaborative Space</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Enter a 6-digit squad code to synchronize with your peers instantly.</p>
              </div>
              <div className="space-y-4">
                <input 
                  autoFocus
                  type="text" 
                  value={joinInput}
                  onChange={e => setJoinInput(e.target.value)}
                  placeholder="Enter Squad ID"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all bg-gray-50/30" 
                />
                <button 
                  disabled={!joinInput.trim()} 
                  onClick={handleJoin}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  Confirm Join
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;