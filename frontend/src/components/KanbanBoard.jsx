import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, User, Clock, AlertCircle, MessageSquare, CheckSquare } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useSocket } from '../context/SocketContext';

function KanbanTaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityColors = {
    Low: 'border-l-blue-500 text-blue-400 bg-blue-500/10',
    Medium: 'border-l-amber-500 text-amber-400 bg-amber-500/10',
    High: 'border-l-rose-500 text-rose-400 bg-rose-500/10',
    Critical: 'border-l-purple-500 text-purple-400 bg-purple-500/10',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className={`p-3.5 bg-slate-900 border border-slate-800 border-l-4 rounded-xl shadow-lg cursor-grab active:cursor-grabbing hover:border-slate-700 transition-all ${
        priorityColors[task.priority] || 'border-l-blue-500'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            task.type === 'Bug'
              ? 'bg-rose-500/20 text-rose-400'
              : task.type === 'Epic'
              ? 'bg-purple-500/20 text-purple-400'
              : task.type === 'Story'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-blue-500/20 text-blue-400'
          }`}
        >
          {task.type}
        </span>
        <span className="text-[10px] font-mono text-slate-500">{task.priority}</span>
      </div>

      <h4 className="text-xs font-semibold text-slate-100 mb-2 leading-snug line-clamp-2">{task.title}</h4>

      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.map((lbl) => (
            <span key={lbl} className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
              {lbl}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-[9px]">
            {task.assignee?.name ? task.assignee.name.charAt(0) : '?'}
          </div>
          <span className="truncate max-w-[80px]">{task.assignee?.name || 'Unassigned'}</span>
        </div>

        {task.deadline && (
          <div className="flex items-center gap-1 text-[10px]">
            <Clock size={11} />
            <span>{new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Column({ status, tasks, onCardClick, onQuickAdd }) {
  const { setNodeRef } = useSortable({ id: status });

  return (
    <div ref={setNodeRef} className="w-80 flex-shrink-0 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">{status}</h3>
          <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onQuickAdd(status)}
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg"
          title="Add Task"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanTaskCard key={task._id} task={task} onClick={onCardClick} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-28 border-2 border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-xs text-slate-600">
            Drop task here
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ projectId, customStatuses, onTaskSelect }) {
  const { socket, joinProjectRoom, leaveProjectRoom } = useSocket();
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const statuses = customStatuses && customStatuses.length > 0
    ? customStatuses
    : ['Backlog', 'Todo', 'In Progress', 'Review', 'Testing', 'Done'];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (!projectId) return;

    fetchTasks();
    joinProjectRoom(projectId);

    if (socket) {
      const handleTaskCreated = (newTask) => {
        setTasks((prev) => [...prev, newTask]);
      };
      const handleTaskUpdated = (updatedTask) => {
        setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      };
      const handleTaskMoved = ({ taskId, status }) => {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
      };

      socket.on('task:created', handleTaskCreated);
      socket.on('task:updated', handleTaskUpdated);
      socket.on('task:moved', handleTaskMoved);

      return () => {
        socket.off('task:created', handleTaskCreated);
        socket.off('task:updated', handleTaskUpdated);
        socket.off('task:moved', handleTaskMoved);
        leaveProjectRoom(projectId);
      };
    }
  }, [projectId, socket]);

  const fetchTasks = async () => {
    try {
      const res = await flowForgeApi.tasks.list({ project: projectId });
      setTasks(res.data || []);
    } catch (err) {
      console.error('Fetch tasks error:', err.message);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t._id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Determine target status column
    let newStatus = overId;
    // If dropped over another task card, find that task's status column
    const overTask = tasks.find((t) => t._id === overId);
    if (overTask) {
      newStatus = overTask.status;
    }

    const currentTask = tasks.find((t) => t._id === activeId);
    if (currentTask && currentTask.status !== newStatus && statuses.includes(newStatus)) {
      // Optimistic update
      setTasks((prev) => prev.map((t) => (t._id === activeId ? { ...t, status: newStatus } : t)));

      try {
        await flowForgeApi.tasks.update(activeId, { status: newStatus });
        if (socket && projectId) {
          socket.emit('task:move', { project: projectId, taskId: activeId, status: newStatus });
        }
      } catch (err) {
        console.error('Failed to update task status:', err.message);
        fetchTasks();
      }
    }
  };

  const handleQuickAdd = async (status) => {
    const title = prompt(`Enter quick task title for column '${status}':`);
    if (!title) return;

    try {
      const res = await flowForgeApi.tasks.create({
        title,
        status,
        project: projectId,
      });

      setTasks((prev) => [...prev, res.data]);
      if (socket && projectId) {
        socket.emit('task:create', { project: projectId, ...res.data });
      }
    } catch (err) {
      console.error('Quick add task error:', err.message);
    }
  };

  return (
    <div className="w-full h-full overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4">
          {statuses.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              onCardClick={onTaskSelect}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <KanbanTaskCard task={activeTask} onClick={() => {}} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
