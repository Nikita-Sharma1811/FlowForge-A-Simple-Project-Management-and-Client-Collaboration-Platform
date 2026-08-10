import Task from '../models/Task.js';
import Notification from '../models/Notification.js';

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      status,
      priority,
      assignee,
      project,
      sprint,
      parentTask,
      labels,
      deadline,
      estimatedHours,
    } = req.body;

    const task = await Task.create({
      title,
      description: description || '',
      type: type || 'Task',
      status: status || 'Todo',
      priority: priority || 'Medium',
      assignee: assignee || null,
      reporter: req.user._id,
      project,
      sprint: sprint || null,
      parentTask: parentTask || null,
      labels: labels || [],
      deadline: deadline || null,
      estimatedHours: estimatedHours || 0,
      createdBy: req.user._id,
    });

    const populated = await Task.findById(task._id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'name')
      .populate('sprint', 'name')
      .populate('parentTask', 'title type status');

    // Notify assignee if assigned
    if (assignee && assignee !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignee,
        sender: req.user._id,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You were assigned task "${task.title}"`,
        link: `/dashboard/projects/${project}`,
      });
    }

    return res.status(201).json({ status: true, data: populated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { project, sprint, assignee, status, priority, type, search } = req.query;
    let filter = {};

    if (project) filter.project = project;
    if (sprint) filter.sprint = sprint;
    if (assignee) filter.assignee = assignee;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'name')
      .populate('sprint', 'name')
      .populate('parentTask', 'title type status')
      .sort({ order: 1, createdAt: -1 });

    return res.json({ status: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar status')
      .populate('reporter', 'name email avatar')
      .populate('project', 'name customStatuses')
      .populate('sprint', 'name')
      .populate('parentTask', 'title type status');

    if (!task) return res.status(404).json({ status: false, message: 'Task not found' });

    // Fetch subtasks if any
    const subtasks = await Task.find({ parentTask: task._id }).populate('assignee', 'name avatar');

    return res.json({
      status: true,
      data: {
        ...task.toObject(),
        subtasks,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ status: false, message: 'Task not found' });

    const prevStatus = task.status;
    const prevAssignee = task.assignee?.toString();

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'name')
      .populate('sprint', 'name')
      .populate('parentTask', 'title type status');

    // Send notifications if status changed or assignee changed
    if (req.body.assignee && req.body.assignee !== prevAssignee) {
      await Notification.create({
        recipient: req.body.assignee,
        sender: req.user._id,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `Task "${updatedTask.title}" was assigned to you`,
        link: `/dashboard/projects/${updatedTask.project._id}`,
      });
    }

    return res.json({ status: true, data: updatedTask });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ status: false, message: 'Task not found' });

    await task.deleteOne();
    // Delete child subtasks
    await Task.deleteMany({ parentTask: req.params.id });

    return res.json({ status: true, message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
