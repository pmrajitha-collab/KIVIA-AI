import React, { useState, useRef } from 'react';
import { User } from '../types';
import Logo from './Logo';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [academicLevel, setAcademicLevel] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [division, setDivision] = useState('');
  const [avatar, setAvatar] = useState(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users: User[] = JSON.parse(localStorage.getItem('kivia_users') || '[]');
    
    if (isLogin) {
      const user = users.find(u => u.name === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        alert('Credentials not found. Try signing up.');
      }
    } else {
      if (users.find(u => u.name === username)) {
        alert('Identity already claimed. Choose another username.');
        return;
      }
      const newUser: User = {
        id: Date.now().toString(),
        name: username,
        password: password,
        avatar: avatar,
        status: 'online',
        academicLevel,
        classLevel,
        division
      };
      localStorage.setItem('kivia_users', JSON.stringify([...users, newUser]));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-sm p-8 md:p-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-10">
          <Logo className="w-12 h-12 mb-4 text-slate-900" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">KIVIA</h1>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Collaborative Learning</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {!isLogin && (
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img src={avatar} className="w-20 h-20 rounded-full border border-slate-200 bg-slate-50 shadow-inner object-cover" />
                <button 
                  type="button" 
                  onClick={() => setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`)}
                  className="absolute -bottom-1 -right-1 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth={3} /></svg>
                </button>
              </div>
              <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest mt-2">Choose Avatar</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Username</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:bg-white focus:border-slate-400 outline-none transition-all font-medium"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:bg-white focus:border-slate-400 outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Study Level</label>
                  <select 
                    value={academicLevel}
                    onChange={e => setAcademicLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:bg-white outline-none transition-all font-medium"
                  >
                    <option value="">Select Level</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="High School">High School</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] mt-4 shadow-sm"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] text-slate-400 hover:text-slate-900 font-semibold uppercase tracking-widest transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;