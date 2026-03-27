import React, { useState, useRef, useEffect } from 'react';
import { Message, User, Group } from '../types';
import PreviewCard from './PreviewCard';
import Logo from './Logo';

interface ChatViewProps {
  currentUser: User;
  messages: Message[];
  onSendMessage: (text: string, type?: Message['type'], metadata?: any) => void;
  allUsers: User[];
  activeGroup: Group | null;
}

const ChatView: React.FC<ChatViewProps> = ({ currentUser, messages, onSendMessage, allUsers, activeGroup }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    scrollToBottom();
    // Simulate typing when new messages arrive from someone else
    if (messages.length > 0 && messages[messages.length-1].senderId !== currentUser.id) {
      setIsTyping(false);
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollDown(!isAtBottom);
    }
  };

  const detectMessageType = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    if (!match) return null;

    const url = match[0];
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return { type: 'image' as const, url };
    
    // Robust YouTube Detection
    const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    if (url.match(ytRegex)) return { type: 'video' as const, url };
    
    return { type: 'website' as const, url };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const preview = detectMessageType(inputText);
    if (preview) {
      onSendMessage(inputText, 'text', { preview });
    } else {
      onSendMessage(inputText);
    }
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const url = URL.createObjectURL(file);
      if (isImage) {
        onSendMessage(`Shared an image`, 'file', { fileName: file.name, fileUrl: url, preview: { type: 'image', url } });
      } else {
        onSendMessage(`Shared a file: ${file.name}`, 'file', { fileName: file.name, fileUrl: url });
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => e.data.size > 0 && audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendMessage('Voice note sent', 'voice', { fileUrl: audioUrl, duration: recordingDuration, fileName: 'Voice Note.webm' });
        stream.getTracks().forEach(track => track.stop());
        setRecordingDuration(0);
      };
      mediaRecorder.start();
      setIsRecording(true);
      let seconds = 0;
      timerRef.current = window.setInterval(() => { seconds++; setRecordingDuration(seconds); }, 1000);
    } catch (err) {
      alert("Microphone access is required.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const toggleAudio = (id: string) => {
    const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement;
    if (audio) {
      if (audio.paused) {
        if (playingId && playingId !== id) (document.getElementById(`audio-${playingId}`) as HTMLAudioElement)?.pause();
        audio.play();
        setPlayingId(id);
      } else {
        audio.pause();
        setPlayingId(null);
      }
    }
  };

  const groupMembers = allUsers.filter(u => activeGroup?.memberIds.includes(u.id));

  return (
    <div className="flex h-full bg-white relative overflow-hidden">
      {/* Main Chat Content */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-gray-50">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
             <div className="md:hidden">
               <Logo className="w-8 h-8 text-slate-900" />
             </div>
             <div>
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest truncate max-w-[150px] md:max-w-none">{activeGroup?.name}</h3>
               <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">{groupMembers.length} Active</span>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-1">
             <button 
               onClick={() => setShowMembers(!showMembers)}
               className={`p-2 rounded-lg transition-all ${showMembers ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-50'}`}
               title="Group Members"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
             </button>
          </div>
        </div>

        {/* Message Feed */}
        <div 
          ref={scrollRef} 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scroll-smooth bg-slate-50/20"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <Logo className="w-16 h-16 opacity-10 text-slate-900" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Chat Started</h3>
                <p className="text-[10px] text-slate-400 font-semibold max-w-[200px] mx-auto leading-relaxed">
                  Start collaborating with your group members.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.senderId === currentUser.id;
              const sender = allUsers.find(u => u.id === msg.senderId);
              const isAI = msg.type === 'ai';
              const showAvatar = !isMe && (i === 0 || messages[i-1].senderId !== msg.senderId);

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-1 duration-300`}>
                  <div className={`flex max-w-[90%] md:max-w-[75%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {showAvatar && !isAI && (
                      <img src={sender?.avatar} className="w-8 h-8 rounded-lg border border-slate-100 mt-1 flex-shrink-0 object-cover" alt={msg.senderName} />
                    )}
                    {!showAvatar && !isMe && !isAI && <div className="w-8 flex-shrink-0" />}
                    {isAI && (
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center mt-1 flex-shrink-0">
                        <Logo className="w-5 h-5 text-slate-900" />
                      </div>
                    )}
                    <div className="min-w-0">
                      {showAvatar && <div className="text-[8px] font-bold text-slate-400 mb-1 ml-1 uppercase tracking-widest">{msg.senderName}</div>}
                      <div className={`
                        p-3.5 rounded-xl text-sm relative break-words leading-relaxed border shadow-sm
                        ${isMe ? 'bg-slate-900 text-white border-slate-900 rounded-tr-none' : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'}
                        ${isAI ? 'border-slate-200 bg-slate-50/50' : ''}
                      `}>
                        {isAI && (
                          <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-900 mb-2 uppercase tracking-widest border-b border-slate-100 pb-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            AI Assistant
                          </div>
                        )}
                        
                        {msg.type === 'file' && !msg.metadata?.preview ? (
                          <PreviewCard type="file" url={msg.metadata?.fileUrl || '#'} title={msg.metadata?.fileName} />
                        ) : msg.type === 'voice' ? (
                          <div className="flex items-center gap-3 py-1 px-1 min-w-[200px]">
                            <audio className="hidden" id={`audio-${msg.id}`} src={msg.metadata?.fileUrl} onEnded={() => setPlayingId(null)} />
                            <button onClick={() => toggleAudio(msg.id)} className={`${isMe ? 'text-white' : 'text-slate-900'} hover:scale-105 transition-transform`}>
                              {playingId === msg.id ? (
                                 <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" /></svg>
                              ) : (
                                 <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                              )}
                            </button>
                            <div className="flex-1 space-y-1">
                              <div className={`h-1 rounded-full w-full relative overflow-hidden ${isMe ? 'bg-white/20' : 'bg-slate-200'}`}>
                                    <div className={`absolute inset-y-0 left-0 transition-all duration-300 ${isMe ? 'bg-white' : 'bg-slate-900'} ${playingId === msg.id ? 'w-full animate-pulse' : 'w-0'}`}></div>
                              </div>
                              <div className={`flex justify-between items-center text-[7px] font-bold uppercase ${isMe ? 'text-slate-200' : 'text-slate-400'}`}>
                                  <span>0:{msg.metadata?.duration?.toString().padStart(2, '0') || '00'}</span>
                                  <span>VOICE NOTE</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="font-medium">
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.metadata?.preview && (
                              <PreviewCard 
                                type={msg.metadata.preview.type} 
                                url={msg.metadata.preview.url} 
                                title={msg.metadata.preview.title}
                              />
                            )}
                          </div>
                        )}

                        <div className={`text-[8px] mt-2 font-bold uppercase tracking-widest opacity-40 text-right ${isMe ? 'text-white' : 'text-slate-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
               <div className="ml-10 px-4 py-2 bg-slate-100 rounded-xl rounded-tl-none flex gap-1.5 items-center">
                 <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0s]"></div>
                 <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Typing</span>
               </div>
            </div>
          )}
        </div>

        {/* Input Dock */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-white border-t border-slate-100 flex items-center gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </button>
          <div className="flex-1 relative">
            {isRecording ? (
              <div className="w-full bg-red-50 text-red-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center justify-between border border-red-100 animate-pulse">
                 <div className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                   <span className="uppercase tracking-widest text-[9px]">Recording</span>
                 </div>
                 <span className="font-mono text-[10px]">00:{recordingDuration.toString().padStart(2, '0')}</span>
              </div>
            ) : (
              <input
                type="text"
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); if(e.target.value.length === 1) setIsTyping(true); if(e.target.value === '') setIsTyping(false); }}
                placeholder="Message group..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm focus:bg-white focus:border-slate-400 outline-none transition-all font-medium"
              />
            )}
          </div>
          <button 
            type="submit" 
            disabled={!inputText.trim() && !isRecording}
            className={`p-3.5 rounded-xl transition-all shadow-sm active:scale-90 ${isRecording ? 'bg-red-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30'}`}
            onClick={(e) => { if(isRecording) { e.preventDefault(); stopRecording(); } }}
          >
            {isRecording ? (
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" /></svg>
            ) : (
               <svg className="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            )}
          </button>
          {!isRecording && (
            <button type="button" onClick={startRecording} className="p-3 text-slate-400 hover:text-slate-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
          )}
        </form>
      </div>

      {/* Member Directory Sidebar */}
      {showMembers && (
        <aside className="w-64 border-l border-slate-100 bg-white flex flex-col animate-in slide-in-from-right duration-300">
           <div className="p-6 border-b border-slate-100">
             <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4">Group Directory</h4>
             <div className="space-y-4 overflow-y-auto no-scrollbar">
               {groupMembers.map(member => (
                 <div key={member.id} className="flex items-center gap-3 group">
                   <div className="relative">
                     <img src={member.avatar} className="w-9 h-9 rounded-lg border border-slate-100 object-cover" alt={member.name} />
                     <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-green-500' : member.status === 'busy' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                   </div>
                   <div className="min-w-0">
                     <p className="text-xs font-bold text-slate-700 truncate">{member.name}</p>
                     <p className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest">{member.status}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
           <div className="p-6 mt-auto">
             <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest mb-1.5 ml-0.5">Invite Code</p>
                <div className="flex gap-1.5 items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest ml-1">#{activeGroup?.joinCode}</span>
                  <button onClick={() => { navigator.clipboard.writeText(activeGroup?.joinCode || ''); alert("Code Copied"); }} className="p-1 text-slate-900 hover:bg-slate-50 rounded transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
             </div>
           </div>
        </aside>
      )}
    </div>
  );
};

export default ChatView;