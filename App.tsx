import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, Group, Message, AppTab, SmartNote, Flashcard, VideoSession, ScheduledSession, StudyRoutine, Post, Alarm, PlannerTask } from './types';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import VideoView from './components/VideoView';
import NotebookView from './components/NotebookView';
import FlashcardsView from './components/FlashcardsView';
import FlashcardGeneratorView from './components/FlashcardGeneratorView';
import AIChatView from './components/AIChatView';
import ScheduleView from './components/ScheduleView';
import SARAPanel from './components/SARAPanel';
import Auth from './components/Auth';
import VideoCall from './components/VideoCall';
import Logo from './components/Logo';
import SettingsModal, { SettingsTab } from './components/SettingsModal';
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';
import GroupsHubView from './components/GroupsHubView';
import ProfileHubView from './components/ProfileHubView';
import PlannerView from './components/PlannerView';
import GroupDetailSettings from './components/GroupDetailSettings';
import { generateFlashcards } from './services/gemini';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<SmartNote[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [videos, setVideos] = useState<VideoSession[]>([]);
  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([]);
  const [studyRoutines, setStudyRoutines] = useState<StudyRoutine[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [plannerTasks, setPlannerTasks] = useState<PlannerTask[]>([]);
  const [isSARAOpen, setIsSARAOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const deferredPrompt = useRef<any>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  
  // Modals state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState<'create' | 'join' | null>(null);
  const [settingsModal, setSettingsModal] = useState<{ isOpen: boolean; tab: SettingsTab }>({ isOpen: false, tab: SettingsTab.PROFILE });
  const [groupInput, setGroupInput] = useState('');

  // Load Initial Data
  useEffect(() => {
    const savedUser = localStorage.getItem('kivia_current_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    setGroups(JSON.parse(localStorage.getItem('kivia_groups') || '[]'));
    setMessages(JSON.parse(localStorage.getItem('kivia_messages') || '[]'));
    setNotes(JSON.parse(localStorage.getItem('kivia_notes') || '[]'));
    setFlashcards(JSON.parse(localStorage.getItem('kivia_flashcards') || '[]'));
    setVideos(JSON.parse(localStorage.getItem('kivia_videos') || '[]'));
    setScheduledSessions(JSON.parse(localStorage.getItem('kivia_schedules') || '[]'));
    setStudyRoutines(JSON.parse(localStorage.getItem('kivia_routines') || '[]'));
    setAllUsers(JSON.parse(localStorage.getItem('kivia_users') || '[]'));
    setPosts(JSON.parse(localStorage.getItem('kivia_posts') || '[]'));
    setAlarms(JSON.parse(localStorage.getItem('kivia_alarms') || '[]'));
    setPlannerTasks(JSON.parse(localStorage.getItem('kivia_planner_tasks') || '[]'));
    
    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      deferredPrompt.current = e;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('hashchange', handleHashRouting);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Trigger PWA install for specific user
  useEffect(() => {
    if (currentUser?.name === 'kotoamatsukamiguy' && deferredPrompt.current) {
      deferredPrompt.current.prompt();
      deferredPrompt.current.userChoice.then(() => {
        deferredPrompt.current = null;
      });
    }
  }, [currentUser]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('kivia_groups', JSON.stringify(groups));
    localStorage.setItem('kivia_messages', JSON.stringify(messages));
    localStorage.setItem('kivia_notes', JSON.stringify(notes));
    localStorage.setItem('kivia_flashcards', JSON.stringify(flashcards));
    localStorage.setItem('kivia_videos', JSON.stringify(videos));
    localStorage.setItem('kivia_schedules', JSON.stringify(scheduledSessions));
    localStorage.setItem('kivia_routines', JSON.stringify(studyRoutines));
    localStorage.setItem('kivia_users', JSON.stringify(allUsers));
    localStorage.setItem('kivia_posts', JSON.stringify(posts));
    localStorage.setItem('kivia_alarms', JSON.stringify(alarms));
    localStorage.setItem('kivia_planner_tasks', JSON.stringify(plannerTasks));
    if (currentUser) localStorage.setItem('kivia_current_user', JSON.stringify(currentUser));
  }, [groups, messages, notes, flashcards, videos, scheduledSessions, studyRoutines, allUsers, posts, alarms, plannerTasks, currentUser]);

  const handleHashRouting = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#join-')) {
      const code = hash.replace('#join-', '');
      handleJoinByCode(code);
    } else if (hash.startsWith('#call-')) {
      if (!activeGroupId && groups.length > 0) {
        setActiveGroupId(groups[0].id);
      }
      setIsCalling(true);
      window.location.hash = ''; 
    }
  };

  const handleJoinByCode = (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;
    const existing = groups.find(g => g.joinCode === cleanCode);
    if (existing) {
      if (!existing.memberIds.includes(currentUser!.id)) {
        setGroups(prev => prev.map(g => g.id === existing.id ? { ...g, memberIds: [...g.memberIds, currentUser!.id] } : g));
      }
      setActiveGroupId(existing.id);
      setActiveTab(AppTab.CHAT);
      setIsGroupModalOpen(null);
      setGroupInput('');
      return;
    }
    // Note: In a real app we'd fetch the group from a DB. Locally we create it if it doesn't exist.
    const newGroup: Group = {
      id: Date.now().toString(),
      name: `Peer Session #${cleanCode.slice(-4)}`,
      joinCode: cleanCode,
      memberIds: [currentUser?.id || 'anon'],
      adminIds: [currentUser?.id || 'anon'],
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanCode}`,
      createdAt: new Date().toISOString(),
      lastMessage: 'You joined via a peer link'
    };
    setGroups(prev => [...prev, newGroup]);
    setActiveGroupId(newGroup.id);
    setActiveTab(AppTab.CHAT);
    setIsGroupModalOpen(null);
    setGroupInput('');
    window.location.hash = '';
  };

  const handleCreateGroup = () => {
    if (!groupInput.trim()) return;
    const joinCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupInput,
      joinCode,
      memberIds: [currentUser!.id],
      adminIds: [currentUser!.id],
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${joinCode}`,
      createdAt: new Date().toISOString(),
      lastMessage: 'Group created'
    };
    setGroups([...groups, newGroup]);
    setActiveGroupId(newGroup.id);
    setActiveTab(AppTab.CHAT);
    setIsGroupModalOpen(null);
    setGroupInput('');
  };

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updatedUser };
    setCurrentUser(newUser);
    setAllUsers(allUsers.map(u => u.id === newUser.id ? newUser : u));
  };

  const handleUpdateGroup = (groupId: string, updatedGroup: Partial<Group>) => {
    setGroups(groups.map(g => g.id === groupId ? { ...g, ...updatedGroup } : g));
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(g => g.id !== groupId));
    setMessages(messages.filter(m => m.metadata?.groupId !== groupId));
    if (activeGroupId === groupId) {
      setActiveGroupId(null);
      setActiveTab(AppTab.HOME);
    }
  };

  const handleClearChat = (groupId: string) => {
    setMessages(messages.filter(m => m.metadata?.groupId !== groupId));
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, lastMessage: 'Chat cleared' } : g));
  };

  const handleExitGroup = (groupId: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { 
      ...g, 
      memberIds: g.memberIds.filter(id => id !== currentUser!.id),
      adminIds: g.adminIds.filter(id => id !== currentUser!.id)
    } : g).filter(g => g.memberIds.length > 0));
    
    if (activeGroupId === groupId) {
      setActiveGroupId(null);
      setActiveTab(AppTab.HOME);
    }
  };

  const handleSendMessage = (text: string, type: Message['type'] = 'text', metadata: any = {}) => {
    const gid = metadata.groupId || activeGroupId;
    if (!gid) return;
    
    const messageId = Date.now().toString();
    const newMessage: Message = {
      id: messageId,
      senderId: currentUser!.id,
      senderName: currentUser!.name,
      text,
      timestamp: new Date().toISOString(),
      type,
      status: 'sent',
      metadata: { ...metadata, groupId: gid }
    };
    
    setMessages(prev => [...prev, newMessage]);
    setGroups(prev => prev.map(g => g.id === gid ? { ...g, lastMessage: type === 'text' ? text : `[${type}]` } : g));

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'read' as const } : m));
    }, 1500);
  };

  const handleSharePostToGroup = (post: Post, groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    let shareText = `Check out this breakthrough from @${post.authorName}: ${post.content}`;
    let preview = undefined;
    if (post.type !== 'text' && post.mediaUrl) {
      preview = { type: post.type as 'image' | 'video', url: post.mediaUrl, title: `Post by ${post.authorName}` };
    }
    handleSendMessage(shareText, 'text', { groupId, preview });
    alert(`Post shared to ${group.name}!`);
  };

  const handleShareVideoToGroup = (video: VideoSession, groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const shareText = `Study Session: ${video.title}\nSummary: ${video.summary}`;
    const preview = { type: 'video' as const, url: video.url, title: video.title };
    handleSendMessage(shareText, 'text', { groupId, preview });
    alert(`Video session shared to ${group.name}!`);
  };

  const handleAddPost = (content: string, type: 'text' | 'image' | 'video', mediaUrl?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: currentUser!.id,
      authorName: currentUser!.name,
      authorAvatar: currentUser!.avatar,
      content, type, mediaUrl, timestamp: new Date().toISOString(), likes: []
    };
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likes.includes(currentUser!.id);
        return { ...p, likes: hasLiked ? p.likes.filter(id => id !== currentUser!.id) : [...p.likes, currentUser!.id] };
      }
      return p;
    }));
  };

  const handleGenerateFlashcards = async () => {
    if (!activeGroupId) return;
    const groupNotes = notes.filter(n => n.groupId === activeGroupId);
    if (groupNotes.length === 0) {
      alert("No notes found for this group. SARA needs some content to generate cards!");
      return;
    }

    setIsGeneratingFlashcards(true);
    const notebookStr = groupNotes.map(n => `Title: ${n.title}\nContent: ${n.content}`).join('\n\n');
    
    try {
      const newCards = await generateFlashcards(notebookStr);
      const formattedCards: Flashcard[] = newCards.map((c: any) => ({
        ...c,
        id: Date.now().toString() + Math.random(),
        groupId: activeGroupId
      }));
      
      setFlashcards(prev => [
        ...prev.filter(fc => fc.groupId !== activeGroupId),
        ...formattedCards
      ]);
      
      alert(`SARA successfully generated ${formattedCards.length} flashcards!`);
    } catch (err: any) {
      console.error(err);
      alert("Flashcard generation failed. Please check your connection or try again later.");
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  const handleBack = () => {
    if (activeTab === AppTab.HOME) {
      setActiveGroupId(null);
    } else {
      setActiveTab(AppTab.HOME);
    }
  };

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;
  const filteredMessages = messages.filter(m => m.metadata?.groupId === activeGroupId);
  const activeGroupFlashcards = flashcards.filter(fc => fc.groupId === activeGroupId);

  if (!currentUser) {
    return <Auth onLogin={(user) => {
      setCurrentUser(user);
      localStorage.setItem('kivia_current_user', JSON.stringify(user));
    }} />;
  }

  return (
    <div className="flex h-screen bg-white font-['Inter'] selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      <div className={`fixed inset-0 z-[100] md:relative md:flex md:w-72 md:z-0 transition-all duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="relative w-72 h-full border-r border-gray-100 bg-white">
          <Sidebar 
            groups={groups} 
            activeGroupId={activeGroupId} 
            onGroupSelect={(id) => { setActiveGroupId(id); setActiveTab(AppTab.CHAT); setIsSidebarOpen(false); }} 
            onGroupSettingsSelect={(id) => { setActiveGroupId(id); setActiveTab(AppTab.GROUP_SETTINGS); setIsSidebarOpen(false); }}
            currentUser={currentUser}
            onLogout={() => { setCurrentUser(null); localStorage.removeItem('kivia_current_user'); }}
            onCreateGroup={() => { setIsGroupModalOpen('create'); setIsSidebarOpen(false); }}
            activeTab={activeTab}
            setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
            onShareGroupLink={(g) => {
              const link = `${window.location.origin}${window.location.pathname}#join-${g.joinCode}`;
              navigator.clipboard.writeText(link);
              alert(`Join Link Copied: ${g.name}`);
            }}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
      </div>

      <main className="flex-1 flex flex-col min-w-0 bg-white relative h-full">
        <header className="flex items-center justify-between px-8 py-5 border-b border-gray-100 glass sticky top-0 z-30 gap-6">
          <div className="flex items-center gap-5 flex-shrink-0">
            <Logo className="w-10 h-10 shadow-lg shadow-green-100 rounded-full cursor-pointer hover:scale-110 transition-transform md:hidden" onClick={() => { setActiveGroupId(null); setActiveTab(AppTab.HOME); }} />
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">
                {activeTab === AppTab.HOME ? 'Feed' : 
                 activeTab === AppTab.CHAT ? 'Chat' : 
                 activeTab === AppTab.VIDEO ? 'Video Hub' : 
                 activeTab === AppTab.NOTEBOOK ? 'Notebook' : 
                 activeTab === AppTab.FLASHCARDS ? 'Flashcards' :
                 activeTab === AppTab.FLASHCARD_GEN ? 'Flashcard Generator' :
                 activeTab === AppTab.AI_CHAT ? 'SARA' :
                 activeTab === AppTab.SCHEDULE ? 'Schedule' : 
                 activeTab === AppTab.PLANNER ? 'Planner' : 
                 activeTab === AppTab.GROUP_SETTINGS ? 'Group Settings' :
                 activeTab === AppTab.GROUPS_HUB ? 'Groups' : 'Profile'}
              </h1>
              <div className="flex items-center gap-2">
                {activeTab === AppTab.GROUP_SETTINGS ? (
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Settings & Media</span>
                ) : activeGroup && (activeTab === AppTab.CHAT || activeTab === AppTab.VIDEO || activeTab === AppTab.NOTEBOOK || activeTab === AppTab.FLASHCARDS || activeTab === AppTab.SCHEDULE) ? (
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <span onClick={() => setActiveTab(AppTab.CHAT)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest truncate max-w-[120px]">{activeGroup.name}</span>
                    <span className="text-[9px] font-bold text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">ID: {activeGroup.joinCode}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveTab(AppTab.GROUP_SETTINGS); }}
                      className="ml-1.5 p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all"
                      title="Group Settings"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">KIVIA Community</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-sm relative mx-4 hidden lg:block">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input type="text" placeholder="Search peers, messages, notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] pl-14 pr-6 py-2.5 text-sm focus:bg-white focus:border-indigo-100 outline-none transition-all font-medium" />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className={`p-3 rounded-full transition-all duration-300 flex items-center gap-2 border bg-white text-indigo-600 hover:bg-gray-50 border-indigo-100 shadow-sm md:hidden`}>
              <div className="relative flex h-3 w-3"><span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-indigo-400`}></span><span className={`relative inline-flex rounded-full h-3 w-3 bg-indigo-600`}></span></div>
            </button>
            <button onClick={() => setIsSARAOpen(!isSARAOpen)} className={`p-3 rounded-xl transition-all duration-300 border flex items-center justify-center ${isSARAOpen ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-gray-50 text-gray-400 hover:text-indigo-600 border-transparent hover:border-indigo-100'}`} title="SARA AI">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          </div>
        </header>

        <div className={`flex-1 overflow-hidden relative ${activeGroupId ? 'bg-slate-50/50' : ''}`}>
          {searchQuery ? (
            <SearchView query={searchQuery} users={allUsers} messages={messages} notes={notes} videos={videos} groups={groups} onNavigate={(gid, tab) => { setActiveGroupId(gid); setActiveTab(tab); setSearchQuery(''); }} onClose={() => setSearchQuery('')} />
          ) : activeTab === AppTab.HOME ? (
            <HomeView currentUser={currentUser} posts={posts} groups={groups} onAddPost={handleAddPost} onLikePost={handleLikePost} onSharePostToGroup={handleSharePostToGroup} />
          ) : activeTab === AppTab.AI_CHAT ? (
            <AIChatView onBack={handleBack} context={notes.slice(-5).map(n => n.content).join(' ')} />
          ) : activeTab === AppTab.GROUPS_HUB ? (
            <GroupsHubView groups={groups} currentUserId={currentUser.id} onEditGroup={handleUpdateGroup} onClearChat={handleClearChat} onExitGroup={handleExitGroup} onDeleteGroup={handleDeleteGroup} onJoinGroup={() => setSettingsModal({ isOpen: true, tab: SettingsTab.JOIN })} onCreateGroup={() => setIsGroupModalOpen('create')} onBack={handleBack} />
          ) : activeTab === AppTab.PROFILE_HUB ? (
            <ProfileHubView user={currentUser} onUpdateUser={handleUpdateUser} onLogout={() => { setCurrentUser(null); localStorage.removeItem('kivia_current_user'); }} onBack={handleBack} />
          ) : activeTab === AppTab.PLANNER ? (
            <PlannerView alarms={alarms} tasks={plannerTasks} onAddAlarm={(a) => setAlarms([...alarms, { ...a, id: Date.now().toString() }])} onToggleAlarm={(id) => setAlarms(alarms.map(a => a.id === id ? { ...a, isEnabled: !a.isEnabled } : a))} onDeleteAlarm={(id) => setAlarms(alarms.filter(a => a.id !== id))} onAddTask={(t) => setPlannerTasks([...plannerTasks, { ...t, id: Date.now().toString() }])} onUpdateTasks={(t) => setPlannerTasks(t)} onDeleteTask={(id) => setPlannerTasks(plannerTasks.filter(t => t.id !== id))} onBack={handleBack} />
          ) : activeTab === AppTab.GROUP_SETTINGS && activeGroup ? (
            <GroupDetailSettings group={activeGroup} messages={messages.filter(m => m.metadata?.groupId === activeGroup.id)} allUsers={allUsers} currentUser={currentUser} onUpdateGroup={(updated) => handleUpdateGroup(activeGroup.id, updated)} onClearChat={() => handleClearChat(activeGroup.id)} onExitGroup={() => handleExitGroup(activeGroup.id)} onDeleteGroup={() => handleDeleteGroup(activeGroup.id)} onBack={() => setActiveTab(AppTab.CHAT)} />
          ) : !activeGroupId ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 animate-in fade-in duration-700">
              <Logo className="w-24 h-24 mb-8 text-slate-900" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Collaborative Learning Platform</h2>
              <p className="text-slate-500 max-w-md font-normal text-base mb-10">Connect with peers, manage your schedule, and leverage AI to enhance your study workflow.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => setIsGroupModalOpen('create')} className="bg-slate-900 text-white px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-slate-800 transition-all shadow-sm">Create Study Group</button>
                <button onClick={() => setSettingsModal({ isOpen: true, tab: SettingsTab.JOIN })} className="bg-white border border-slate-200 text-slate-600 px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm">Join Session</button>
              </div>
            </div>
          ) : (
            <div className="h-full">
              {activeTab === AppTab.CHAT && <ChatView currentUser={currentUser} messages={filteredMessages} onSendMessage={handleSendMessage} allUsers={allUsers} activeGroup={activeGroup} />}
              {activeTab === AppTab.VIDEO && <VideoView videos={videos.filter(v => v.groupId === activeGroupId)} groups={groups} onShareVideoToGroup={handleShareVideoToGroup} onAddVideo={(t, u, s, d, th) => setVideos([...videos, { id: Date.now().toString(), groupId: activeGroupId, title: t, url: u, summary: s, duration: d, thumbnail: th, sharedByName: currentUser.name, recordedAt: new Date().toISOString() }])} onBack={handleBack} />}
              {activeTab === AppTab.NOTEBOOK && <NotebookView notes={notes.filter(n => n.groupId === activeGroupId)} onBack={handleBack} />}
              {activeTab === AppTab.FLASHCARDS && <FlashcardsView flashcards={activeGroupFlashcards} onGenerate={() => setActiveTab(AppTab.FLASHCARD_GEN)} isGenerating={isGeneratingFlashcards} onBack={handleBack} />}
              {activeTab === AppTab.FLASHCARD_GEN && <FlashcardGeneratorView groupId={activeGroupId || ''} onBack={() => setActiveTab(AppTab.FLASHCARDS)} onCardsGenerated={(newCards) => setFlashcards(prev => [...prev, ...newCards])} />}
              {activeTab === AppTab.SCHEDULE && <ScheduleView groupId={activeGroupId} sessions={scheduledSessions.filter(s => s.groupId === activeGroupId)} routines={studyRoutines.filter(r => r.groupId === activeGroupId)} onAddSession={(s) => setScheduledSessions([...scheduledSessions, { ...s, id: Date.now().toString(), groupId: activeGroupId }])} onAddRoutine={(r) => setStudyRoutines([...studyRoutines, { ...r, id: Date.now().toString(), groupId: activeGroupId }])} onRemoveSession={(id) => setScheduledSessions(scheduledSessions.filter(s => s.id !== id))} onRemoveRoutine={(id) => setStudyRoutines(studyRoutines.filter(r => r.id !== id))} onBack={handleBack} />}
            </div>
          )}
          {isSARAOpen && activeGroupId && (
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white border-l border-gray-100 transform transition-all duration-500 shadow-2xl z-50 animate-in slide-in-from-right-full">
              <SARAPanel onClose={() => setIsSARAOpen(false)} messages={filteredMessages} notes={notes.filter(n => n.groupId === activeGroupId)} videos={videos.filter(v => v.groupId === activeGroupId)} onAiResponse={(msg) => handleSendMessage(msg.text, 'ai')} onNewNote={(note) => setNotes([...notes, { ...note, groupId: activeGroupId || '' }])} activeGroupId={activeGroupId || ''} />
            </div>
          )}
        </div>
      </main>

      {settingsModal.isOpen && (
        <SettingsModal 
          user={currentUser} 
          activeGroup={activeGroup} 
          initialTab={settingsModal.tab} 
          onClose={() => setSettingsModal({ ...settingsModal, isOpen: false })} 
          onUpdateUser={handleUpdateUser} 
          onUpdateGroup={(updated) => activeGroup && handleUpdateGroup(activeGroup.id, updated)} 
          onDeleteGroup={() => activeGroup && handleDeleteGroup(activeGroup.id)} 
          onClearChat={() => activeGroup && handleClearChat(activeGroup.id)}
          onExitGroup={() => activeGroup && handleExitGroup(activeGroup.id)}
          onJoinGroup={handleJoinByCode} 
        />
      )}

      {isGroupModalOpen === 'create' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4"><Logo className="w-12 h-12" /><div><h2 className="text-2xl font-black text-gray-900 tracking-tight">Build a Squad</h2><p className="text-sm text-gray-500 font-medium">Start a fresh collaborative space.</p></div></div>
              <button onClick={() => setIsGroupModalOpen(null)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="space-y-6">
              <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Study Group Name</label><input autoFocus type="text" value={groupInput} onChange={(e) => setGroupInput(e.target.value)} placeholder="e.g. Bio 101 Finals Prep" onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()} className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-0 outline-none transition-all font-medium" /></div>
              <button onClick={handleCreateGroup} disabled={!groupInput.trim()} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Create Space</button>
            </div>
          </div>
        </div>
      )}

      {isCalling && activeGroup && (
        <VideoCall onClose={() => setIsCalling(false)} currentUser={currentUser} activeGroup={activeGroup} />
      )}
    </div>
  );
};

export default App;