import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Shield, CheckCircle2, X } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RisksPage() {
  const { user } = useAuth();
  const [risks, setRisks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [probability, setProbability] = useState('Medium');
  const [impact, setImpact] = useState('High');
  const [mitigationPlan, setMitigationPlan] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchRisks(selectedProject);
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
    } fontFinally: {
      setLoading(false);
    }
  };

  const fetchRisks = async (projId) => {
    try {
      const res = await flowForgeApi.risks.list({ project: projId });
      setRisks(res.data || []);
    } catch (err) {
      console.error('Fetch risks error:', err.message);
    }
  };

  const handleCreateRisk = async (e) => {
    e.preventDefault();
    try {
      const res = await flowForgeApi.risks.create({
        title,
        description,
        project: selectedProject,
        probability,
        impact,
        mitigationPlan,
      });
      setRisks((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setMitigationPlan('');
    } catch (err) {
      alert(`Create risk error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={24} />
            Risk Matrix & Assessment
          </h1>
          <p className="text-xs text-slate-400 mt-1">Identify potential project risks, evaluate severity, and document mitigation strategies</p>
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
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-amber-600/30"
          >
            <Plus size={16} />
            <span>Add Risk Entry</span>
          </button>
        </div>
      </div>

      {/* Risks Grid */}
      {risks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-xs">
          No risks logged for this project yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {risks.map((r) => (
            <div
              key={r._id}
              className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-mono">
                    Severity: {r.severity || 'Medium'}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>P: {r.probability}</span>
                    <span>|</span>
                    <span>I: {r.impact}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-100">{r.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{r.description || 'No detailed description.'}</p>
              </div>

              {/* Mitigation Plan Box */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1 text-xs">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Shield size={12} />
                  Mitigation Plan
                </span>
                <p className="text-slate-300 italic text-[11px] leading-relaxed">{r.mitigationPlan || 'No plan defined'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Risk Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Add Project Risk</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRisk} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Risk Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Third-party File Storage Rate Limit"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of the risk scenario..."
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Probability</label>
                  <select
                    value={probability}
                    onChange={(e) => setProbability(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Impact</label>
                  <select
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Mitigation Strategy</label>
                <textarea
                  rows={2}
                  value={mitigationPlan}
                  onChange={(e) => setMitigationPlan(e.target.value)}
                  placeholder="How will this risk be mitigated or prevented?"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-600/30"
                >
                  Add Risk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
