
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const detectMessageType = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    if (!match) return null;

    const url = match[0];
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return { type: 'image' as const, url };
    if (url.includes('youtube.com') || url.includes('youtu.be')) return { type: 'video' as const, url };
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

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendMessage('Voice note sent', 'voice', { 
          fileUrl: audioUrl, 
          duration: recordingDuration,
          fileName: 'Voice Note.webm'
        });
        stream.getTracks().forEach(track => track.stop());
        setRecordingDuration(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds++;
        setRecordingDuration(seconds);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required to record voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const toggleAudio = (id: string) => {
    const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement;
    if (audio) {
      if (audio.paused) {
        if (playingId && playingId !== id) {
          const other = document.getElementById(`audio-${playingId}`) as HTMLAudioElement;
          other?.pause();
        }
        audio.play();
        setPlayingId(id);
      } else {
        audio.pause();
        setPlayingId(null);
      }
    }
  };

  const MessageStatus: React.FC<{ status?: 'sent' | 'delivered' | 'read', isMe: boolean }> = ({ status = 'read', isMe }) => {
    if (!isMe) return null;
    return (
      <span className="inline-flex ml-1.5 align-middle">
        {status === 'sent' && (
          <svg className="w-3 h-3 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        )}
        {(status === 'delivered' || status === 'read') && (
          <div className="flex -space-x-1.5">
            <svg className={`w-3 h-3 ${status === 'read' ? 'text-green-300' : 'text-indigo-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            <svg className={`w-3 h-3 ${status === 'read' ? 'text-green-300' : 'text-indigo-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <Logo className="w-20 h-20 opacity-20 grayscale" />
            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-300 tracking-tight uppercase">Welcome to {activeGroup?.name}</h3>
              <p className="text-xs text-gray-400 font-medium max-w-[250px] mx-auto leading-relaxed">
                Invite peers using code <span className="font-black text-indigo-400">{activeGroup?.joinCode}</span> or just start the conversation!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const sender = allUsers.find(u => u.id === msg.senderId);
            const isAI = msg.type === 'ai';

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex max-w-[85%] gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && !isAI && (
                    <img src={sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderName}`} className="w-10 h-10 rounded-full border border-gray-100 mt-1 shadow-sm bg-white object-cover" alt={msg.senderName} />
                  )}
                  {isAI && (
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mt-1">
                      <Logo className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    {!isMe && <div className="text-[10px] font-black text-gray-400 mb-1 ml-1 uppercase tracking-tighter">{msg.senderName}</div>}
                    <div className={`
                      p-4 rounded-3xl shadow-sm text-sm relative break-words leading-relaxed
                      ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-50'}
                      ${isAI ? 'border-2 border-indigo-200 bg-indigo-50/50 shadow-indigo-100' : ''}
                    `}>
                      {isAI && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 mb-2 uppercase tracking-widest">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          SARA Analysis
                        </div>
                      )}
                      
                      {msg.type === 'file' && !msg.metadata?.preview ? (
                        <PreviewCard type="file" url={msg.metadata?.fileUrl || '#'} title={msg.metadata?.fileName} />
                      ) : msg.type === 'voice' ? (
                        <div className="flex items-center gap-4 py-1 px-2 min-w-[220px]">
                          <audio className="hidden" id={`audio-${msg.id}`} src={msg.metadata?.fileUrl} onEnded={() => setPlayingId(null)} />
                          <button 
                            onClick={() => toggleAudio(msg.id)}
                            className={`${isMe ? 'text-white' : 'text-indigo-600'} hover:scale-110 transition-transform active:scale-90`}
                          >
                            {playingId === msg.id ? (
                               <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
                            ) : (
                               <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            )}
                          </button>
                          <div className="flex-1 space-y-1.5">
                            <div className={`h-1.5 rounded-full w-full relative overflow-hidden ${isMe ? 'bg-white/20' : 'bg-gray-100'}`}>
                                <div className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${isMe ? 'bg-white' : 'bg-indigo-600'} ${playingId === msg.id ? 'w-full animate-[shimmer_2s_infinite]' : 'w-0'}`}></div>
                            </div>
                            <div className={`flex justify-between items-center text-[9px] font-black uppercase tracking-tighter ${isMe ? 'text-indigo-100' : 'text-gray-400'}`}>
                                <span>{msg.metadata?.duration ? `0:${msg.metadata.duration.toString().padStart(2, '0')}` : 'Voice'}</span>
                                <span className="flex items-center gap-1">
                                  {playingId === msg.id && <span className="flex gap-0.5"><span className="w-0.5 h-1.5 bg-current animate-bounce [animation-delay:0s]"></span><span className="w-0.5 h-1.5 bg-current animate-bounce [animation-delay:0.2s]"></span><span className="w-0.5 h-1.5 bg-current animate-bounce [animation-delay:0.4s]"></span></span>}
                                  Voice Note
                                </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
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

                      <div className={`text-[9px] mt-2 font-bold uppercase tracking-tight opacity-60 text-right flex items-center justify-end ${isMe ? 'text-indigo-100' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <MessageStatus status={msg.status} isMe={isMe} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-5 bg-white/80 backdrop-blur-md border-t border-gray-100 flex items-center gap-4">
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          title="Share File"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
        </button>
        <div className="flex-1 relative">
          {isRecording ? (
            <div className="w-full bg-red-50 text-red-600 rounded-[1.5rem] px-6 py-4 text-sm font-black flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                 <span className="uppercase tracking-widest">Recording...</span>
               </div>
               <span className="font-mono">00:{recordingDuration.toString().padStart(2, '0')}</span>
            </div>
          ) : (
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Discuss concepts or share resources..."
              className="w-full bg-gray-50 border-transparent rounded-[1.5rem] px-6 py-4 text-sm focus:bg-white focus:ring-0 outline-none transition-all placeholder:text-gray-400 font-medium"
            />
          )}
        </div>
        <button 
          type="button" 
          onClick={toggleRecording}
          className={`p-3 rounded-2xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-100' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'}`}
          title={isRecording ? "Stop Recording" : "Voice Note"}
        >
          {isRecording ? (
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
          ) : (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          )}
        </button>
        {!isRecording && (
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <svg className="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatView;
