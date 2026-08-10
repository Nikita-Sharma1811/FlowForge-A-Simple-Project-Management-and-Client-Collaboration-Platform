import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Search, Calendar, Users, X } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Active');
  const [deadline, setDeadline] = useState('');
  const [customStatusesInput, setCustomStatusesInput] = useState('Backlog, Todo, In Progress, Review, Testing, Done');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await flowForgeApi.projects.list();
      setProjects(res.data || []);
    } catch (err) {
      console.error('Fetch projects error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const customStatuses = customStatusesInput.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await flowForgeApi.projects.create({
        name,
        description,
        priority,
        status,
        deadline: deadline || null,
        customStatuses: customStatuses.length > 0 ? customStatuses : undefined,
      });

      setProjects((prev) => [res.data, ...prev]);
      setIsCreateModalOpen(false);
      setName('');
      setDescription('');
    } catch (err) {
      alert(`Create project error: ${err.message}`);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="text-blue-500" size={24} />
            Projects Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage and track all organizational projects</p>
        </div>

        {['Admin', 'Project Manager'].includes(user?.role) && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30"
          >
            <Plus size={16} />
            <span>Create New Project</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter projects by title or description..."
          className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-xs">
          No projects found. Create your first project to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj._id}
              onClick={() => navigate(`/dashboard/projects/${proj._id}`)}
              className="p-6 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-3xl cursor-pointer transition-all space-y-4 shadow-xl backdrop-blur-md hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                      proj.priority === 'Critical'
                        ? 'bg-rose-500/20 text-rose-400'
                        : proj.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {proj.priority} Priority
                  </span>
                  <h3 className="text-base font-bold text-slate-100 leading-snug">{proj.name}</h3>
                </div>
                <span className="text-[10px] px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 font-mono">
                  {proj.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {proj.description || 'No project description provided.'}
              </p>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-slate-500" />
                  <span>{proj.members?.length || 0} Members</span>
                </div>
                {proj.deadline && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar size={13} />
                    <span>{new Date(proj.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-slate-100 text-lg">Create New Project</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. FlowForge Real-Time SaaS Engine"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize project goals..."
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">
                  Custom Task Statuses (comma separated)
                </label>
                <input
                  type="text"
                  value={customStatusesInput}
                  onChange={(e) => setCustomStatusesInput(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
