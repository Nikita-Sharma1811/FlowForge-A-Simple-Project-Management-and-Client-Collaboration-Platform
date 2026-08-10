import React, { useState, useEffect } from 'react';
import { Building, CheckCircle2, XCircle, Clock, Plus, MessageSquare, X } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ClientPortalPage() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [deliverableName, setDeliverableName] = useState('');
  const [description, setDescription] = useState('');
  const [clientUserId, setClientUserId] = useState('');

  // Respond Modal
  const [activeApproval, setActiveApproval] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchApprovals(selectedProject);
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

  const fetchApprovals = async (projId) => {
    try {
      const res = await flowForgeApi.approvals.list({ project: projId });
      setApprovals(res.data || []);
    } catch (err) {
      console.error('Fetch approvals error:', err.message);
    }
  };

  const handleCreateApproval = async (e) => {
    e.preventDefault();
    try {
      const res = await flowForgeApi.approvals.create({
        title,
        deliverableName,
        description,
        project: selectedProject,
      });
      setApprovals((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setTitle('');
      setDeliverableName('');
      setDescription('');
    } catch (err) {
      alert(`Create approval request error: ${err.message}`);
    }
  };

  const handleRespond = async (status) => {
    if (!activeApproval) return;
    try {
      const res = await flowForgeApi.approvals.respond(activeApproval._id, {
        status,
        feedback,
      });
      setApprovals((prev) => prev.map((a) => (a._id === activeApproval._id ? res.data : a)));
      setActiveApproval(null);
      setFeedback('');
    } catch (err) {
      alert(`Respond error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building className="text-cyan-500" size={24} />
            Client Approval Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review sprint deliverables, sign off on releases, and submit feedback</p>
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
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/30"
            >
              <Plus size={16} />
              <span>Request Deliverable Approval</span>
            </button>
          )}
        </div>
      </div>

      {/* Approvals Feed */}
      {approvals.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-xs">
          No deliverable approval requests found for this project.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {approvals.map((appr) => (
            <div
              key={appr._id}
              className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase font-mono">
                    {appr.deliverableName || 'Deliverable'}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg font-mono ${
                      appr.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : appr.status === 'Changes Requested'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {appr.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-100">{appr.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{appr.description}</p>
              </div>

              {appr.feedback && (
                <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare size={12} />
                    Client Feedback
                  </span>
                  <p className="text-slate-300 italic">{appr.feedback}</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">Requested by: {appr.requestedBy?.name || 'PM'}</span>

                {(user?.role === 'Client' || user?.role === 'Admin') && appr.status === 'Pending' && (
                  <button
                    onClick={() => setActiveApproval(appr)}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-600/30"
                  >
                    Review Deliverable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal for Client */}
      {activeApproval && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Review: {activeApproval.title}</h3>
              <button onClick={() => setActiveApproval(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-300">{activeApproval.description}</p>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Feedback / Remarks</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide approval comments or requested modifications..."
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleRespond('Changes Requested')}
                  className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl font-semibold flex items-center gap-1.5 transition-all"
                >
                  <XCircle size={14} />
                  Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => handleRespond('Approved')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 size={14} />
                  Approve Deliverable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Request Client Approval</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateApproval} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Approval Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sprint 1 Prototype Signoff"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Deliverable Package Name</label>
                <input
                  type="text"
                  required
                  value={deliverableName}
                  onChange={(e) => setDeliverableName(e.target.value)}
                  placeholder="e.g. Interactive Client Portal & Socket Engine"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Description / Release Notes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context or testing link for the client..."
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
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
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-600/30"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
