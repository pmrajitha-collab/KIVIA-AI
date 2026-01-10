
import React, { useState, useMemo } from 'react';
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
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
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
      const withIds = optimized.map((t: any) => ({
        ...t,
        id: Date.now().toString() + Math.random()
      }));
      if (confirm("SARA has generated a fresh, optimized schedule based on deep-work principles. Replace your current plan?")) {
        onUpdateTasks(withIds);
      }
    } catch (err) {
      alert("SARA couldn't reach the flow-state engine right now. Please try again later.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50/20 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-12 pb-20">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-3 bg-white hover:bg-gray-100 rounded-2xl shadow-sm border border-gray-100 transition-all text-gray-400 hover:text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Study Planner</h2>
              <p className="text-gray-500 font-medium">Coordinate your schedule and sync your study sprints.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              List
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              Calendar
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Controls Column */}
          <section className="lg:col-span-1 space-y-6">
            <div className="space-y-3">
              <button 
                onClick={() => setShowAddTask(true)}
                className="w-full px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                Plan Activity
              </button>
              <button 
                onClick={() => setShowAddAlarm(true)}
                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-100 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Set Alarm
              </button>
            </div>

            {showAddAlarm && (
              <form onSubmit={handleAddAlarm} className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 animate-in slide-in-from-top-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Alarm</span>
                </div>
                <input 
                  type="time" 
                  value={alarmTime}
                  onChange={e => setAlarmTime(e.target.value)}
                  className="w-full text-4xl font-black text-center bg-gray-50 rounded-2xl p-4 focus:bg-white outline-none border border-transparent focus:border-indigo-100 transition-all"
                />
                <input 
                  type="text" 
                  placeholder="Alarm label..."
                  value={alarmLabel}
                  onChange={e => setAlarmLabel(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white outline-none border border-transparent focus:border-indigo-100 transition-all"
                />
                <div className="flex justify-between">
                  {days.map((d, i) => (
                    <button 
                      key={d} 
                      type="button"
                      onClick={() => toggleDay(i)}
                      className={`w-8 h-8 rounded-full text-[9px] font-black flex items-center justify-center transition-all ${alarmDays.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {d[0]}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddAlarm(false)} className="flex-1 py-3 text-[10px] font-black text-gray-400 uppercase">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100">Set</button>
                </div>
              </form>
            )}

            {showAddTask && (
              <form onSubmit={handleAddTask} className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 animate-in slide-in-from-top-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Activity</span>
                </div>
                <input 
                  required 
                  value={taskTitle} 
                  onChange={e => setTaskTitle(e.target.value)} 
                  placeholder="Activity title..." 
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:bg-white outline-none border border-transparent focus:border-indigo-100 transition-all"
                />
                <div className="grid grid-cols-2 gap-2">
                   <select 
                      value={taskDay} 
                      onChange={e => setTaskDay(parseInt(e.target.value))}
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:bg-white outline-none border border-transparent focus:border-indigo-100 transition-all"
                    >
                      {days.map((d, i) => <option key={d} value={i}>{d}</option>)}
                    </select>
                    <input 
                      type="time" 
                      value={taskTime} 
                      onChange={e => setTaskTime(e.target.value)}
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:bg-white outline-none border border-transparent focus:border-indigo-100 transition-all"
                    />
                </div>
                <div className="flex gap-1.5">
                  {(['study', 'break', 'review'] as const).map(cat => (
                    <button 
                      key={cat}
                      type="button"
                      onClick={() => setTaskCategory(cat)}
                      className={`flex-1 py-2 text-[8px] font-black uppercase rounded-lg border transition-all ${taskCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-500 border-gray-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddTask(false)} className="flex-1 py-3 text-[10px] font-black text-gray-400 uppercase">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100">Schedule</button>
                </div>
              </form>
            )}

            {/* List Alarms Mini */}
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Current Alarms</h3>
               {alarms.length === 0 ? (
                 <p className="px-2 text-xs text-gray-300 font-medium italic">No alarms set.</p>
               ) : (
                 alarms.map(alarm => (
                   <div key={alarm.id} className={`p-4 rounded-2xl border transition-all ${alarm.isEnabled ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50/50 border-transparent opacity-60'}`}>
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="text-xl font-black text-gray-900 leading-none">{alarm.time}</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 truncate max-w-[80px]">{alarm.label}</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <button 
                              onClick={() => onToggleAlarm(alarm.id)}
                              className={`w-8 h-4 rounded-full relative transition-colors ${alarm.isEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${alarm.isEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                            </button>
                            <button onClick={() => onDeleteAlarm(alarm.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2.5} /></svg>
                            </button>
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </section>

          {/* Main View Area */}
          <section className="lg:col-span-3 min-h-[600px]">
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 animate-in fade-in duration-500">
                {days.map((day, idx) => (
                  <div key={day} className="space-y-3">
                    <div className="text-center py-2 bg-gray-100/50 rounded-xl">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</span>
                    </div>
                    <div className="space-y-2">
                      {tasks.filter(t => t.day === idx).sort((a,b) => a.time.localeCompare(b.time)).map(task => (
                        <div key={task.id} className="relative group/task p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                          <button 
                            onClick={() => onDeleteTask(task.id)}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/task:opacity-100 transition-all scale-75 z-10"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} /></svg>
                          </button>
                          <p className={`text-[8px] font-black uppercase mb-1 ${task.category === 'study' ? 'text-indigo-500' : task.category === 'break' ? 'text-green-500' : 'text-orange-500'}`}>
                            {task.time}
                          </p>
                          <h4 className="text-[10px] font-bold text-gray-900 line-clamp-2 leading-tight">{task.title}</h4>
                        </div>
                      ))}
                      {alarms.filter(a => a.days.includes(idx)).map(alarm => (
                        <div key={alarm.id} className="p-3 bg-red-50/30 border border-red-100 rounded-2xl flex items-center justify-between">
                           <div>
                              <p className="text-[8px] font-black text-red-500 uppercase">{alarm.time}</p>
                              <h4 className="text-[10px] font-bold text-gray-600 truncate max-w-[50px]">{alarm.label}</h4>
                           </div>
                           <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Professional Weekly Calendar Grid */
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[700px] animate-in fade-in zoom-in-95 duration-500">
                {/* Header Days */}
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                  <div className="w-20 border-r border-gray-100"></div>
                  {days.map((day) => (
                    <div key={day} className="flex-1 py-3 text-center border-r border-gray-100 last:border-r-0">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar Body */}
                <div className="flex-1 overflow-y-auto relative">
                  {hours.map((hour) => (
                    <div key={hour} className="flex border-b border-gray-100 group min-h-[60px]">
                      <div className="w-20 border-r border-gray-100 flex items-start justify-center pt-2 bg-gray-50/30">
                        <span className="text-[9px] font-black text-gray-300 uppercase">
                          {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                        </span>
                      </div>
                      {days.map((_, dayIdx) => (
                        <div key={dayIdx} className="flex-1 border-r border-gray-100 last:border-r-0 relative hover:bg-indigo-50/10 transition-colors">
                          {/* Render Tasks for this day/hour */}
                          {tasks
                            .filter(t => t.day === dayIdx && parseInt(t.time.split(':')[0]) === hour)
                            .map(task => {
                              const minutes = parseInt(task.time.split(':')[1]);
                              const topPercent = (minutes / 60) * 100;
                              return (
                                <div 
                                  key={task.id} 
                                  className={`absolute left-1 right-1 z-20 p-1.5 rounded-lg border shadow-sm group/event animate-in zoom-in-90 duration-300 ${
                                    task.category === 'study' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                                    task.category === 'break' ? 'bg-green-50 border-green-100 text-green-700' :
                                    'bg-orange-50 border-orange-100 text-orange-700'
                                  }`}
                                  style={{ top: `${topPercent}%`, height: 'auto', minHeight: '40px' }}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="min-w-0">
                                      <p className="text-[8px] font-black uppercase opacity-60 leading-none">{task.time}</p>
                                      <h5 className="text-[9px] font-bold truncate mt-0.5">{task.title}</h5>
                                    </div>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                                      className="p-0.5 hover:bg-black/5 rounded opacity-0 group-hover/event:opacity-100 transition-opacity"
                                    >
                                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={4}/></svg>
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          }
                          {/* Render Alarms for this day/hour */}
                          {alarms
                            .filter(a => a.days.includes(dayIdx) && parseInt(a.time.split(':')[0]) === hour)
                            .map(alarm => {
                              const minutes = parseInt(alarm.time.split(':')[1]);
                              const topPercent = (minutes / 60) * 100;
                              return (
                                <div 
                                  key={alarm.id} 
                                  className={`absolute left-1 right-1 z-30 px-1 py-1 rounded-md border bg-red-500/10 border-red-200 text-red-600 flex items-center gap-1 shadow-sm transition-transform hover:scale-105 ${alarm.isEnabled ? 'opacity-100' : 'opacity-40 grayscale'}`}
                                  style={{ top: `${topPercent}%` }}
                                >
                                  <svg className="w-2 h-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                  <span className="text-[8px] font-black leading-none">{alarm.time}</span>
                                </div>
                              );
                            })
                          }
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  {/* Current Time Indicator (Visual Nudge) */}
                  <div className="absolute left-0 right-0 border-t-2 border-red-400 pointer-events-none z-50 opacity-20 hidden"></div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Nudge Section */}
        <section className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Logo className="w-48 h-48" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-4">
                <h3 className="text-3xl font-black tracking-tight leading-tight">Flow-State Optimization</h3>
                <p className="text-gray-400 font-medium">SARA can analyze your weekly grid to suggest optimal "deep work" blocks based on your energy levels and peer availability.</p>
              </div>
              <button 
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="bg-white text-gray-900 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {isOptimizing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
                    Analyzing Flow...
                  </>
                ) : (
                  'Optimize My Week'
                )}
              </button>
           </div>
        </section>
      </div>
    </div>
  );
};

export default PlannerView;
