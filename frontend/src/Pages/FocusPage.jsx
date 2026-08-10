import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, Clock, Play, Pause, AlertCircle, ArrowUpRight } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';

export default function FocusPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchFocusData();
  }, []);

  const fetchFocusData = async () => {
    try {
      setLoading(true);
      const [taskRes, timerRes] = await Promise.all([
        flowForgeApi.tasks.list({ assignee: user?._id }),
        flowForgeApi.time.getActiveTimer(),
      ]);
      setTasks(taskRes.data || []);
      setActiveTimer(timerRes.data || null);
    } catch (err) {
      console.error('Focus mode error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTimer = async (taskId) => {
    try {
      const res = await flowForgeApi.time.startTimer({ task: taskId });
      setActiveTimer(res.data);
    } catch (err) {
      alert(`Start timer failed: ${err.message}`);
    }
  };

  const handleStopTimer = async () => {
    try {
      await flowForgeApi.time.stopTimer();
      setActiveTimer(null);
      fetchFocusData();
    } catch (err) {
      alert(`Stop timer failed: ${err.message}`);
    }
  };

  const criticalTasks = tasks.filter((t) => t.priority === 'Critical' || t.priority === 'High');
  const overdueTasks = tasks.filter(
    (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Done' && t.status !== 'Completed'
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Focus Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={14} />
                Focus Mode Active
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Zero Distractions. Peak Execution.</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
              Focus on today's high-priority items and overdue deadlines without dashboard noise.
            </p>
          </div>

          {/* Active Running Timer Card */}
          {activeTimer ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-4 text-xs">
              <div>
                <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">Running Timer</span>
                <h4 className="font-bold text-slate-100 truncate max-w-[150px]">{activeTimer.task?.title || 'Task'}</h4>
              </div>
              <button
                onClick={handleStopTimer}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-lg"
              >
                <Pause size={14} />
                Stop
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-mono italic">No timer currently running</span>
          )}
        </div>
      </div>

      {/* Critical & Overdue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High & Critical Priority Tasks */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Flame size={18} className="text-amber-500" />
            Top Priority Items ({criticalTasks.length})
          </h3>

          {criticalTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">No high or critical priority tasks pending!</div>
          ) : (
            <div className="space-y-3">
              {criticalTasks.map((t) => (
                <div
                  key={t._id}
                  className="p-4 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-2xl transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 truncate">
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded uppercase font-mono">
                        {t.priority}
                      </span>
                      <h4
                        onClick={() => setSelectedTask(t)}
                        className="text-xs font-bold text-slate-100 cursor-pointer hover:underline truncate"
                      >
                        {t.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleStartTimer(t._id)}
                      className="p-2 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white border border-amber-500/30 rounded-xl transition-all"
                      title="Start Timer"
                    >
                      <Play size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 font-mono">
                    <span>Status: {t.status}</span>
                    <span>Project: {t.project?.name || 'General'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue Items */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Clock size={18} className="text-rose-500" />
            Overdue Deadline Items ({overdueTasks.length})
          </h3>

          {overdueTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">No overdue tasks! You are completely on track.</div>
          ) : (
            <div className="space-y-3">
              {overdueTasks.map((t) => (
                <div
                  key={t._id}
                  className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      onClick={() => setSelectedTask(t)}
                      className="text-xs font-bold text-rose-300 cursor-pointer hover:underline truncate"
                    >
                      {t.title}
                    </h4>
                    <span className="text-[10px] text-rose-400 font-mono">
                      Due: {new Date(t.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-200/70 truncate">{t.description || 'No description'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          taskId={selectedTask._id}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={fetchFocusData}
        />
      )}
    </div>
  );
}
