import React, { useState, useMemo, useRef } from 'react';
import { Group, Message, User } from '../types';
import Logo from './Logo';

interface GroupDetailSettingsProps {
  group: Group;
  messages: Message[];
  allUsers: User[];
  currentUser: User;
  onUpdateGroup: (updated: Partial<Group>) => void;
  onClearChat: () => void;
  onExitGroup: () => void;
  onDeleteGroup: () => void;
  onBack: () => void;
}

const GroupDetailSettings: React.FC<GroupDetailSettingsProps> = ({
  group,
  messages,
  allUsers,
  currentUser,
  onUpdateGroup,
  onClearChat,
  onExitGroup,
  onDeleteGroup,
  onBack
}) => {
  const [name, setName] = useState(group.name);
  const [avatar, setAvatar] = useState(group.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${group.joinCode}`);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'members' | 'media' | 'actions'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = useMemo(() => group.adminIds.includes(currentUser.id), [group.adminIds, currentUser.id]);
  
  const groupMembers = useMemo(() => 
    allUsers.filter(u => group.memberIds.includes(u.id)), 
    [allUsers, group.memberIds]
  );

  const mediaMessages = useMemo(() => {
    return messages.filter(m => 
      m.type === 'file' || 
      (m.metadata?.preview && (m.metadata.preview.type === 'image' || m.metadata.preview.type === 'video'))
    );
  }, [messages]);

  const handleSaveProfile = () => {
    onUpdateGroup({ name, avatar });
    alert("Group profile updated.");
  };

  const handleShuffleAvatar = () => {
    const newAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${Math.random()}`;
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

  const handleRegenerateCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    onUpdateGroup({ joinCode: newCode });
  };

  const toggleAdmin = (memberId: string) => {
    if (!isAdmin) return;
    const newAdminIds = group.adminIds.includes(memberId)
      ? group.adminIds.filter(id => id !== memberId)
      : [...group.adminIds, memberId];
    
    if (newAdminIds.length === 0) {
      alert("At least one admin is required.");
      return;
    }
    onUpdateGroup({ adminIds: newAdminIds });
  };

  const kickMember = (memberId: string) => {
    if (!isAdmin || memberId === currentUser.id) return;
    if (confirm("Remove this member from the group?")) {
      onUpdateGroup({ 
        memberIds: group.memberIds.filter(id => id !== memberId),
        adminIds: group.adminIds.filter(id => id !== memberId)
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex items-center gap-3">
             <img src={group.avatar} className="w-10 h-10 rounded-xl border border-slate-100 object-cover bg-slate-50" />
             <div>
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">{group.name}</h2>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Group Settings</p>
             </div>
          </div>
        </div>
        <Logo className="w-8 h-8 opacity-20 text-slate-900" />
      </header>

      {/* Sub Navigation */}
      <div className="px-6 bg-white border-b border-slate-100 flex gap-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'General' },
          { id: 'members', label: `Members (${groupMembers.length})` },
          { id: 'media', label: `Media (${mediaMessages.length})` },
          { id: 'actions', label: 'Actions' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeSubTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            {activeSubTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8 pb-12">
          
          {activeSubTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <section className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200">
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Group Profile</h3>
                </div>
                <div className="p-6 space-y-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                      <img src={avatar} className="w-32 h-32 rounded-2xl border border-slate-200 shadow-inner object-cover bg-slate-50" />
                      {isAdmin && (
                        <div className="absolute -bottom-2 -right-2 flex gap-1">
                          <button onClick={handleShuffleAvatar} className="bg-white border border-slate-200 p-2 rounded-lg shadow-sm text-slate-400 hover:text-slate-900 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
                          <button onClick={() => fileInputRef.current?.click()} className="bg-slate-900 p-2 rounded-lg shadow-sm text-white hover:bg-slate-800 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg></button>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCustomAvatar} />
                    </div>
                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Group Name</label>
                        <input 
                          disabled={!isAdmin}
                          type="text" 
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:border-slate-400 outline-none transition-all bg-slate-50/30 disabled:opacity-50"
                        />
                      </div>
                      <div className="flex justify-end">
                        {isAdmin ? (
                          <button onClick={handleSaveProfile} className="bg-slate-900 text-white px-8 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm">Save Changes</button>
                        ) : (
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Managed by Admins</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Invite Code</p>
                      <p className="text-2xl font-bold text-slate-900 tracking-widest">{group.joinCode}</p>
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={handleRegenerateCode}
                        className="p-2 bg-white text-slate-400 hover:text-slate-900 rounded-lg border border-slate-200 shadow-sm transition-all"
                        title="Reset Code"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeSubTab === 'members' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <section className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200">
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Member Directory</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {groupMembers.map(member => {
                    const isMemberAdmin = group.adminIds.includes(member.id);
                    const isYou = member.id === currentUser.id;
                    return (
                      <div key={member.id} className="p-5 flex items-center justify-between group/row hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <img src={member.avatar} className="w-10 h-10 rounded-xl border border-slate-100 object-cover bg-slate-50" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900">{member.name}</p>
                              {isYou && <span className="text-[7px] font-bold text-white bg-slate-400 px-1.5 py-0.5 rounded-md uppercase tracking-widest">You</span>}
                              {isMemberAdmin && <span className="text-[7px] font-bold text-white bg-amber-500 px-1.5 py-0.5 rounded-md uppercase tracking-widest">Admin</span>}
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{member.status}</p>
                          </div>
                        </div>

                        {isAdmin && !isYou && (
                          <div className="flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <button 
                              onClick={() => toggleAdmin(member.id)}
                              className={`px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-widest border transition-all ${isMemberAdmin ? 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50' : 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'}`}
                            >
                              {isMemberAdmin ? 'Demote' : 'Promote'}
                            </button>
                            <button 
                              onClick={() => kickMember(member.id)}
                              className="p-1.5 bg-white border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Remove Member"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {activeSubTab === 'media' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {mediaMessages.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center">
                   <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 mb-3">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </div>
                   <p className="text-sm font-bold text-slate-400">Library is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mediaMessages.map(m => {
                    const url = m.metadata?.fileUrl || m.metadata?.preview?.url;
                    const type = m.metadata?.preview?.type || 'file';
                    
                    return (
                      <div key={m.id} className="aspect-square bg-slate-50 rounded-xl overflow-hidden group relative border border-slate-200 transition-all hover:border-slate-400 shadow-sm">
                        {type === 'image' ? (
                          <img src={url} className="w-full h-full object-cover" />
                        ) : type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900">
                             <svg className="w-8 h-8 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                          <p className="text-[8px] font-bold text-white uppercase tracking-widest line-clamp-2">{m.metadata?.fileName || 'Asset'}</p>
                          <a href={url} download target="_blank" rel="noreferrer" className="mt-2 text-[7px] font-bold text-slate-300 uppercase tracking-widest hover:underline">Download</a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'actions' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <section className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                 <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200">
                   <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Management</h3>
                 </div>
                 <div className="p-6 space-y-5">
                   {/* Clear Conversation */}
                   <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-slate-100 rounded-xl gap-4 bg-slate-50/20">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Clear Chat</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">Remove all messages for your account.</p>
                      </div>
                      <button 
                        onClick={() => { if(confirm("Clear chat history?")) onClearChat(); }}
                        className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors whitespace-nowrap shadow-sm"
                      >
                        Clear Chat
                      </button>
                   </div>

                   {/* Leave Group */}
                   <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-orange-100 rounded-xl gap-4 bg-orange-50/20">
                      <div>
                        <p className="font-bold text-orange-900 text-sm">Leave Group</p>
                        <p className="text-[10px] text-orange-600/70 font-medium leading-relaxed mt-1">Exit the group. You will need a new invite to return.</p>
                      </div>
                      <button 
                        onClick={() => { if(confirm("Leave this group?")) onExitGroup(); }}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-colors whitespace-nowrap shadow-sm"
                      >
                        Leave Group
                      </button>
                   </div>

                   {/* Permanently Delete */}
                   {isAdmin && (
                     <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-red-100 rounded-xl gap-4 bg-red-50/20">
                        <div>
                          <p className="font-bold text-red-900 text-sm">Delete Group</p>
                          <p className="text-[10px] text-red-600/70 font-medium leading-relaxed mt-1">Permanently remove this group for all members.</p>
                        </div>
                        <button 
                          onClick={() => { if(confirm("Permanently delete group for everyone?")) onDeleteGroup(); }}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors whitespace-nowrap shadow-sm"
                        >
                          Delete Group
                        </button>
                     </div>
                   )}
                 </div>
               </section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GroupDetailSettings;