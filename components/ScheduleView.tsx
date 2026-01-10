
import React, { useState } from 'react';
import { ScheduledSession, StudyRoutine } from '../types';
import Logo from './Logo';

interface ScheduleViewProps {
  groupId: string;
  sessions: ScheduledSession[];
  routines: StudyRoutine[];
  onAddSession: (session: Omit<ScheduledSession, 'id' | 'groupId'>) => void;
  onAddRoutine: (routine: Omit<StudyRoutine, 'id' | 'groupId'>) => void;
  onRemoveSession: (id: string) => void;
  onRemoveRoutine: (id: string) => void;
  onBack: () => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ 
  groupId, 
  sessions, 
  routines, 
  onAddSession, 
  onAddRoutine,
  onRemoveSession,
  onRemoveRoutine,
  onBack
}) => {
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddRoutine, setShowAddRoutine] = useState(false);
  
  // Session Form
  const [sTitle, setSTitle] = useState('');
  const [sDate, setSDate] = useState('');
  const [sTime, setSTime] = useState('');
  const [sDuration, setSDuration] = useState('60');

  // Routine Form
  const [rLabel, setRLabel] = useState('');
  const [rDay, setRDay] = useState('1'); // Monday
  const [rTime, setRTime] = useState('14:00');

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const startTime = new Date(`${sDate}T${sTime}`).toISOString();
    onAddSession({ title: sTitle, startTime, duration: parseInt(sDuration) });
    setSTitle('');
    setSDate('');
    setSTime('');
    setShowAddSession(false);
  };

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoutine({ label: rLabel, dayOfWeek: parseInt(rDay), time: rTime });
    setRLabel('');
    setShowAddRoutine(false);
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="h-full flex flex-col bg-gray-50/20 overflow-y-auto p-8 space-y-12">
      {/* Upcoming Sessions Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-3 bg-white hover:bg-gray-100 rounded-2xl shadow-sm border border-gray-100 transition-all text-gray-400 hover:text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Future Focus</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Scheduled Sessions</h2>
            </div>
          </div>
          <button 
            onClick={() => setShowAddSession(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            Schedule New
          </button>
        </div>

        {showAddSession && (
          <form onSubmit={handleAddSession} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-indigo-50 animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Plan a Study Blitz</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Session Title</label>
                <input required value={sTitle} onChange={e => setSTitle(e.target.value)} type="text" placeholder="e.g. Exam Review" className="w-full bg-gray-50 rounded-xl px-5 py-3 text-sm focus:bg-white outline-none border border-transparent focus:border-indigo-100 font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                <input required value={sDate} onChange={e => setSDate(e.target.value)} type="date" className="w-full bg-gray-50 rounded-xl px-5 py-3 text-sm focus:bg-white outline-none border border-transparent focus:border-indigo-100 font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                <input required value={sTime} onChange={e => setSTime(e.target.value)} type="time" className="w-full bg-gray-50 rounded-xl px-5 py-3 text-sm focus:bg-white outline-none border border-transparent focus:border-indigo-100 font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration (Min)</label>
                <select value={sDuration} onChange={e => setSDuration(e.target.value)} className="w-full bg-gray-50 rounded-xl px-5 py-3 text-sm focus:bg-white outline-none border border-transparent focus:border-indigo-100 font-medium transition-all">
                  <option value="30">30 Min</option>
                  <option value="60">1 Hour</option>
                  <option value="90">1.5 Hours</option>
                  <option value="120">2 Hours</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowAddSession(false)} className="px-6 py-2 text-xs font-black uppercase text-gray-400">Cancel</button>
              <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-xs font-black uppercase">Save Session</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white/50 border-2 border-dashed border-gray-100 rounded-[2.5rem]">
              <p className="text-gray-400 font-medium">No sessions scheduled yet.</p>
            </div>
          ) : (
            sessions.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <button onClick={() => onRemoveSession(s.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">{s.title}</h3>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{new Date(s.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  <p className="text-xs text-gray-400 font-medium">{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {s.duration} min</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Routine Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Consistency King</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Study Routine</h2>
          </div>
          <button 
            onClick={() => setShowAddRoutine(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            Add Routine Slot
          </button>
        </div>

        {showAddRoutine && (
          <form onSubmit={handleAddRoutine} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-green-50 animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Set a Recurring Study Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Label</label>
                <input required value={rLabel} onChange={e => setRLabel(e.target.value)} type="text" placeholder="e.g. Daily Sync" className="w-full bg-gray-50 rounded-xl px-5 py-3 text-sm focus:bg-white outline-none border border-transparent focus:border-green-100 font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Day</label>
                <select value={rDay} onChange={e => setRDay(e.target.value)} className="w-full bg-gray-50 rounded-xl px-5 py-3 text-sm focus:bg-white outline-none border border-transparent focus:border-green-100 font-medium transition-all">
                  {days.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                <input required value={rTime} onChange={e => setRTime(e.target.value)} type="time" className="w-full bg-gray-50 rounded-xl px-5 py-3 text-sm focus:bg-white outline-none border border-transparent focus:border-green-100 font-medium transition-all" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowAddRoutine(false)} className="px-6 py-2 text-xs font-black uppercase text-gray-400">Cancel</button>
              <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded-xl text-xs font-black uppercase">Add Recurring Slot</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {routines.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white/50 border-2 border-dashed border-gray-100 rounded-[2.5rem]">
              <p className="text-gray-400 font-medium">No recurring routines set.</p>
            </div>
          ) : (
            routines.map(r => (
              <div key={r.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-black text-xs">
                    {days[r.dayOfWeek].substring(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-sm">{r.label}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{r.time}</p>
                  </div>
                </div>
                <button onClick={() => onRemoveRoutine(r.id)} className="p-1.5 text-gray-200 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Alarms / Focus Mode Suggestion */}
      <section className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Logo className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-xl space-y-4">
          <h2 className="text-3xl font-black tracking-tight leading-tight">Master Your Momentum</h2>
          <p className="text-indigo-100 font-medium">Use SARA to suggest the best study times based on your group's peak activity, or set quick "Focus Alarms" to keep the session disciplined.</p>
          <div className="flex gap-4 pt-4">
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/20 hover:scale-105 transition-all">Enable Auto-Reminders</button>
            <button className="bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-indigo-400 hover:bg-indigo-400 transition-all">SARA Scheduler</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScheduleView;
