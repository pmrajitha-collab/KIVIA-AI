
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
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row h-[700px] max-h-[90vh]">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <Logo className="w-8 h-8" />
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Settings</h2>
          </div>
          
          <nav className="space-y-2 flex-1">
            <button 
              onClick={() => setActiveTab(SettingsTab.PROFILE)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === SettingsTab.PROFILE ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              My Profile
            </button>
            
            {activeGroup && (
              <button 
                onClick={() => setActiveTab(SettingsTab.GROUP)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === SettingsTab.GROUP ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Group Settings
              </button>
            )}

            <button 
              onClick={() => setActiveTab(SettingsTab.JOIN)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === SettingsTab.JOIN ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Join Group
            </button>
          </nav>

          <button onClick={onClose} className="mt-auto text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors py-2">Close Settings</button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-white">
          {activeTab === SettingsTab.PROFILE && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <img src={avatar} alt="Profile Avatar" className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-inner group-hover:scale-105 transition-transform duration-300 object-cover" />
                  <div className="absolute -bottom-1 -right-1 flex gap-1">
                    <button onClick={handleRandomizeAvatar} className="bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-indigo-700 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="bg-green-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-green-700 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCustomAvatar} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Identity</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Display Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Academic Level</label>
                    <select value={academicLevel} onChange={e => setAcademicLevel(e.target.value)} className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white outline-none transition-all font-medium">
                      <option value="High School">High School</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Class</label>
                      <input type="text" value={classLevel} onChange={e => setClassLevel(e.target.value)} className="w-full bg-gray-50 border-transparent rounded-2xl px-3 py-4 text-sm focus:bg-white outline-none transition-all font-medium" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Div</label>
                      <input type="text" value={division} onChange={e => setDivision(e.target.value)} className="w-full bg-gray-50 border-transparent rounded-2xl px-3 py-4 text-sm focus:bg-white outline-none transition-all font-medium" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Current Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['online', 'busy', 'studying', 'offline'] as UserStatus[]).map((s) => (
                      <button key={s} onClick={() => setStatus(s)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${status === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-100'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={handleSaveProfile} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Changes</button>
            </div>
          )}

          {activeTab === SettingsTab.GROUP && activeGroup && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Group Name</label>
                  <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium" />
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Join Code</label>
                      <p className="text-2xl font-black text-indigo-600 tracking-wider">{activeGroup.joinCode}</p>
                    </div>
                    <button onClick={handleRegenerateCode} className="p-3 bg-white text-gray-400 hover:text-indigo-600 rounded-xl shadow-sm border border-transparent hover:border-indigo-100 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={handleSaveGroup} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Update Group</button>
                <button onClick={() => { if(confirm("Delete this group?")) onDeleteGroup(); }} className="w-full bg-white text-red-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border border-red-50 hover:bg-red-50 transition-all">Delete Study Group</button>
              </div>
            </div>
          )}

          {activeTab === SettingsTab.JOIN && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight mb-2">Join a Peer Group</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">Pasted a join link or entered a 6-digit code to connect with your study group instantly.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Code or Full Invitation Link</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={joinInput}
                      onChange={e => setJoinInput(e.target.value)}
                      placeholder="e.g. 123456 or http://kivia.io/#join-123456"
                      className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium" 
                    />
                  </div>
                </div>
              </div>
              <button 
                disabled={!joinInput.trim()} 
                onClick={handleJoin}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                Join Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
