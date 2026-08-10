import TimeEntry from '../models/TimeEntry.js';
import Task from '../models/Task.js';

export const startTimer = async (req, res) => {
  try {
    const { taskId, description } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ status: false, message: 'Task not found' });

    // Stop any existing running timer for user
    await TimeEntry.updateMany(
      { user: req.user._id, isRunning: true },
      { isRunning: false, endTime: new Date() }
    );

    const entry = await TimeEntry.create({
      task: taskId,
      user: req.user._id,
      project: task.project,
      description: description || '',
      startTime: new Date(),
      isRunning: true,
    });

    const populated = await TimeEntry.findById(entry._id)
      .populate('task', 'title')
      .populate('user', 'name avatar');

    return res.status(201).json({ status: true, data: populated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const stopTimer = async (req, res) => {
  try {
    const { entryId } = req.body;
    let entry;
    if (entryId) {
      entry = await TimeEntry.findById(entryId);
    } else {
      entry = await TimeEntry.findOne({ user: req.user._id, isRunning: true });
    }

    if (!entry) return res.status(404).json({ status: false, message: 'No active timer found' });

    const endTime = new Date();
    const durationMinutes = Math.round((endTime - new Date(entry.startTime)) / (1000 * 60));

    entry.endTime = endTime;
    entry.durationMinutes = Math.max(1, durationMinutes);
    entry.isRunning = false;
    await entry.save();

    // Update Task loggedHours
    const durationHours = entry.durationMinutes / 60;
    await Task.findByIdAndUpdate(entry.task, { $inc: { loggedHours: Number(durationHours.toFixed(2)) } });

    return res.json({ status: true, data: entry });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const createManualTimeEntry = async (req, res) => {
  try {
    const { taskId, durationMinutes, description, date } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ status: false, message: 'Task not found' });

    const entry = await TimeEntry.create({
      task: taskId,
      user: req.user._id,
      project: task.project,
      description: description || 'Manual time log',
      startTime: date ? new Date(date) : new Date(),
      endTime: date ? new Date(date) : new Date(),
      durationMinutes: Number(durationMinutes),
      isRunning: false,
    });

    const durationHours = Number(durationMinutes) / 60;
    await Task.findByIdAndUpdate(taskId, { $inc: { loggedHours: Number(durationHours.toFixed(2)) } });

    return res.status(201).json({ status: true, data: entry });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getTimeEntries = async (req, res) => {
  try {
    const { taskId, project } = req.query;
    const filter = {};
    if (taskId) filter.task = taskId;
    if (project) filter.project = project;

    const entries = await TimeEntry.find(filter)
      .populate('task', 'title')
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    return res.json({ status: true, data: entries });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getActiveTimer = async (req, res) => {
  try {
    const entry = await TimeEntry.findOne({ user: req.user._id, isRunning: true })
      .populate('task', 'title project')
      .populate('project', 'name');
    return res.json({ status: true, data: entry || null });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
