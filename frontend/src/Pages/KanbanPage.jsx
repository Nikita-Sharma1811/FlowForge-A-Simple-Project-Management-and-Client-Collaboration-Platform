import React, { useState, useEffect } from 'react';
import { Kanban, Filter, Plus } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';

export default function KanbanPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await flowForgeApi.projects.list();
      setProjects(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedProjectId(res.data[0]._id);
      }
    } catch (err) {
      console.error('Fetch projects for kanban error:', err.message);
    }
  };

  const selectedProject = projects.find((p) => p._id === selectedProjectId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Kanban className="text-blue-500" size={24} />
            Real-Time Kanban Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag-and-drop tasks across custom project status columns with live WebSocket sync
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-900 text-slate-100 text-xs px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Board Display */}
      {selectedProjectId ? (
        <div className="bg-slate-950/40 p-4 border border-slate-800/80 rounded-3xl min-h-[75vh]">
          <KanbanBoard
            projectId={selectedProjectId}
            customStatuses={selectedProject?.customStatuses}
            onTaskSelect={(t) => setSelectedTask(t)}
          />
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500 text-xs border-2 border-dashed border-slate-800 rounded-3xl">
          No project selected. Create or select a project to view the Kanban board.
        </div>
      )}

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          taskId={selectedTask._id}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
