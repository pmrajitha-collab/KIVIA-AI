import React, { useState, useRef, useEffect } from 'react';
import { Post, User, Group } from '../types';
import Logo from './Logo';

interface HomeViewProps {
  currentUser: User;
  posts: Post[];
  groups: Group[];
  onAddPost: (content: string, type: 'text' | 'image' | 'video', mediaUrl?: string) => void;
  onLikePost: (postId: string) => void;
  onSharePostToGroup: (post: Post, groupId: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ currentUser, posts, groups, onAddPost, onLikePost, onSharePostToGroup }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [postType, setPostType] = useState<'text' | 'image' | 'video'>('text');
  const [showPublisher, setShowPublisher] = useState(false);
  const [sharingPost, setSharingPost] = useState<Post | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowScrollTop(scrollRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setPostType(type);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !mediaPreview) return;
    onAddPost(newPostContent, postType, mediaPreview || undefined);
    setNewPostContent('');
    setMediaPreview(null);
    setPostType('text');
    setShowPublisher(false);
  };

  const clearMedia = () => {
    setMediaPreview(null);
    setPostType('text');
  };

  const handleExternalShare = async (post: Post) => {
    const shareUrl = window.location.origin + window.location.pathname;
    const shareData = {
      title: `Breakthrough from @${post.authorName} | KIVIA`,
      text: post.content,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error(err);
      }
    }

    try {
      await navigator.clipboard.writeText(`${post.content}\n\nShared via KIVIA: ${shareUrl}`);
      alert('Breakthrough copied to clipboard!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto bg-slate-50/20 px-4 md:px-8 py-8 flex flex-col items-center relative scroll-smooth"
    >
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Community</h2>
          <p className="text-sm text-slate-500 font-medium">What's on your mind, <span className="text-slate-900 font-bold">@{currentUser.name}</span>?</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all">
          {!showPublisher ? (
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowPublisher(true)}>
              <img src={currentUser.avatar} className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200" />
              <div className="flex-1 bg-slate-50 hover:bg-slate-100 rounded-xl px-4 py-2.5 text-slate-400 text-sm font-medium transition-colors border border-slate-200">
                Share an update...
              </div>
            </div>
          ) : (
            <form onSubmit={handlePublish} className="space-y-4 animate-in fade-in duration-300">
              <textarea 
                autoFocus
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="Write something..."
                className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-300 font-medium resize-none text-base min-h-[100px] outline-none"
              />
              
              {mediaPreview && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200">
                  {postType === 'image' ? (
                    <img src={mediaPreview} className="w-full h-auto max-h-[300px] object-cover" />
                  ) : (
                    <video src={mediaPreview} className="w-full h-auto max-h-[300px] object-cover" controls />
                  )}
                  <button 
                    type="button" 
                    onClick={clearMedia}
                    className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                   <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleFileChange(e, 'image')} />
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </button>
                   
                   <input type="file" accept="video/*" className="hidden" id="video-upload-home" onChange={(e) => handleFileChange(e, 'video')} />
                   <label htmlFor="video-upload-home" className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   </label>
                </div>

                <div className="flex gap-2 items-center">
                  <button type="button" onClick={() => setShowPublisher(false)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 hover:text-slate-600">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={!newPostContent.trim() && !mediaPreview}
                    className="bg-slate-900 text-white px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-40"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-6 pb-20">
          {posts.length === 0 ? (
            <div className="text-center py-20 opacity-20 flex flex-col items-center">
              <Logo className="w-12 h-12 mb-3 grayscale text-slate-900" />
              <p className="font-bold text-sm">Nothing shared yet.</p>
            </div>
          ) : (
            posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(post => (
              <div key={post.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.authorAvatar} className="w-10 h-10 rounded-full border border-slate-100 bg-slate-50" />
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none mb-0.5">@{post.authorName}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Logo className="w-5 h-5 opacity-5 text-slate-900" />
                </div>

                {post.content && <p className="text-slate-800 text-sm leading-relaxed">{post.content}</p>}

                {post.type === 'image' && post.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                    <img src={post.mediaUrl} className="w-full h-auto max-h-[400px] object-cover" />
                  </div>
                )}

                {post.type === 'video' && post.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-100 bg-black aspect-video flex items-center justify-center">
                    <video src={post.mediaUrl} className="w-full h-full" controls />
                  </div>
                )}

                <div className="flex items-center gap-5 pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${post.likes.includes(currentUser.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <svg className={`w-5 h-5 ${post.likes.includes(currentUser.id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span className="text-[10px] font-bold uppercase">{post.likes.length}</span>
                  </button>
                  <button 
                    onClick={() => setSharingPost(post)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    <span className="text-[10px] font-bold uppercase">Share</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-slate-900 text-white rounded-xl shadow-xl hover:bg-slate-800 transition-all z-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7 7 7M12 3v18" /></svg>
        </button>
      )}

      {sharingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col border border-slate-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">Forward Post</h2>
              <button onClick={() => setSharingPost(null)} className="p-1 text-slate-400 hover:text-slate-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[300px] no-scrollbar">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">My Groups</h3>
              <div className="space-y-1.5">
                {groups.map(group => (
                  <button 
                    key={group.id} 
                    onClick={() => { onSharePostToGroup(sharingPost, group.id); setSharingPost(null); }}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-left group/btn"
                  >
                    <span className="text-xs font-bold text-slate-700 group-hover/btn:text-slate-900">{group.name}</span>
                    <svg className="w-4 h-4 text-slate-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => { handleExternalShare(sharingPost); setSharingPost(null); }}
              className="mt-6 w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;