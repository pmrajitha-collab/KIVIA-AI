
import React, { useState, useRef, useEffect } from 'react';
import { User, Group } from '../types';
import Logo from './Logo';

interface VideoCallProps {
  onClose: () => void;
  currentUser: User;
  activeGroup: Group;
}

const VideoCall: React.FC<VideoCallProps> = ({ onClose, currentUser, activeGroup }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      const tracks = (screenRef.current?.srcObject as MediaStream)?.getTracks();
      tracks?.forEach(t => t.stop());
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (screenRef.current) {
          screenRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
        stream.getTracks()[0].onended = () => setIsScreenSharing(false);
      } catch (err) {
        console.error("Error screen sharing:", err);
      }
    }
  };

  const shareCallLink = () => {
    const callId = Math.random().toString(36).substring(7);
    const link = `${window.location.origin}${window.location.pathname}#call-${callId}`;
    navigator.clipboard.writeText(link);
    alert('Call link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between text-white mb-6">
        <div className="flex items-center gap-4">
          <Logo className="w-10 h-10 shadow-lg shadow-white/10 rounded-full text-white" />
          <div>
            <h2 className="text-xl font-bold tracking-tight leading-none mb-1">{activeGroup.name}</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Session</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={shareCallLink}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Share Link</span>
          </button>
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 100}`} alt="Member" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-9 h-9 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-[10px] font-bold">+4</div>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted={isMuted} className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`} />
          {isVideoOff && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-white">
                {currentUser.name[0]}
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Camera Off</p>
            </div>
          )}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-slate-950/50 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{currentUser.name} (You)</span>
          </div>
        </div>

        <div className={`relative bg-slate-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-700 ${isScreenSharing ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}>
          {isScreenSharing ? (
            <video ref={screenRef} autoPlay playsInline className="w-full h-full object-contain bg-slate-950" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-4">
              <div className="w-20 h-20 rounded-full border border-slate-800 flex items-center justify-center bg-slate-900/50">
                <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-xs font-bold tracking-widest uppercase opacity-20">Screen Stream Available</p>
            </div>
          )}
          {isScreenSharing && (
            <div className="absolute bottom-6 left-6 bg-red-600 px-4 py-2 rounded-xl text-[10px] font-bold text-white flex items-center gap-2 animate-pulse shadow-lg shadow-red-600/30">
              SHARING SCREEN
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-5 rounded-2xl transition-all duration-300 ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M12 5l-4.707 4.707H4a1 1 0 00-1 1v4a1 1 0 001 1h3.293L12 19V5z" /></svg>
          )}
        </button>
        <button 
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`p-5 rounded-2xl transition-all duration-300 ${isVideoOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
          title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </button>
        <button 
          onClick={toggleScreenShare}
          className={`p-5 rounded-2xl transition-all duration-300 ${isScreenSharing ? 'bg-slate-700 text-white shadow-lg shadow-slate-600/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
          title="Screen Share"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </button>
        <button 
          onClick={onClose}
          className="p-5 bg-red-600 text-white rounded-3xl px-10 font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-lg active:scale-95"
        >
          Leave Session
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
