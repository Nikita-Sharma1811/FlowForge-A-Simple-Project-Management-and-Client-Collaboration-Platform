import React, { useState, useEffect } from 'react';
import { CalendarCheck, Plus, User, Clock, ShieldAlert, X, Filter } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StandupPage() {
  const { user } = useAuth();
  const [standups, setStandups] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchStandups(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await flowForgeApi.projects.list();
      const projList = res.data || [];
      setProjects(projList);
      if (projList.length > 0) {
        setSelectedProject(projList[0]._id);
      }
    } catch (err) {
      console.error('Fetch projects error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStandups = async (projId) => {
    try {
      const res = await flowForgeApi.standups.list({ project: projId });
      setStandups(res.data || []);
    } catch (err) {
      console.error('Fetch standups error:', err.message);
    }
  };

  const handleSubmitStandup = async (e) => {
    e.preventDefault();
    try {
      const res = await flowForgeApi.standups.create({
        project: selectedProject,
        yesterday,
        today,
        blockers: blockers || 'None',
      });
      setStandups((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setYesterday('');
      setToday('');
      setBlockers('');
    } catch (err) {
      alert(`Submit standup error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="text-emerald-500" size={24} />
            Daily Stand-Up Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">Keep team synchronized with daily achievements, goals, and blockers</p>
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
          >
            <Plus size={16} />
            <span>Submit Stand-Up</span>
          </button>
        </div>
      </div>

      {/* Standup Feed */}
      {standups.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-xs">
          No daily stand-ups submitted for this project yet. Click "Submit Stand-Up" to share your progress!
        </div>
      ) : (
        <div className="space-y-4">
          {standups.map((s) => (
            <div
              key={s._id}
              className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {s.user?.name ? s.user.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-100">{s.user?.name || 'Team Member'}</h3>
                    <span className="text-[10px] text-slate-500">{s.user?.role || 'Developer'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Clock size={13} />
                  <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Yesterday */}
                <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Yesterday</span>
                  <p className="text-slate-300 leading-relaxed">{s.yesterday}</p>
                </div>

                {/* Today */}
                <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Today</span>
                  <p className="text-slate-300 leading-relaxed">{s.today}</p>
                </div>

                {/* Blockers */}
                <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1">
                    <ShieldAlert size={12} />
                    Blockers
                  </span>
                  <p className="text-slate-300 leading-relaxed">{s.blockers || 'None'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Standup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Submit Daily Stand-Up</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitStandup} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">What did you accomplish yesterday?</label>
                <textarea
                  rows={2}
                  required
                  value={yesterday}
                  onChange={(e) => setYesterday(e.target.value)}
                  placeholder="e.g. Integrated Socket.IO room listeners and finished Kanban drag and drop..."
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">What are you working on today?</label>
                <textarea
                  rows={2}
                  required
                  value={today}
                  onChange={(e) => setToday(e.target.value)}
                  placeholder="e.g. Setting up live timer synchronization and Client Portal deliverable view..."
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Any blockers or impediments?</label>
                <textarea
                  rows={2}
                  value={blockers}
                  onChange={(e) => setBlockers(e.target.value)}
                  placeholder="e.g. Waiting for API key approval or None..."
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/30"
                >
                  Submit Stand-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
