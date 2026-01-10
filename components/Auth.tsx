
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
        alert('Invalid credentials. Hint: If you haven\'t created an account, click "Sign up" below.');
      }
    } else {
      if (users.find(u => u.name === username)) {
        alert('Username already exists. Please choose another.');
        return;
      }
      const newUser: User = {
        id: Date.now().toString(),
        name: username,
        password: password,
        avatar: avatar,
        status: 'online',
        currentFocus: 'Getting Started',
        academicLevel,
        classLevel,
        division
      };
      const updatedUsers = [...users, newUser];
      localStorage.setItem('kivia_users', JSON.stringify(updatedUsers));
      onLogin(newUser);
    }
  };

  const randomizeAvatar = () => {
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`);
  };

  const handleCustomAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FBEC] via-white to-[#E6EFCA] p-4 overflow-y-auto">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100 my-8">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Logo className="w-16 h-16 shadow-xl rounded-full" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">KIVIA</h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Elevate your peer study experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative group">
                <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-indigo-50 bg-gray-50 shadow-inner group-hover:scale-105 transition-transform duration-300 object-cover" />
                <div className="absolute -bottom-2 right-0 flex gap-1">
                  <button 
                    type="button" 
                    onClick={randomizeAvatar}
                    className="bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                    title="Randomize Avatar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                    title="Upload Custom Pic"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
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
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Identity</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-medium transition-all"
                placeholder="e.g. quantum_learner"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-medium transition-all"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Academic Level</label>
                  <select 
                    value={academicLevel}
                    onChange={e => setAcademicLevel(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-medium transition-all"
                  >
                    <option value="">Select Level</option>
                    <option value="High School">High School</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="PhD">PhD / Researcher</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Class / Year</label>
                    <input 
                      type="text" 
                      value={classLevel}
                      onChange={e => setClassLevel(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-medium transition-all"
                      placeholder="e.g. 2nd Year"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Division / Section</label>
                    <input 
                      type="text" 
                      value={division}
                      onChange={e => setDivision(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-medium transition-all"
                      placeholder="e.g. A-1"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            {isLogin ? 'Sign In' : 'Join Kivia'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-indigo-600 font-bold transition-colors"
          >
            {isLogin ? "New here? Create an account" : "Already a member? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
