import React, { useState, useRef } from 'react';
import { User, UserStatus } from '../types';
import Logo from './Logo';

interface ProfileHubViewProps {
  user: User;
  onUpdateUser: (updatedUser: Partial<User>) => void;
  onLogout: () => void;
  onBack: () => void;
}

const ProfileHubView: React.FC<ProfileHubViewProps> = ({ user, onUpdateUser, onLogout, onBack }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [academicLevel, setAcademicLevel] = useState(user.academicLevel || '');
  const [classLevel, setClassLevel] = useState(user.classLevel || '');
  const [division, setDivision] = useState(user.division || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSaveInfo = () => {
    onUpdateUser({ name, email, status, academicLevel, classLevel, division });
    alert("Profile updated.");
  };

  const handleChangePassword = () => {
    if (!password || !newPassword) {
      alert("Fields required.");
      return;
    }
    onUpdateUser({ password: newPassword });
    setPassword('');
    setNewPassword('');
    alert("Password updated.");
  };

  const handleCustomAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50/20 flex flex-col items-center">
      <div className="w-full max-w-3xl px-4 md:px-8 py-10 space-y-10">
        
        <header className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Profile</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Account & Security</p>
            </div>
          </div>
          <Logo className="w-8 h-8 opacity-20 text-slate-900" />
        </header>

        {/* Identity Section */}
        <section className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Identity</h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
              <div className="relative">
                <img src={user.avatar} className="w-24 h-24 rounded-2xl border border-slate-200 object-cover bg-slate-50" />
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <button 
                    onClick={() => onUpdateUser({ avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}` })}
                    className="bg-white border border-slate-200 text-slate-600 p-1.5 rounded-lg shadow-sm hover:text-slate-900"
                    title="Shuffle"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-900 text-white p-1.5 rounded-lg shadow-sm hover:bg-slate-800"
                    title="Upload"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCustomAvatar} />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-slate-400 outline-none transition-all font-medium bg-slate-50/30" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-slate-400 outline-none transition-all font-medium bg-slate-50/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {(['online', 'busy', 'studying', 'offline'] as UserStatus[]).map(s => (
                      <button 
                        key={s} 
                        onClick={() => setStatus(s)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${status === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Academic Level</label>
                <select value={academicLevel} onChange={e => setAcademicLevel(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-slate-50/30">
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD">PhD / Researcher</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Year / Class</label>
                <input type="text" value={classLevel} onChange={e => setClassLevel(e.target.value)} placeholder="e.g. 2024" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none bg-slate-50/30" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Division</label>
                <input type="text" value={division} onChange={e => setDivision(e.target.value)} placeholder="e.g. A" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none bg-slate-50/30" />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button onClick={handleSaveInfo} className="bg-slate-900 text-white px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm">Save Changes</button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Security</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Current Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none bg-slate-50/30" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none bg-slate-50/30" />
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleChangePassword} className="bg-slate-900 text-white px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm">Update Password</button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border border-red-100 rounded-2xl overflow-hidden bg-red-50/30">
          <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-bold text-red-900 uppercase tracking-tight">Sign Out</h3>
              <p className="text-xs text-red-600 font-medium mt-1">Disconnect from the current session.</p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-white border border-red-200 text-red-600 px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </section>

        <footer className="text-center py-10 opacity-30">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">KIVIA System v3.1</p>
        </footer>
      </div>
    </div>
  );
};

export default ProfileHubView;