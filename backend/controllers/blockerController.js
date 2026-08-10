import Blocker from '../models/Blocker.js';

export const createBlocker = async (req, res) => {
  try {
    const { title, description, project, task, assignedTo, severity, status } = req.body;
    const blocker = await Blocker.create({
      title,
      description,
      project,
      task: task || null,
      reportedBy: req.user._id,
      assignedTo: assignedTo || null,
      severity: severity || 'High',
      status: status || 'Open',
    });

    const populated = await Blocker.findById(blocker._id)
      .populate('reportedBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name')
      .populate('task', 'title');

    return res.status(201).json({ status: true, data: populated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getBlockers = async (req, res) => {
  try {
    const { project, status } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (status) filter.status = status;

    const blockers = await Blocker.find(filter)
      .populate('reportedBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name')
      .populate('task', 'title')
      .sort({ createdAt: -1 });

    return res.json({ status: true, data: blockers });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateBlocker = async (req, res) => {
  try {
    const blocker = await Blocker.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('reportedBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name')
      .populate('task', 'title');

    if (!blocker) return res.status(404).json({ status: false, message: 'Blocker not found' });
    return res.json({ status: true, data: blocker });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteBlocker = async (req, res) => {
  try {
    await Blocker.findByIdAndDelete(req.params.id);
    return res.json({ status: true, message: 'Blocker deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
