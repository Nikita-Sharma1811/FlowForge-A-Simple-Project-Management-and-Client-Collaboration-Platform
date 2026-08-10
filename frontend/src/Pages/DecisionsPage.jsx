import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, User, Clock, CheckCircle2, X } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DecisionsPage() {
  const { user } = useAuth();
  const [decisions, setDecisions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [impact, setImpact] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchDecisions(selectedProject);
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

  const fetchDecisions = async (projId) => {
    try {
      const res = await flowForgeApi.decisions.list({ project: projId });
      setDecisions(res.data || []);
    } catch (err) {
      console.error('Fetch decisions error:', err.message);
    }
  };

  const handleCreateDecision = async (e) => {
    e.preventDefault();
    try {
      const res = await flowForgeApi.decisions.create({
        title,
        description,
        project: selectedProject,
        reason,
        impact,
      });
      setDecisions((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setReason('');
      setImpact('');
    } catch (err) {
      alert(`Create decision error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="text-indigo-500" size={24} />
            Architectural & Product Decision Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">Maintain an immutable audit trail of technical choices, rationale, and consequences</p>
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
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Plus size={16} />
            <span>Record Decision</span>
          </button>
        </div>
      </div>

      {/* Decisions Log Feed */}
      {decisions.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-xs">
          No architectural or product decisions recorded for this project yet.
        </div>
      ) : (
        <div className="space-y-4">
          {decisions.map((d) => (
            <div
              key={d._id}
              className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    {d.madeBy?.name ? d.madeBy.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{d.title}</h3>
                    <span className="text-[10px] text-slate-400">Decided by: {d.madeBy?.name || 'Architect'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Clock size={13} />
                  <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{d.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Rationale / Why</span>
                  <p className="text-slate-300 italic">{d.reason || 'No rationale recorded'}</p>
                </div>

                <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Expected Impact</span>
                  <p className="text-slate-300 italic">{d.impact || 'No impact recorded'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Decision Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Record Architectural Decision</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDecision} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Decision Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Adopt dnd-kit over native HTML5 drag and drop"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Summary / Context</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the architectural change..."
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Reason / Rationale</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why was this option selected?"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Expected Impact</label>
                <textarea
                  rows={2}
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  placeholder="What is the resulting trade-off or benefit?"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Record Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
