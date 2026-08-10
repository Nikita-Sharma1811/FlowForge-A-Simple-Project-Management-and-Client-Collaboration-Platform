import Sprint from '../models/Sprint.js';
import Task from '../models/Task.js';

export const createSprint = async (req, res) => {
  try {
    const { name, goal, project, startDate, endDate, status } = req.body;
    const sprint = await Sprint.create({
      name,
      goal: goal || '',
      project,
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || 'Planning',
    });
    return res.status(201).json({ status: true, data: sprint });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getSprints = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const sprints = await Sprint.find(filter).sort({ createdAt: -1 });

    // Calculate sprint completion stats dynamically
    const sprintsWithStats = await Promise.all(
      sprints.map(async (sprint) => {
        const tasks = await Task.find({ sprint: sprint._id });
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'Done' || t.status === 'Completed').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          ...sprint.toObject(),
          totalTasks: total,
          completedTasks: completed,
          remainingTasks: total - completed,
          progress,
        };
      })
    );

    return res.json({ status: true, data: sprintsWithStats });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sprint) return res.status(404).json({ status: false, message: 'Sprint not found' });
    return res.json({ status: true, data: sprint });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) return res.status(404).json({ status: false, message: 'Sprint not found' });

    // Move tasks in sprint back to backlog (sprint: null)
    await Task.updateMany({ sprint: req.params.id }, { $unset: { sprint: 1 } });
    await sprint.deleteOne();

    return res.json({ status: true, message: 'Sprint deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
