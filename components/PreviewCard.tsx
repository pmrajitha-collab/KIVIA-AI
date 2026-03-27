import React, { useState } from 'react';

interface PreviewProps {
  type: 'image' | 'video' | 'website' | 'file';
  url: string;
  title?: string;
  description?: string;
}

const PreviewCard: React.FC<PreviewProps> = ({ type, url, title, description }) => {
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (type === 'image') {
    return (
      <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm max-w-sm group">
        <img 
          src={url} 
          alt="Shared preview" 
          className="w-full h-auto object-cover max-h-60 group-hover:scale-[1.02] transition-transform duration-500" 
        />
      </div>
    );
  }

  if (type === 'video') {
    const videoId = getYouTubeId(url);
    const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    
    return (
      <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm bg-black aspect-video relative group">
        {videoId ? (
          isPlaying ? (
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full relative cursor-pointer" onClick={() => setIsPlaying(true)}>
              <img src={thumbUrl!} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="Video thumbnail" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[8px] font-black text-white rounded uppercase tracking-widest border border-white/10">
                YouTube Preview
              </div>
            </div>
          )
        ) : (
          <div className="text-white text-[10px] font-bold px-4 text-center flex flex-col items-center gap-2">
            <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            <span className="uppercase tracking-[0.2em] opacity-40">Live Video Session</span>
          </div>
        )}
      </div>
    );
  }

  if (type === 'website') {
    const hostname = new URL(url).hostname;
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-2 block rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group max-w-sm"
      >
        <div className="h-28 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
          {!hasError ? (
            <img 
              src={`https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`} 
              alt="Site preview" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="flex flex-col items-center text-gray-300">
              <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            </div>
          )}
        </div>
        <div className="p-3.5">
          <p className="text-[9px] font-black text-indigo-500 truncate uppercase tracking-[0.15em] mb-1">{hostname}</p>
          <p className="text-xs font-bold text-gray-900 line-clamp-1 leading-tight">{title || 'Academic Resource'}</p>
          <p className="text-[10px] text-gray-400 line-clamp-1 mt-1 font-medium italic">Shared Resource Grounded in Chat</p>
        </div>
      </a>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 max-w-sm hover:border-indigo-200 transition-colors group cursor-pointer">
      <div className="bg-white p-3 rounded-lg text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-xs truncate text-gray-900">{title || 'Shared Document'}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Global Asset</span>
          <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
          <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest group-hover:underline">Fetch Data</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;