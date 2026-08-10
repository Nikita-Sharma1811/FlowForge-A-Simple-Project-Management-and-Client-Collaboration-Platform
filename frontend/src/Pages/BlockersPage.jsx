import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BlockersPage() {
  const { user } = useAuth();
  const [blockers, setBlockers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('High');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchBlockers(selectedProject);
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
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockers = async (projId) => {
    try {
      const res = await flowForgeApi.blockers.list({ project: projId });
      setBlockers(res.data || []);
    } catch (err) {
      console.error('Fetch blockers error:', err.message);
    }
  };

  const handleCreateBlocker = async (e) => {
    e.preventDefault();
    try {
      const res = await flowForgeApi.blockers.create({
        title,
        description,
        project: selectedProject,
        severity,
      });
      setBlockers((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      alert(`Create blocker error: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await flowForgeApi.blockers.update(id, { status });
      setBlockers((prev) => prev.map((b) => (b._id === id ? res.data : b)));
    } catch (err) {
      alert(`Update status error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-rose-500" size={24} />
            Blocker Dashboard & Resolution Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">Identify, track, and clear technical and process bottlenecks quickly</p>
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
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-rose-600/30"
          >
            <Plus size={16} />
            <span>Report Blocker</span>
          </button>
        </div>
      </div>

      {/* Blockers Grid */}
      {blockers.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-xs">
          No active blockers reported for this project.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blockers.map((b) => (
            <div
              key={b._id}
              className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                      b.severity === 'Critical'
                        ? 'bg-rose-600 text-white'
                        : b.severity === 'High'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {b.severity}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                      b.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : b.status === 'In Progress'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-100">{b.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{b.description || 'No description provided.'}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">Reported by: {b.reportedBy?.name || 'Member'}</span>

                <div className="flex items-center gap-2">
                  {b.status !== 'Resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'Resolved')}
                      className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} />
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Blocker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Report New Blocker</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBlocker} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Blocker Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Database connection pool exhausted during socket test"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Impact & Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what is blocked and how to unblock..."
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
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
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-600/30"
                >
                  Report Blocker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
