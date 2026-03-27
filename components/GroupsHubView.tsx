
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  UserPlus, 
  ChevronLeft, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  LogOut, 
  MessageSquareX,
  Copy,
  Check,
  Hash
} from 'lucide-react';
import { Group } from '../types';
import Logo from './Logo';

interface GroupsHubViewProps {
  groups: Group[];
  currentUserId: string;
  onEditGroup: (groupId: string, updated: Partial<Group>) => void;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredGroups = useMemo(() => {
    return groups.filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.joinCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups, searchQuery]);

  const startEdit = (group: Group) => {
    setEditingId(group.id);
    setEditName(group.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onEditGroup(editingId, { name: editName });
      setEditingId(null);
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50/30 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack} 
              className="p-3 bg-white hover:bg-slate-50 rounded-xl shadow-sm border border-slate-100 transition-all text-slate-400 hover:text-slate-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Study Groups</h2>
              <p className="text-sm text-slate-500 font-medium">Manage your collaborative learning spaces.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onJoinGroup} 
              className="flex-1 md:flex-none px-5 py-3 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all shadow-sm"
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span>Join Group</span>
              </div>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateGroup} 
              className="flex-1 md:flex-none px-5 py-3 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-slate-800 transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Create New</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search groups by name or code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-xl pl-12 pr-6 py-4 text-sm focus:bg-white focus:border-slate-300 outline-none transition-all font-medium shadow-sm"
          />
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          <AnimatePresence mode="popLayout">
            {filteredGroups.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full py-24 text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No groups found</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  {searchQuery ? "We couldn't find any groups matching your search." : "You haven't joined any study groups yet. Start by creating one!"}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-slate-900 font-bold text-sm hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            ) : (
              filteredGroups.map((group, index) => (
                <motion.div 
                  key={group.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all flex flex-col h-full relative overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                        {group.avatar ? (
                          <img src={group.avatar} alt={group.name} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <Users className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <Hash className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-600">{group.joinCode}</span>
                        <button 
                          onClick={() => copyToClipboard(group.joinCode, group.id)}
                          className="ml-1 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          {copiedId === group.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      {editingId === group.id ? (
                        <div className="flex gap-2">
                          <input 
                            autoFocus
                            type="text" 
                            value={editName} 
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:bg-white outline-none transition-all"
                          />
                          <button onClick={saveEdit} className="p-2 bg-slate-900 text-white rounded-lg shadow-sm">
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-900 transition-colors line-clamp-1">{group.name}</h3>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex -space-x-2">
                          {group.memberIds.slice(0, 3).map((mid, i) => (
                            <div key={mid} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                              <div className="w-full h-full rounded-full bg-slate-200" />
                            </div>
                          ))}
                          {group.memberIds.length > 3 && (
                            <div className="w-5 h-5 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-bold text-slate-400">
                              +{group.memberIds.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {group.memberIds.length} {group.memberIds.length === 1 ? 'Member' : 'Members'}
                        </span>
                      </div>
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button 
                        onClick={() => startEdit(group)}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Rename</span>
                      </button>
                      <button 
                        onClick={() => { if(confirm("Clear all messages in this chat?")) onClearChat(group.id); }}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                      >
                        <MessageSquareX className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                      <button 
                        onClick={() => { if(confirm("Leave this group?")) onExitGroup(group.id); }}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-red-50 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Leave</span>
                      </button>
                      <button 
                        onClick={() => { if(confirm("Permanently delete this group?")) onDeleteGroup(group.id); }}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 bg-red-50 hover:bg-red-600 rounded-lg text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-white transition-all border border-red-100 hover:border-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GroupsHubView;
