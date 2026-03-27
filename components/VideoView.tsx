import React, { useState, useMemo } from 'react';
import { VideoSession, Group } from '../types';
import Logo from './Logo';

interface VideoViewProps {
  videos: VideoSession[];
  groups: Group[];
  onAddVideo: (title: string, url: string, summary: string, duration: string, thumbnail: string) => void;
  onShareVideoToGroup: (video: VideoSession, groupId: string) => void;
  onBack: () => void;
}

const VideoView: React.FC<VideoViewProps> = ({ videos, groups, onAddVideo, onShareVideoToGroup, onBack }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoSession | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [sharingVideo, setSharingVideo] = useState<VideoSession | null>(null);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = getYouTubeId(newUrl);
    
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      const duration = newDuration.trim() || '0:00';
      
      onAddVideo(newTitle, embedUrl, newSummary, duration, thumbnail);
      
      setIsAdding(false);
      setNewTitle('');
      setNewUrl('');
      setNewSummary('');
      setNewDuration('');
    } else {
      alert('Please provide a valid YouTube URL');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Video link copied!');
  };

  if (selectedVideo) {
    return (
      <div className="h-full flex flex-col bg-slate-950 text-white animate-in fade-in duration-300">
        <div className="p-4 flex items-center justify-between bg-slate-900 border-b border-white/5">
          <button 
            onClick={() => setSelectedVideo(null)} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-[10px] uppercase tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Library
          </button>
          <div className="flex items-center gap-3">
             <Logo className="w-6 h-6 opacity-80 text-white" />
             <h2 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-500 truncate max-w-xs">{selectedVideo.title}</h2>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => copyToClipboard(selectedVideo.url)} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white">Copy Source</button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4 md:p-12 bg-slate-950">
          <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
            <iframe 
              src={`${selectedVideo.url}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 overflow-y-auto h-full space-y-10 bg-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all text-slate-400 hover:text-slate-900 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Video Library</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Study Sessions</h2>
            <p className="text-slate-500 text-xs font-medium mt-0.5">Shared knowledge from your network.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          Add Video
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleAdd} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white border border-slate-200 text-slate-900 rounded-lg shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">Add New Video</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Organic Chemistry: Functional Groups"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-slate-400 transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                <input 
                  type="text" 
                  placeholder="e.g. 15:30"
                  value={newDuration}
                  onChange={e => setNewDuration(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-slate-400 transition-all font-medium"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">YouTube URL</label>
              <input 
                type="url" 
                placeholder="https://youtube.com/watch?v=..."
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-slate-400 transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Summary</label>
              <textarea 
                placeholder="Key concepts covered in this session..."
                value={newSummary}
                onChange={e => setNewSummary(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-slate-400 transition-all font-medium min-h-[80px] resize-none"
              />
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 px-4">Cancel</button>
              <button type="submit" className="bg-slate-900 text-white px-8 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-slate-800 transition-all">Add to Library</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        {videos.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center">
            <Logo className="w-12 h-12 mb-4 opacity-10 text-slate-900" />
            <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase">No Videos Yet</h3>
            <p className="text-xs text-slate-300 mt-1.5 font-medium max-w-xs mx-auto italic">Share your first study resource to help others.</p>
          </div>
        ) : (
          videos.map(video => (
            <div 
              key={video.id} 
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row animate-in slide-in-from-bottom-2 duration-300 hover:border-slate-400 transition-all group shadow-sm"
            >
              <div 
                className="w-full md:w-56 aspect-video md:aspect-square flex-shrink-0 relative cursor-pointer overflow-hidden border-b md:border-b-0 md:border-r border-slate-100"
                onClick={() => setSelectedVideo(video)}
              >
                <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={video.title} />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold rounded border border-white/10 uppercase">
                  {video.duration}
                </div>
              </div>

              <div className="flex-1 p-5 flex flex-col min-w-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0">
                    <h3 onClick={() => setSelectedVideo(video)} className="font-bold text-slate-900 hover:text-slate-600 transition-colors line-clamp-1 text-base tracking-tight cursor-pointer">{video.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">@{video.sharedByName}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button 
                      onClick={() => setSharingVideo(video)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                      title="Share to Group"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    </button>
                    <button 
                      onClick={() => copyToClipboard(video.url)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                      title="Copy Link"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-12a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3 bg-slate-50 border border-slate-100 rounded-lg p-2 font-medium italic">
                    "{video.summary}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    Added {new Date(video.recordedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {sharingVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col border border-slate-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">Share Resource</h2>
              <button onClick={() => setSharingVideo(null)} className="p-1 text-slate-400 hover:text-slate-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[300px] no-scrollbar">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Target Groups</h3>
              <div className="space-y-1.5">
                {groups.map(group => (
                  <button 
                    key={group.id} 
                    onClick={() => { onShareVideoToGroup(sharingVideo, group.id); setSharingVideo(null); }}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-left group/btn"
                  >
                    <span className="text-xs font-bold text-slate-700 group-hover/btn:text-slate-900">{group.name}</span>
                    <svg className="w-4 h-4 text-slate-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoView;