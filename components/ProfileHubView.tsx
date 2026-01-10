
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
    alert("Profile information updated!");
  };

  const handleChangePassword = () => {
    if (!password || !newPassword) {
      alert("Please fill in both password fields.");
      return;
    }
    onUpdateUser({ password: newPassword });
    setPassword('');
    setNewPassword('');
    alert("Password updated successfully.");
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
    <div className="h-full overflow-y-auto bg-gray-50/20 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-12 pb-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white hover:bg-gray-100 rounded-2xl shadow-sm border border-gray-100 transition-all text-gray-400 hover:text-indigo-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Your Profile</h2>
            <p className="text-gray-500 font-medium">Manage your identity and security on KIVIA.</p>
          </div>
        </div>

        {/* Identity Section */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-xl group-hover:scale-105 transition-all object-cover" />
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <button 
                  onClick={() => onUpdateUser({ avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}` })}
                  className="bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-indigo-700 transition-all"
                  title="Randomize"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-green-700 transition-all"
                  title="Upload"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleCustomAvatar} 
              />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 leading-tight">@{user.name}</h3>
              <p className="text-sm text-gray-400 font-medium">{user.academicLevel || 'Peer Learner'} • {user.classLevel || 'Year Unknown'}</p>
              <div className="flex gap-2 mt-3">
                {(['online', 'busy', 'studying', 'offline'] as UserStatus[]).map(s => (
                  <button 
                    key={s} 
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${status === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-100'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Display Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Academic Level</label>
                <select 
                  value={academicLevel}
                  onChange={e => setAcademicLevel(e.target.value)}
                  className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium"
                >
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD">PhD / Researcher</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Class</label>
                  <input 
                    type="text" 
                    value={classLevel} 
                    onChange={e => setClassLevel(e.target.value)}
                    className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Division</label>
                  <input 
                    type="text" 
                    value={division} 
                    onChange={e => setDivision(e.target.value)}
                    className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all font-medium" 
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={handleSaveInfo}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Update Profile
            </button>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 text-red-500 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Security & Privacy</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Current Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-100 outline-none transition-all font-medium" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-100 outline-none transition-all font-medium" 
                />
              </div>
            </div>
            <button 
              onClick={handleChangePassword}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-black transition-all"
            >
              Change Password
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 rounded-[2.5rem] p-10 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h3 className="text-lg font-black text-red-600 tracking-tight">Sign Out of All Devices</h3>
            <p className="text-xs text-red-400 font-medium max-w-sm">Secure your account by ending all active sessions across your phone, tablet, and desktop.</p>
            <button 
              onClick={onLogout}
              className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-600 hover:text-white transition-all"
            >
              Sign Out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileHubView;
