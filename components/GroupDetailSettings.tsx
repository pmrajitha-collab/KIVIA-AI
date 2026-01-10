
import React, { useState, useMemo } from 'react';
import { Group, Message } from '../types';
import Logo from './Logo';

interface GroupDetailSettingsProps {
  group: Group;
  messages: Message[];
  onUpdateGroup: (updated: Partial<Group>) => void;
  onClearChat: () => void;
  onExitGroup: () => void;
  onDeleteGroup: () => void;
  onBack: () => void;
}

const GroupDetailSettings: React.FC<GroupDetailSettingsProps> = ({
  group,
  messages,
  onUpdateGroup,
  onClearChat,
  onExitGroup,
  onDeleteGroup,
  onBack
}) => {
  const [name, setName] = useState(group.name);
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'media' | 'actions'>('info');

  const mediaMessages = useMemo(() => {
    return messages.filter(m => 
      m.type === 'file' || 
      (m.metadata?.preview && (m.metadata.preview.type === 'image' || m.metadata.preview.type === 'video'))
    );
  }, [messages]);

  const handleUpdateName = () => {
    if (name.trim() && name !== group.name) {
      onUpdateGroup({ name });
      alert("Squad name updated successfully!");
    }
  };

  const handleRegenerateCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    onUpdateGroup({ joinCode: newCode });
    alert(`New Squad ID generated: ${newCode}`);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/20 overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-gray-100 bg-white flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white hover:bg-gray-100 rounded-2xl shadow-sm border border-gray-100 transition-all text-gray-400 hover:text-indigo-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Management Console</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{group.name}</h2>
          </div>
        </div>
        <Logo className="w-12 h-12 opacity-80" />
      </div>

      {/* Sub Navigation */}
      <div className="px-8 pt-4 bg-white border-b border-gray-100 flex gap-8">
        {[
          { id: 'info', label: 'Overview' },
          { id: 'media', label: `Library (${mediaMessages.length})` },
          { id: 'actions', label: 'Actions' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeSubTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
            {activeSubTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8">
          
          {activeSubTab === 'info' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Squad Display Name</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="flex-1 bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all"
                    />
                    <button 
                      onClick={handleUpdateName}
                      className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100"
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Invite Code</p>
                      <p className="text-3xl font-black text-indigo-600 tracking-[0.2em]">{group.joinCode}</p>
                    </div>
                    <button 
                      onClick={handleRegenerateCode}
                      className="p-3 bg-white text-gray-400 hover:text-indigo-600 rounded-xl shadow-sm border border-transparent hover:border-indigo-100 transition-all"
                      title="Generate New Code"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="p-6 bg-white border border-gray-100 rounded-[2rem] text-center">
                     <p className="text-3xl font-black text-gray-900 mb-1">{group.memberIds.length}</p>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Peers</p>
                   </div>
                   <div className="p-6 bg-white border border-gray-100 rounded-[2rem] text-center">
                     <p className="text-3xl font-black text-gray-900 mb-1">{messages.length}</p>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Messages Sent</p>
                   </div>
                </div>
              </section>
            </div>
          )}

          {activeSubTab === 'media' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {mediaMessages.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-200 text-center flex flex-col items-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </div>
                   <p className="font-bold text-gray-400">Library is currently empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-20">
                  {mediaMessages.map(m => {
                    const url = m.metadata?.fileUrl || m.metadata?.preview?.url;
                    const type = m.metadata?.preview?.type || 'file';
                    
                    return (
                      <div key={m.id} className="aspect-square bg-gray-100 rounded-[1.5rem] overflow-hidden group relative border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        {type === 'image' ? (
                          <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        ) : type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-black">
                             <svg className="w-10 h-10 text-white opacity-60" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white">
                            <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest text-center line-clamp-2">{m.metadata?.fileName || 'Asset Preview'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'actions' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Danger Zone</h3>
               
               <section className="bg-white p-8 rounded-[2.5rem] border border-red-100 shadow-sm space-y-6">
                 {/* Clear Conversation */}
                 <div className="flex items-center justify-between p-6 bg-orange-50/50 rounded-3xl border border-orange-100 transition-all hover:bg-orange-50">
                    <div className="max-w-[70%]">
                      <p className="font-black text-orange-900 text-sm mb-1 uppercase tracking-tight">Clear Conversation</p>
                      <p className="text-[10px] text-orange-600/70 font-medium leading-relaxed">Instantly purge all messages within this squad. This action is local to your view and cannot be reversed.</p>
                    </div>
                    <button 
                      onClick={() => { if(confirm("Are you sure you want to clear the entire chat history for this squad? This cannot be undone.")) onClearChat(); }}
                      className="px-6 py-3 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-orange-200 transition-all hover:bg-orange-700 active:scale-95"
                    >
                      Clear
                    </button>
                 </div>

                 {/* Leave Squad */}
                 <div className="flex items-center justify-between p-6 bg-red-50/50 rounded-3xl border border-red-100 transition-all hover:bg-red-50">
                    <div className="max-w-[70%]">
                      <p className="font-black text-red-900 text-sm mb-1 uppercase tracking-tight">Leave Study Squad</p>
                      <p className="text-[10px] text-red-600/70 font-medium leading-relaxed">Remove yourself from this collaborative space. You will lose access to all shared resources and discussions.</p>
                    </div>
                    <button 
                      onClick={() => { if(confirm("Are you sure you want to leave this study squad? You will need a new invite code to re-join.")) onExitGroup(); }}
                      className="px-6 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-red-200 transition-all hover:bg-red-700 active:scale-95"
                    >
                      Exit
                    </button>
                 </div>

                 {/* Permanently Delete */}
                 <div className="flex items-center justify-between p-6 bg-gray-900 rounded-[2rem] shadow-2xl relative overflow-hidden group/delete">
                    <div className="absolute inset-0 bg-red-600 opacity-0 group-hover/delete:opacity-10 transition-opacity"></div>
                    <div className="max-w-[70%] relative z-10">
                      <p className="font-black text-white text-sm mb-1 uppercase tracking-tight">Permanently Delete</p>
                      <p className="text-[10px] text-gray-400 font-medium leading-relaxed">The ultimate action. Purge this squad, its notebook, its history, and all member access from the platform forever.</p>
                    </div>
                    <button 
                      onClick={() => { if(confirm("CRITICAL WARNING: This will permanently delete the study group and all its data for EVERY member. There is no recovery. Proceed with deletion?")) onDeleteGroup(); }}
                      className="px-6 py-3 bg-white text-gray-900 rounded-2xl text-[10px] font-black uppercase transition-all hover:bg-red-600 hover:text-white active:scale-95 relative z-10"
                    >
                      Purge Squad
                    </button>
                 </div>
               </section>
               
               <div className="text-center pt-4">
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">KIVIA System Management • V3.1.2</p>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GroupDetailSettings;
