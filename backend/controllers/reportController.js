import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Sprint from '../models/Sprint.js';
import TimeEntry from '../models/TimeEntry.js';
import Blocker from '../models/Blocker.js';

export const getReportSummary = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = {};
    if (projectId) filter.project = projectId;
    else if (req.user.organization) {
      const orgProjects = await Project.find({ organization: req.user.organization }).select('_id');
      filter.project = { $in: orgProjects.map((p) => p._id) };
    }

    const tasks = await Task.find(filter);
    const projects = await Project.find(req.user.organization ? { organization: req.user.organization } : {});
    const sprints = await Sprint.find(projectId ? { project: projectId } : {});
    const blockers = await Blocker.find(projectId ? { project: projectId } : {});

    // Metrics calculation
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Done' || t.status === 'Completed').length;
    const openTasks = totalTasks - completedTasks;
    const bugCount = tasks.filter((t) => t.type === 'Bug').length;
    const openBlockers = blockers.filter((b) => b.status !== 'Resolved').length;

    // Status breakdown
    const statusMap = {};
    tasks.forEach((t) => {
      statusMap[t.status] = (statusMap[t.status] || 0) + 1;
    });
    const statusDistribution = Object.keys(statusMap).map((key) => ({
      status: key,
      count: statusMap[key],
    }));

    // Priority breakdown
    const priorityMap = {};
    tasks.forEach((t) => {
      priorityMap[t.priority] = (priorityMap[t.priority] || 0) + 1;
    });
    const priorityDistribution = Object.keys(priorityMap).map((key) => ({
      priority: key,
      count: priorityMap[key],
    }));

    // Task Type distribution
    const typeMap = {};
    tasks.forEach((t) => {
      typeMap[t.type] = (typeMap[t.type] || 0) + 1;
    });
    const typeDistribution = Object.keys(typeMap).map((key) => ({
      type: key,
      count: typeMap[key],
    }));

    // Sprint Velocity (Completed vs Estimated)
    const sprintVelocity = sprints.map((s) => {
      const sprintTasks = tasks.filter((t) => t.sprint && t.sprint.toString() === s._id.toString());
      const doneTasks = sprintTasks.filter((t) => t.status === 'Done' || t.status === 'Completed');
      return {
        sprintName: s.name,
        totalTasks: sprintTasks.length,
        completedTasks: doneTasks.length,
      };
    });

    return res.json({
      status: true,
      data: {
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        openTasks,
        bugCount,
        openBlockers,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        statusDistribution,
        priorityDistribution,
        typeDistribution,
        sprintVelocity,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
