
import React, { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Check if the URL is actually valid (e.g. not about:blank or a local path that fails validation)
    const isValidUrl = shareUrl.startsWith('http');

    if (navigator.share && isValidUrl) {
      try {
        await navigator.share(shareData);
        return; // Successfully shared
      } catch (err) {
        // If it's not a user cancellation, we log it and proceed to fallback
        if ((err as Error).name !== 'AbortError') {
          console.error('Web Share failed:', err);
        } else {
          return; // User cancelled, don't show fallback
        }
      }
    }

    // Robust Fallback: Clipboard
    try {
      const copyText = `${post.content}\n\nShared via KIVIA: ${shareUrl}`;
      await navigator.clipboard.writeText(copyText);
      alert('Breakthrough copied to clipboard!');
    } catch (err) {
      console.error('Clipboard fallback failed:', err);
      alert('Unable to share breakthrough. Please try copying the text manually.');
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50/20 p-8 flex flex-col items-center relative">
      <div className="w-full max-w-2xl space-y-10">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Study Community</h2>
          <p className="text-gray-500 font-medium">What's the breakthrough today, <span className="text-indigo-600">@{currentUser.name}</span>?</p>
        </div>

        {/* Post Creator */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 transition-all">
          {!showPublisher ? (
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setShowPublisher(true)}>
              <img src={currentUser.avatar} className="w-10 h-10 rounded-full bg-gray-50" />
              <div className="flex-1 bg-gray-50 hover:bg-gray-100 rounded-2xl px-6 py-3 text-gray-400 text-sm font-medium transition-colors">
                Share a study tip, image, or video...
              </div>
            </div>
          ) : (
            <form onSubmit={handlePublish} className="space-y-6 animate-in fade-in duration-300">
              <textarea 
                autoFocus
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="Break down a concept or share progress..."
                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-300 font-medium resize-none text-lg min-h-[100px] outline-none shadow-none"
              />
              
              {mediaPreview && (
                <div className="relative group rounded-3xl overflow-hidden border border-gray-100">
                  {postType === 'image' ? (
                    <img src={mediaPreview} className="w-full h-auto max-h-[300px] object-cover" />
                  ) : (
                    <video src={mediaPreview} className="w-full h-auto max-h-[300px] object-cover" controls />
                  )}
                  <button 
                    type="button" 
                    onClick={clearMedia}
                    className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => handleFileChange(e, 'image')}
                   />
                   <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Upload Image"
                   >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </button>
                   
                   <input 
                    type="file" 
                    accept="video/*" 
                    className="hidden" 
                    id="video-upload" 
                    onChange={(e) => handleFileChange(e, 'video')}
                   />
                   <label 
                    htmlFor="video-upload"
                    className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
                    title="Upload Video"
                   >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   </label>
                </div>

                <div className="flex gap-3 items-center">
                  <button type="button" onClick={() => setShowPublisher(false)} className="text-xs font-black text-gray-400 uppercase tracking-widest px-4 hover:text-gray-600">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={!newPostContent.trim() && !mediaPreview}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Feed List */}
        <div className="space-y-8 pb-20">
          {posts.length === 0 ? (
            <div className="text-center py-20 opacity-30 flex flex-col items-center">
              <Logo className="w-16 h-16 mb-4 grayscale" />
              <p className="font-bold">The feed is quiet. Start the conversation!</p>
            </div>
          ) : (
            posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(post => (
              <div key={post.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6 hover:shadow-lg transition-all group animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={post.authorAvatar} className="w-12 h-12 rounded-full border border-gray-50" />
                    <div>
                      <h4 className="font-black text-gray-900 leading-none mb-1">@{post.authorName}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Logo className="w-6 h-6 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>

                {post.content && <p className="text-gray-800 font-medium leading-relaxed text-lg">{post.content}</p>}

                {post.type === 'image' && post.mediaUrl && (
                  <div className="rounded-[2rem] overflow-hidden border border-gray-50 bg-gray-50">
                    <img src={post.mediaUrl} className="w-full h-auto max-h-[500px] object-cover" />
                  </div>
                )}

                {post.type === 'video' && post.mediaUrl && (
                  <div className="rounded-[2rem] overflow-hidden border border-gray-50 bg-black aspect-video flex items-center justify-center">
                    {post.mediaUrl.startsWith('blob:') ? (
                      <video src={post.mediaUrl} className="w-full h-full" controls />
                    ) : (
                      <iframe 
                        src={post.mediaUrl.replace('watch?v=', 'embed/')} 
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                  <button 
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-2 group/btn transition-colors ${post.likes.includes(currentUser.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <svg className={`w-6 h-6 ${post.likes.includes(currentUser.id) ? 'fill-current' : 'fill-none group-hover/btn:fill-current'}`} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span className="text-xs font-black uppercase tracking-widest">{post.likes.length}</span>
                  </button>
                  <button 
                    onClick={() => setSharingPost(post)}
                    className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    <span className="text-xs font-black uppercase tracking-widest">Share</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Share Modal */}
      {sharingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Share Breakthrough</h2>
              <button onClick={() => setSharingPost(null)} className="p-2 text-gray-400 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto pr-2">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Study Groups</h3>
                {groups.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No groups available to share.</p>
                ) : (
                  <div className="space-y-2">
                    {groups.map(group => (
                      <button 
                        key={group.id} 
                        onClick={() => {
                          onSharePostToGroup(sharingPost, group.id);
                          setSharingPost(null);
                        }}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all group/btn"
                      >
                        <span className="font-bold text-gray-700 group-hover/btn:text-indigo-600">{group.name}</span>
                        <svg className="w-5 h-5 text-indigo-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button 
                  onClick={() => {
                    handleExternalShare(sharingPost);
                    setSharingPost(null);
                  }}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share to other apps
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
