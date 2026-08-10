import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const createProject = async (req, res) => {
  try {
    const { name, description, status, priority, deadline, customStatuses, members, projectManager } = req.body;
    const project = await Project.create({
      name,
      description,
      organization: req.user.organization,
      projectManager: projectManager || req.user._id,
      members: members || [req.user._id],
      status: status || 'Active',
      priority: priority || 'Medium',
      deadline: deadline || null,
      customStatuses: customStatuses || ['Backlog', 'Todo', 'In Progress', 'Review', 'Testing', 'Done'],
      createdBy: req.user._id,
    });

    const populated = await Project.findById(project._id)
      .populate('projectManager', 'name email avatar')
      .populate('members', 'name email avatar role');

    return res.status(201).json({ status: true, data: populated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Client') {
      query.members = req.user._id;
    } else if (req.user.organization) {
      query.organization = req.user.organization;
    }

    const projects = await Project.find(query)
      .populate('projectManager', 'name email avatar')
      .populate('members', 'name email avatar role')
      .sort({ createdAt: -1 });

    return res.json({ status: true, data: projects });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('projectManager', 'name email avatar')
      .populate('members', 'name email avatar role status');

    if (!project) return res.status(404).json({ status: false, message: 'Project not found' });

    // Calculate project progress
    const tasks = await Task.find({ project: project._id });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Done' || t.status === 'Completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return res.json({
      status: true,
      data: {
        ...project.toObject(),
        totalTasks,
        completedTasks,
        progress,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ status: false, message: 'Project not found' });

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('projectManager', 'name email avatar')
      .populate('members', 'name email avatar role');

    return res.json({ status: true, data: updated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ status: false, message: 'Project not found' });

    await project.deleteOne();
    await Task.deleteMany({ project: req.params.id });

    return res.json({ status: true, message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateCustomStatuses = async (req, res) => {
  try {
    const { customStatuses } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ status: false, message: 'Project not found' });

    project.customStatuses = customStatuses;
    await project.save();

    return res.json({ status: true, data: project });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
