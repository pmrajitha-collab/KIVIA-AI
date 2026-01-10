
import React, { useState } from 'react';
import { VideoSession } from '../types';
import Logo from './Logo';

interface VideoViewProps {
  videos: VideoSession[];
  onAddVideo: (title: string, url: string) => void;
  onBack: () => void;
}

const VideoView: React.FC<VideoViewProps> = ({ videos, onAddVideo, onBack }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoSession | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.includes('youtube.com') || newUrl.includes('youtu.be')) {
      const vidId = newUrl.split('v=')[1]?.split('&')[0] || newUrl.split('/').pop();
      const embedUrl = `https://www.youtube.com/embed/${vidId}`;
      onAddVideo(newTitle, embedUrl);
      setIsAdding(false);
      setNewTitle('');
      setNewUrl('');
    } else {
      alert('Please provide a valid YouTube URL');
    }
  };

  if (selectedVideo) {
    return (
      <div className="h-full flex flex-col bg-black text-white animate-in fade-in duration-300">
        <div className="p-4 flex items-center justify-between bg-zinc-900 border-b border-white/5">
          <button onClick={() => setSelectedVideo(null)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-black text-xs uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            BACK TO SESSIONS
          </button>
          <div className="flex items-center gap-3">
             <Logo className="w-6 h-6 opacity-80" />
             <h2 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">{selectedVideo.title}</h2>
          </div>
          <div className="w-32"></div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-black">
          <div className="w-full max-w-6xl aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(162,209,73,0.1)] border border-white/5">
            <iframe 
              src={selectedVideo.url} 
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
    <div className="p-8 overflow-y-auto h-full space-y-8 bg-gray-50/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white hover:bg-gray-100 rounded-2xl shadow-sm border border-gray-100 transition-all text-gray-400 hover:text-indigo-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Video Hub</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Study Sessions</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Review lectures and group calls at your own pace.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] transition-all active:scale-95"
        >
          Add Session
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-indigo-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">New Resource</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Advanced Calculus Lecture"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-gray-50 border-transparent rounded-xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">YouTube URL</label>
                <input 
                  type="url" 
                  placeholder="https://youtube.com/watch?v=..."
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  required
                  className="w-full bg-gray-50 border-transparent rounded-xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors px-4 py-2">Cancel</button>
              <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Session</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white/50 border-2 border-dashed border-gray-100 rounded-[3rem]">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center mx-auto mb-8 text-gray-200">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">No shared sessions</h3>
            <p className="text-gray-500 mt-3 font-medium max-w-xs mx-auto">Start sharing educational videos or recorded meetings with your peers.</p>
          </div>
        ) : (
          videos.map(video => (
            <div 
              key={video.id} 
              onClick={() => setSelectedVideo(video)}
              className="group cursor-pointer space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 bg-gray-200 ring-4 ring-white shadow-gray-200/50">
                <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={video.title} />
                <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-indigo-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-16 h-16 bg-white text-indigo-600 rounded-full shadow-2xl flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 101.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                    {video.duration}
                  </span>
                  <Logo className="w-6 h-6 opacity-80" />
                </div>
              </div>
              <div className="px-2">
                <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-lg tracking-tight">{video.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Shared {new Date(video.recordedAt).toLocaleDateString()}</span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                  <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Grounded</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoView;
