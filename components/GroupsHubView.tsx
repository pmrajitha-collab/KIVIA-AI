
import React, { useState } from 'react';
import { Group } from '../types';
import Logo from './Logo';

interface GroupsHubViewProps {
  groups: Group[];
  currentUserId: string;
  onEditGroup: (groupId: string, name: string) => void;
  onClearChat: (groupId: string) => void;
  onExitGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onJoinGroup: () => void;
  onCreateGroup: () => void;
  onBack: () => void;
}

const GroupsHubView: React.FC<GroupsHubViewProps> = ({ 
  groups, 
  onEditGroup, 
  onClearChat, 
  onExitGroup, 
  onDeleteGroup,
  onJoinGroup,
  onCreateGroup,
  onBack
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEdit = (group: Group) => {
    setEditingId(group.id);
    setEditName(group.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onEditGroup(editingId, editName);
      setEditingId(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50/20 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-3 bg-white hover:bg-gray-100 rounded-2xl shadow-sm border border-gray-100 transition-all text-gray-400 hover:text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Your Study Squads</h2>
              <p className="text-gray-500 font-medium">Manage and organize your collaborative spaces.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onJoinGroup} className="px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-indigo-100 hover:text-indigo-600 transition-all">Join Group</button>
            <button onClick={onCreateGroup} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Create New</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {groups.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-30 flex flex-col items-center">
              <Logo className="w-16 h-16 mb-4 grayscale" />
              <p className="font-bold">You aren't in any groups yet.</p>
            </div>
          ) : (
            groups.map(group => (
              <div key={group.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    {editingId === group.id ? (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={editName} 
                          onChange={e => setEditName(e.target.value)}
                          className="flex-1 bg-gray-50 border-transparent rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all"
                        />
                        <button onClick={saveEdit} className="p-2 bg-green-500 text-white rounded-xl">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-xl font-black text-gray-900 line-clamp-1">{group.name}</h3>
                    )}
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1">Code: {group.joinCode}</p>
                  </div>
                  <Logo className="w-8 h-8 opacity-10" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-gray-50">
                  <button 
                    onClick={() => startEdit(group)}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 transition-all"
                  >
                    Edit Name
                  </button>
                  <button 
                    onClick={() => { if(confirm("Clear all messages in this chat?")) onClearChat(group.id); }}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 hover:bg-orange-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-orange-600 transition-all"
                  >
                    Clear Chat
                  </button>
                  <button 
                    onClick={() => { if(confirm("Leave this group?")) onExitGroup(group.id); }}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 hover:bg-red-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 transition-all"
                  >
                    Exit Group
                  </button>
                  <button 
                    onClick={() => { if(confirm("Permanently delete this group and all its data?")) onDeleteGroup(group.id); }}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupsHubView;
