import React, { useState } from 'react';
import { Alarm, PlannerTask } from '../types';
import Logo from './Logo';
import { optimizePlanner } from '../services/gemini';

interface PlannerViewProps {
  alarms: Alarm[];
  tasks: PlannerTask[];
  onAddAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  onToggleAlarm: (id: string) => void;
  onDeleteAlarm: (id: string) => void;
  onAddTask: (task: Omit<PlannerTask, 'id'>) => void;
  onUpdateTasks: (tasks: PlannerTask[]) => void;
  onDeleteTask: (id: string) => void;
  onBack: () => void;
}

const PlannerView: React.FC<PlannerViewProps> = ({
  alarms,
  tasks,
  onAddAlarm,
  onToggleAlarm,
  onDeleteAlarm,
  onAddTask,
  onUpdateTasks,
  onDeleteTask,
  onBack
}) => {
  const [showAddAlarm, setShowAddAlarm] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Alarm Form
  const [alarmTime, setAlarmTime] = useState('08:00');
  const [alarmLabel, setAlarmLabel] = useState('');
  const [alarmDays, setAlarmDays] = useState<number[]>([]);

  // Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDay, setTaskDay] = useState(1);
  const [taskTime, setTaskTime] = useState('09:00');
  const [taskCategory, setTaskCategory] = useState<'study' | 'break' | 'review'>('study');

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const toggleDay = (dayIndex: number) => {
    setAlarmDays(prev => 
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleAddAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlarm({ time: alarmTime, label: alarmLabel || 'Alarm', isEnabled: true, days: alarmDays });
    setAlarmLabel('');
    setAlarmDays([]);
    setShowAddAlarm(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({ title: taskTitle, day: taskDay, time: taskTime, category: taskCategory });
    setTaskTitle('');
    setShowAddTask(false);
  };

  const handleOptimize = async () => {
    if (isOptimizing) return;
    setIsOptimizing(true);
    try {
      const optimized = await optimizePlanner(tasks, alarms);
      const withIds = optimized.map((t: any) => ({ ...t, id: Date.now().toString() + Math.random() }));
      if (confirm("SARA has optimized your schedule. Apply these changes?")) onUpdateTasks(withIds);
    } catch (err) {
      alert("Optimization unavailable. Please try later.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50/20 px-4 md:px-8 py-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-8 pb-20">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all text-slate-400 hover:text-slate-900 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Planner</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Schedule & Tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400'}`}>List</button>
            <button onClick={() => setViewMode('calendar')} className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400'}`}>Calendar</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => setShowAddTask(true)} className="w-full py-3.5 bg-slate-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm hover:bg-slate-800 transition-all">+ Add Task</button>
              <button onClick={() => setShowAddAlarm(true)} className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">+ Add Alarm</button>
            </div>

            {showAddTask && (
              <form onSubmit={handleAddTask} className="p-5 bg-white rounded-2xl border border-slate-200 animate-in slide-in-from-top-2 space-y-4 shadow-sm">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">New Task</p>
                <input required value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task name..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium outline-none focus:bg-white focus:border-slate-400" />
                <div className="flex gap-2">
                  <select value={taskDay} onChange={e => setTaskDay(parseInt(e.target.value))} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold outline-none">
                    {days.map((d, i) => <option key={d} value={i}>{d}</option>)}
                  </select>
                  <input type="time" value={taskTime} onChange={e => setTaskTime(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold outline-none" />
                </div>
                <div className="flex gap-2">
                   <button type="button" onClick={() => setShowAddTask(false)} className="flex-1 py-2 text-[9px] font-bold text-slate-400 uppercase">Cancel</button>
                   <button type="submit" className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-bold uppercase">Save</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
               <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Alarms</h3>
               {alarms.length === 0 ? <p className="text-[10px] text-slate-300 italic px-1">No active alarms.</p> : 
                 alarms.map(alarm => (
                   <div key={alarm.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                      <div className="min-w-0">
                         <p className="text-sm font-bold text-slate-900 leading-none">{alarm.time}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1 truncate">{alarm.label}</p>
                      </div>
                      <button onClick={() => onToggleAlarm(alarm.id)} className={`w-8 h-4 rounded-full relative transition-colors ${alarm.isEnabled ? 'bg-slate-900' : 'bg-slate-200'}`}>
                         <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${alarm.isEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                      </button>
                   </div>
                 ))
               }
            </div>
          </aside>

          <main className="lg:col-span-3">
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-300">
                {days.map((day, idx) => (
                  <div key={day} className="flex flex-col gap-2">
                    <div className="px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{day}</span>
                    </div>
                    <div className="space-y-2">
                      {tasks.filter(t => t.day === idx).sort((a,b) => a.time.localeCompare(b.time)).map(task => (
                        <div key={task.id} className="p-3 bg-white border border-slate-200 rounded-xl group relative shadow-sm">
                          <button onClick={() => onDeleteTask(task.id)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg></button>
                          <p className={`text-[8px] font-bold uppercase mb-1 ${task.category === 'study' ? 'text-slate-900' : 'text-slate-500'}`}>{task.time}</p>
                          <h4 className="text-[10px] font-bold text-slate-900 line-clamp-1">{task.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px] shadow-sm">
                <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50 text-[8px] font-bold uppercase tracking-widest py-2 text-center text-slate-400">
                  <div className="border-r border-slate-100">Time</div>
                  {days.map(d => <div key={d} className="border-r border-slate-100 last:border-r-0">{d}</div>)}
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {hours.map(h => (
                    <div key={h} className="grid grid-cols-8 border-b border-slate-100 min-h-[40px]">
                      <div className="text-[8px] font-bold text-slate-300 text-center flex items-center justify-center border-r border-slate-100 bg-slate-50/30">{h}:00</div>
                      {days.map((_, di) => (
                        <div key={di} className="border-r border-slate-100 last:border-r-0 relative hover:bg-slate-50">
                          {tasks.filter(t => t.day === di && parseInt(t.time.split(':')[0]) === h).map(t => (
                            <div key={t.id} className={`absolute inset-0.5 rounded px-1 py-0.5 text-[8px] font-bold truncate border shadow-xs ${t.category === 'study' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>{t.title}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>

        <section className="bg-slate-900 rounded-2xl p-6 md:p-10 text-white relative overflow-hidden border border-slate-800 shadow-xl">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl font-bold tracking-tight leading-tight">Optimize Schedule</h3>
                <p className="text-xs text-slate-400 font-medium max-w-md">Let the AI assistant evaluate your weekly layout and suggest improvements.</p>
              </div>
              <button onClick={handleOptimize} disabled={isOptimizing} className="bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                {isOptimizing ? 'Optimizing...' : 'Optimize Now'}
              </button>
           </div>
        </section>
      </div>
    </div>
  );
};

export default PlannerView;