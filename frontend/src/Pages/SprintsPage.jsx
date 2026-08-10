import React, { useState, useEffect } from 'react';
import { Layers, Plus, Calendar, CheckCircle2, Play, CheckCheck, Trash2, X, AlertCircle } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SprintsPage() {
  const { user } = useAuth();
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchSprintsAndTasks(selectedProject);
    }
  }, [selectedProject]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const projRes = await flowForgeApi.projects.list();
      const projList = projRes.data || [];
      setProjects(projList);
      if (projList.length > 0) {
        setSelectedProject(projList[0]._id);
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSprintsAndTasks = async (projId) => {
    try {
      const [sprintRes, taskRes] = await Promise.all([
        flowForgeApi.sprints.list({ project: projId }),
        flowForgeApi.tasks.list({ project: projId }),
      ]);
      setSprints(sprintRes.data || []);
      setTasks(taskRes.data || []);
    } catch (err) {
      console.error('Fetch sprints error:', err.message);
    }
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    try {
      const res = await flowForgeApi.sprints.create({
        name,
        goal,
        project: selectedProject,
        startDate: startDate || new Date(),
        endDate: endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'Planning',
      });
      setSprints((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setName('');
      setGoal('');
    } catch (err) {
      alert(`Create sprint failed: ${err.message}`);
    }
  };

  const handleUpdateSprintStatus = async (sprintId, status) => {
    try {
      const res = await flowForgeApi.sprints.update(sprintId, { status });
      setSprints((prev) => prev.map((s) => (s._id === sprintId ? res.data : s)));
    } catch (err) {
      alert(`Update sprint status failed: ${err.message}`);
    }
  };

  const backlogTasks = tasks.filter((t) => !t.sprint);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="text-purple-500" size={24} />
            Backlog & Sprints Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Plan sprint velocity, set sprint goals, and manage backlogs</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-semibold focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          {['Admin', 'Project Manager'].includes(user?.role) && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30"
            >
              <Plus size={16} />
              <span>New Sprint</span>
            </button>
          )}
        </div>
      </div>

      {/* Sprints Grid */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-slate-400">Project Sprints</h2>
        {sprints.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-xs">
            No sprints created for this project yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sprints.map((s) => {
              const sprintTasks = tasks.filter((t) => t.sprint?._id === s._id || t.sprint === s._id);
              const completedCount = sprintTasks.filter((t) => t.status === 'Done' || t.status === 'Completed').length;
              const progressPct = sprintTasks.length > 0 ? Math.round((completedCount / sprintTasks.length) * 100) : 0;

              return (
                <div
                  key={s._id}
                  className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            s.status === 'Active'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : s.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {s.status}
                        </span>
                        <h3 className="font-bold text-base text-slate-100">{s.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 italic mt-1 font-serif">"{s.goal || 'No goal set'}"</p>
                    </div>

                    {['Admin', 'Project Manager'].includes(user?.role) && (
                      <div className="flex items-center gap-2">
                        {s.status === 'Planning' && (
                          <button
                            onClick={() => handleUpdateSprintStatus(s._id, 'Active')}
                            className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                          >
                            <Play size={12} />
                            Start Sprint
                          </button>
                        )}
                        {s.status === 'Active' && (
                          <button
                            onClick={() => handleUpdateSprintStatus(s._id, 'Completed')}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                          >
                            <CheckCheck size={12} />
                            Complete
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Completion: {completedCount}/{sprintTasks.length} tasks</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>

                  {/* Task List in Sprint */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sprint Backlog</span>
                    {sprintTasks.length === 0 ? (
                      <span className="text-[11px] text-slate-500 italic block">No tasks assigned to this sprint yet.</span>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {sprintTasks.map((t) => (
                          <div
                            key={t._id}
                            className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                          >
                            <span className="text-slate-200 truncate">{t.title}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded font-mono flex-shrink-0">
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Backlog Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-400" />
          Unassigned Product Backlog ({backlogTasks.length})
        </h2>

        {backlogTasks.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">All project tasks are assigned to sprints!</div>
        ) : (
          <div className="space-y-2">
            {backlogTasks.map((t) => (
              <div
                key={t._id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 text-xs hover:border-slate-700 transition-all"
              >
                <div className="space-y-0.5 truncate">
                  <h4 className="font-semibold text-slate-200 truncate">{t.title}</h4>
                  <span className="text-[10px] text-slate-500 block">Priority: {t.priority}</span>
                </div>
                <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-[10px] font-mono rounded-lg">Unassigned</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Sprint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Create New Sprint</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSprint} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Sprint Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sprint 2 - Realtime Analytics"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Sprint Goal</label>
                <textarea
                  rows={2}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="What is the objective of this sprint?"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/30"
                >
                  Create Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
