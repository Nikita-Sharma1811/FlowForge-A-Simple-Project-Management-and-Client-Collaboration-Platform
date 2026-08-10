import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Kanban,
  Layers,
  CalendarCheck,
  ShieldAlert,
  AlertTriangle,
  Building,
  BookOpen,
  PieChart,
  ArrowLeft,
  Users,
  Plus,
} from 'lucide-react';
import { flowForgeApi } from '../services/api';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('kanban'); // kanban, sprints, standup, blockers, risks, approvals, decisions, reports
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await flowForgeApi.projects.getById(id);
      setProject(res.data);
    } catch (err) {
      console.error('Fetch project details error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500 text-xs">Loading project hub...</div>;
  }

  if (!project) {
    return <div className="text-center py-20 text-slate-500 text-xs">Project not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Project Header Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard/projects')}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-100 font-semibold"
          >
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">
              {project.status}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{project.name}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {project.description || 'No description provided.'}
          </p>
        </div>

        {/* Project Meta Metrics */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
          <div>
            <span className="text-slate-500 block text-[10px]">Project Manager</span>
            <span className="font-semibold text-slate-200">{project.projectManager?.name || 'Unassigned'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Team Members</span>
            <span className="font-semibold text-slate-200">{project.members?.length || 0} assigned</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Completion Progress</span>
            <span className="font-semibold text-emerald-400 font-mono">{project.progress || 0}% ({project.completedTasks}/{project.totalTasks} tasks)</span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 text-xs overflow-x-auto pb-1">
        {[
          { id: 'kanban', label: 'Kanban Board', icon: Kanban },
          { id: 'sprints', label: 'Backlog & Sprints', icon: Layers },
          { id: 'standup', label: 'Daily Stand-up', icon: CalendarCheck },
          { id: 'blockers', label: 'Blockers', icon: ShieldAlert },
          { id: 'risks', label: 'Risks', icon: AlertTriangle },
          { id: 'approvals', label: 'Client Approvals', icon: Building },
          { id: 'decisions', label: 'Decision Log', icon: BookOpen },
          { id: 'reports', label: 'Analytics Reports', icon: PieChart },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Area Content */}
      <div className="pt-2">
        {activeTab === 'kanban' && (
          <KanbanBoard
            projectId={project._id}
            customStatuses={project.customStatuses}
            onTaskSelect={(t) => setSelectedTask(t)}
          />
        )}

        {activeTab === 'sprints' && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-100">Sprint & Backlog Management</h3>
            <p className="text-xs text-slate-400">View and organize project sprints and backlog tasks.</p>
            <button
              onClick={() => navigate('/dashboard/sprints')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl"
            >
              Open Full Sprint Dashboard
            </button>
          </div>
        )}

        {activeTab === 'standup' && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-100">Daily Stand-up Board</h3>
            <p className="text-xs text-slate-400">Post and review daily progress updates for this project.</p>
            <button
              onClick={() => navigate('/dashboard/standup')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl"
            >
              Open Stand-up Board
            </button>
          </div>
        )}

        {activeTab === 'blockers' && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-100">Blocker & Issue Tracker</h3>
            <p className="text-xs text-slate-400">Track critical blockers impacting project delivery.</p>
            <button
              onClick={() => navigate('/dashboard/blockers')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl"
            >
              Open Blocker Dashboard
            </button>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-100">Project Risk Matrix</h3>
            <p className="text-xs text-slate-400">Evaluate severity, probability, and mitigation plans.</p>
            <button
              onClick={() => navigate('/dashboard/risks')}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl"
            >
              Open Risk Dashboard
            </button>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-100">Client Approval Portal</h3>
            <p className="text-xs text-slate-400">Submit deliverables and view client feedback decisions.</p>
            <button
              onClick={() => navigate('/dashboard/client')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl"
            >
              Open Client Approval Portal
            </button>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-100">Project Decision Log</h3>
            <p className="text-xs text-slate-400">Chronological history of major design and technical decisions.</p>
            <button
              onClick={() => navigate('/dashboard/decisions')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl"
            >
              Open Decision Log
            </button>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-100">Project Reports & Analytics</h3>
            <p className="text-xs text-slate-400">Visual Recharts breakdown of sprint velocity, status, and time spent.</p>
            <button
              onClick={() => navigate('/dashboard/reports')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl"
            >
              Open Reports Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Task Modal Popup */}
      {selectedTask && (
        <TaskModal
          taskId={selectedTask._id}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={fetchProject}
        />
      )}
    </div>
  );
}
