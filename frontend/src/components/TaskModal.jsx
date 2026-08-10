import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Paperclip,
  CheckSquare,
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
  Play,
  Square,
  Plus,
  Trash2,
} from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TaskModal({
  taskId,
  isOpen,
  onClose,
  onTaskUpdated,
}) {
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [subtasks, setSubtasks] = useState([]);
  const [checklist, setChecklist] = useState({ items: [] });
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [newCheckitem, setNewCheckitem] = useState('');
  const [newComment, setNewComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  const fetchTaskDetails = async () => {
    try {
      const res = await flowForgeApi.tasks.getById(taskId);

      setTask(res.data);
      setSubtasks(res.data?.subtasks || []);

      const [ckRes, cmRes, atRes, tmRes] = await Promise.all([
        flowForgeApi.checklists.getByTask(taskId),
        flowForgeApi.comments.getByTask(taskId),
        flowForgeApi.uploads.getAttachments({ taskId }),
        flowForgeApi.time.list({ taskId }),
      ]);

      setChecklist(ckRes.data || { items: [] });
      setComments(cmRes.data || []);
      setAttachments(atRes.data || []);
      setTimeEntries(tmRes.data || []);
    } catch (err) {
      console.error('Fetch task modal error:', err.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await flowForgeApi.tasks.update(taskId, {
        status: newStatus,
      });

      setTask(res.data);

      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.error('Update status error:', err.message);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const res = await flowForgeApi.tasks.update(taskId, {
        priority: newPriority,
      });

      setTask(res.data);

      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.error('Update priority error:', err.message);
    }
  };

  const handleAddCheckitem = async (e) => {
    e.preventDefault();

    if (!newCheckitem.trim()) return;

    try {
      const res = await flowForgeApi.checklists.addItem(
        taskId,
        newCheckitem
      );

      setChecklist(res.data);
      setNewCheckitem('');
    } catch (err) {
      console.error('Add check item error:', err.message);
    }
  };

  const handleToggleCheckitem = async (itemId) => {
    try {
      const res = await flowForgeApi.checklists.toggleItem(
        taskId,
        itemId
      );

      setChecklist(res.data);
    } catch (err) {
      console.error('Toggle check item error:', err.message);
    }
  };

  // FIXED: Backend expects "task", not "taskId"
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const res = await flowForgeApi.comments.create({
        task: taskId,
        content: newComment,
      });

      setComments((prev) => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Add comment error:', err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);

    try {
      const res = await flowForgeApi.uploads.uploadFile(formData);

      setAttachments((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Upload error:', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();

    if (!newSubtaskTitle.trim() || !task) return;

    try {
      const res = await flowForgeApi.tasks.create({
        title: newSubtaskTitle,
        type: 'Subtask',
        parentTask: task._id,
        project: task.project?._id || task.project,
      });

      setSubtasks((prev) => [...prev, res.data]);
      setNewSubtaskTitle('');
    } catch (err) {
      console.error('Add subtask error:', err.message);
    }
  };

  const handleStartTimer = async () => {
    try {
      await flowForgeApi.time.startTimer({
        taskId,
      });

      fetchTaskDetails();
    } catch (err) {
      console.error('Start timer error:', err.message);
    }
  };

  if (!isOpen || !task) return null;

  const totalCheckItems = checklist?.items?.length || 0;

  const completedCheckItems =
    checklist?.items?.filter((i) => i.completed)?.length || 0;

  const checklistPercent =
    totalCheckItems > 0
      ? Math.round((completedCheckItems / totalCheckItems) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  task.type === 'Bug'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : task.type === 'Epic'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : task.type === 'Story'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {task.type}
              </span>

              <span className="text-[10px] text-slate-500 font-mono">
                #{task._id?.slice(-6)}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-100 truncate">
              {task.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status & Details Quick Bar */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center gap-4 text-xs">

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>

            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
            >
              {(
                task.project?.customStatuses || [
                  'Todo',
                  'In Progress',
                  'Review',
                  'Testing',
                  'Done',
                ]
              ).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Priority:</span>

            <select
              value={task.priority}
              onChange={(e) =>
                handlePriorityChange(e.target.value)
              }
              className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 ml-auto">
            <User size={14} className="text-slate-500" />
            <span>
              Assignee: {task.assignee?.name || 'Unassigned'}
            </span>
          </div>

          <button
            onClick={handleStartTimer}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow"
          >
            <Play size={12} />
            <span>Start Timer</span>
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-5 gap-2 text-xs overflow-x-auto">
          {[
            {
              id: 'overview',
              label: 'Overview',
            },
            {
              id: 'checklist',
              label: `Checklist (${completedCheckItems}/${totalCheckItems})`,
            },
            {
              id: 'time',
              label: `Time (${task.loggedHours || 0}h logged)`,
            },
            {
              id: 'attachments',
              label: `Files (${attachments.length})`,
            },
            {
              id: 'comments',
              label: `Comments (${comments.length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Description
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 whitespace-pre-wrap">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              {/* Subtasks */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Subtasks
                </h4>

                <div className="space-y-2">
                  {subtasks.map((st) => (
                    <div
                      key={st._id}
                      className="flex items-center justify-between p-2.5 bg-slate-800/40 border border-slate-800 rounded-xl text-xs"
                    >
                      <span className="text-slate-200 font-medium">
                        {st.title}
                      </span>

                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                        {st.status}
                      </span>
                    </div>
                  ))}

                  <form
                    onSubmit={handleAddSubtask}
                    className="flex gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) =>
                        setNewSubtaskTitle(e.target.value)
                      }
                      placeholder="Add a new subtask..."
                      className="flex-1 bg-slate-950 text-slate-200 placeholder-slate-500 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                    />

                    <button
                      type="submit"
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Completion Progress ({checklistPercent}%)
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{
                    width: `${checklistPercent}%`,
                  }}
                />
              </div>

              <div className="space-y-2 pt-2">
                {checklist.items.map((item) => (
                  <div
                    key={item._id}
                    onClick={() =>
                      handleToggleCheckitem(item._id)
                    }
                    className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer text-xs transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
                    />

                    <span
                      className={`flex-1 text-slate-200 ${
                        item.completed
                          ? 'line-through text-slate-500'
                          : ''
                      }`}
                    >
                      {item.title}
                    </span>

                    {item.completedBy && (
                      <span className="text-[10px] text-slate-500">
                        Done by {item.completedBy.name}
                      </span>
                    )}
                  </div>
                ))}

                <form
                  onSubmit={handleAddCheckitem}
                  className="flex gap-2 pt-3"
                >
                  <input
                    type="text"
                    value={newCheckitem}
                    onChange={(e) =>
                      setNewCheckitem(e.target.value)
                    }
                    placeholder="Add checklist item..."
                    className="flex-1 bg-slate-950 text-slate-200 placeholder-slate-500 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium"
                  >
                    Add Item
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Time */}
          {activeTab === 'time' && (
            <div className="space-y-4 text-xs">

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Total Time Logged
                  </span>

                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    {task.loggedHours || 0} hrs
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Estimated Time
                  </span>

                  <span className="text-xl font-bold text-slate-200 font-mono">
                    {task.estimatedHours || 0} hrs
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-semibold text-slate-300">
                  Time Entries Log
                </h5>

                {timeEntries.map((entry) => (
                  <div
                    key={entry._id}
                    className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="text-slate-200 font-medium">
                        {entry.description || 'Time log'}
                      </span>

                      <span className="text-slate-500 text-[10px] block">
                        By {entry.user?.name}
                      </span>
                    </div>

                    <span className="font-mono text-emerald-400 font-semibold">
                      {entry.durationMinutes} mins
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {activeTab === 'attachments' && (
            <div className="space-y-4 text-xs">

              <div className="p-4 border-2 border-dashed border-slate-800 rounded-2xl text-center bg-slate-950/30">
                <Paperclip
                  className="mx-auto text-slate-500 mb-2"
                  size={24}
                />

                <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-medium inline-block transition-colors">
                  {uploading
                    ? 'Uploading...'
                    : 'Choose File to Upload (Multer)'}

                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-2">
                {attachments.map((file) => (
                  <div
                    key={file._id}
                    className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip
                        size={16}
                        className="text-blue-400"
                      />

                      <div>
                        <a
                          href={`${
                            import.meta.env.VITE_SOCKET_URL ||
                            'http://localhost:5000'
                          }${file.path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline font-medium"
                        >
                          {file.originalName}
                        </a>

                        <span className="text-[10px] text-slate-500 block">
                          {(file.size / 1024).toFixed(1)} KB •
                          Uploaded by{' '}
                          {file.uploadedBy?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {activeTab === 'comments' && (
            <div className="space-y-4">

              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No comments yet. Add the first comment.
                  </div>
                ) : (
                  comments.map((cm) => (
                    <div
                      key={cm._id}
                      className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-200">
                          {cm.user?.name || 'User'}
                        </span>

                        <span className="text-slate-500">
                          {new Date(
                            cm.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-slate-300 leading-relaxed">
                        {cm.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleAddComment}
                className="flex gap-2 pt-2"
              >
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) =>
                    setNewComment(e.target.value)
                  }
                  placeholder="Write a comment..."
                  className="flex-1 bg-slate-950 text-slate-200 placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium"
                >
                  Comment
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}