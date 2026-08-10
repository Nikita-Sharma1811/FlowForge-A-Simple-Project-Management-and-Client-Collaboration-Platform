import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Flame,
  Users,
  Plus,
  ArrowUpRight,
  Activity,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { flowForgeApi } from '../services/api';
import WorkloadWarningBanner from '../components/WorkloadWarningBanner';
import TaskModal from '../components/TaskModal';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [blockers, setBlockers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projRes, taskRes, blockRes, sprintRes, wlRes] = await Promise.all([
        flowForgeApi.projects.list(),
        flowForgeApi.tasks.list({ assignee: user?._id }),
        flowForgeApi.blockers.list({ status: 'Open' }),
        flowForgeApi.sprints.list({ status: 'Active' }),
        flowForgeApi.users.getWorkload(),
      ]);

      setProjects(projRes.data || []);
      setTasks(taskRes.data || []);
      setBlockers(blockRes.data || []);
      setSprints(sprintRes.data || []);
      setWorkload(wlRes.data || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err.message);
    } fontFinally: {
      setLoading(false);
    }
  };

  const overloadedMembers = workload.filter((w) => w.isOverloaded);
  const overdueTasks = tasks.filter(
    (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Done' && t.status !== 'Completed'
  );
  const activeTasks = tasks.filter((t) => t.status !== 'Done' && t.status !== 'Completed');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-900 border border-blue-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                {user?.role || 'Team Member'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Organization: {user?.organization?.name || 'FlowForge'}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Developer'} 👋
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Here is your real-time agile overview for today. You have {activeTasks.length} active assigned task(s) and {overdueTasks.length} overdue item(s).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/focus')}
              className="px-5 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <Flame size={16} />
              <span>Enter Focus Mode</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30"
            >
              <Plus size={16} />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Automated Workload Overload Warning Banner */}
      <WorkloadWarningBanner overloadedMembers={overloadedMembers} />

      {/* Metrics Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Projects', value: projects.length, icon: FolderKanban, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { label: 'My Active Tasks', value: activeTasks.length, icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Overdue Tasks', value: overdueTasks.length, icon: Clock, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
          { label: 'Active Blockers', value: blockers.length, icon: ShieldAlert, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">{m.label}</span>
                <div className={`p-2.5 rounded-2xl border ${m.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <span className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">{m.value}</span>
            </div>
          );
        })}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Active Assigned Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-500" />
                My Assigned Tasks
              </h3>
              <button
                onClick={() => navigate('/dashboard/kanban')}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                View Kanban Board
                <ArrowUpRight size={14} />
              </button>
            </div>

            {activeTasks.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs border-2 border-dashed border-slate-800/80 rounded-2xl">
                No pending tasks assigned to you right now.
              </div>
            ) : (
              <div className="space-y-3">
                {activeTasks.slice(0, 5).map((t) => (
                  <div
                    key={t._id}
                    onClick={() => setSelectedTask(t)}
                    className="p-4 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 truncate">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            t.priority === 'Critical'
                              ? 'bg-rose-500/20 text-rose-400'
                              : t.priority === 'High'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {t.priority}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-100 truncate">{t.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">
                        Project: {t.project?.name || 'General'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs flex-shrink-0">
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-mono text-[10px] rounded-lg">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Projects */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FolderKanban size={18} className="text-cyan-500" />
                Active Projects Overview
              </h3>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs border-2 border-dashed border-slate-800/80 rounded-2xl">
                No projects yet. Click "New Project" to launch one.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/dashboard/projects/${p._id}`)}
                    className="p-5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-2xl cursor-pointer transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-100 truncate">{p.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-mono">
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{p.description || 'No description'}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                      <span>PM: {p.projectManager?.name || 'Unassigned'}</span>
                      <span>{p.members?.length || 0} members</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Active Sprint & Blockers */}
        <div className="space-y-6">
          {/* Active Sprint Widget */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Layers size={18} className="text-purple-400" />
              Active Sprint
            </h3>

            {sprints.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">No active sprint running right now.</div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-semibold text-xs text-slate-200">{sprints[0].name}</h4>
                <p className="text-[11px] text-slate-400 italic">Goal: "{sprints[0].goal || 'No goal set'}"</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Sprint Progress</span>
                    <span>{sprints[0].progress || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full transition-all duration-300"
                      style={{ width: `${sprints[0].progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Blockers Widget */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert size={18} className="text-rose-400" />
                Active Blockers
              </h3>
              <button
                onClick={() => navigate('/dashboard/blockers')}
                className="text-xs text-rose-400 hover:underline font-semibold"
              >
                View All
              </button>
            </div>

            {blockers.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">No active blockers reported.</div>
            ) : (
              <div className="space-y-2.5">
                {blockers.slice(0, 4).map((b) => (
                  <div key={b._id} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-rose-300 truncate">{b.title}</h4>
                      <span className="text-[9px] bg-rose-600 text-white font-mono px-1.5 py-0.2 rounded">
                        {b.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-rose-200/70 truncate">{b.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal Details */}
      {selectedTask && (
        <TaskModal
          taskId={selectedTask._id}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={fetchDashboardData}
        />
      )}
    </div>
  );
}
