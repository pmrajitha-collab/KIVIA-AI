
import React, { useState } from 'react';

interface PreviewProps {
  type: 'image' | 'video' | 'website' | 'file';
  url: string;
  title?: string;
  description?: string;
}

const PreviewCard: React.FC<PreviewProps> = ({ type, url, title, description }) => {
  const [hasError, setHasError] = useState(false);

  if (type === 'image') {
    return (
      <div className="mt-2 rounded-2xl overflow-hidden border border-gray-100 shadow-sm max-w-sm group">
        <img 
          src={url} 
          alt="Shared preview" 
          className="w-full h-auto object-cover max-h-60 group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
    );
  }

  if (type === 'video') {
    const isYoutube = url.includes('youtube') || url.includes('youtu.be');
    const videoId = isYoutube ? url.split('v=')[1]?.split('&')[0] || url.split('/').pop() : null;
    
    return (
      <div className="mt-2 rounded-2xl overflow-hidden border border-gray-100 shadow-sm max-w-sm bg-black aspect-video flex items-center justify-center">
        {videoId ? (
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="text-white text-xs font-bold px-4 text-center">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Live Player
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
        className="mt-2 block rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 max-w-sm"
      >
        <div className="h-24 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-50">
          {!hasError ? (
            <img 
              src={`https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`} 
              alt="Site preview" 
              className="w-full h-full object-cover opacity-90"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="flex flex-col items-center text-gray-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-[10px] font-black text-indigo-600 truncate uppercase tracking-widest">{hostname}</p>
          <p className="text-sm font-bold text-gray-800 line-clamp-1 mt-1">{title || 'Academic Resource'}</p>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{description || 'Click to explore this resource with your group.'}</p>
        </div>
      </a>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 max-w-sm hover:border-indigo-200 transition-colors group cursor-pointer">
      <div className="bg-white p-3 rounded-xl text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm truncate text-gray-900">{title || 'Document.pdf'}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Shared File</span>
          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
          <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Download</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
