import User from '../models/User.js';
import Task from '../models/Task.js';

export const getUsers = async (req, res) => {
  try {
    const query = {};
    if (req.user.organization) {
      query.organization = req.user.organization;
    }
    const users = await User.find(query).select('-password').populate('organization', 'name');
    return res.json({ status: true, data: users });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });

    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();
    return res.json({
      status: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });

    user.role = role;
    await user.save();
    return res.json({ status: true, message: 'User role updated successfully', data: user });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getUserWorkload = async (req, res) => {
  try {
    const users = await User.find({ organization: req.user.organization }).select('-password');
    const tasks = await Task.find({}).populate('assignee', 'name email');

    // Calculate workload per user
    const workloadMap = users.map((user) => {
      const userTasks = tasks.filter((t) => t.assignee && t.assignee._id.toString() === user._id.toString());
      const activeTasks = userTasks.filter((t) => t.status !== 'Done' && t.status !== 'Completed');
      const completedTasks = userTasks.filter((t) => t.status === 'Done' || t.status === 'Completed');
      const overdueTasks = userTasks.filter(
        (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Done' && t.status !== 'Completed'
      );
      const estHours = userTasks.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);
      const loggedHours = userTasks.reduce((acc, curr) => acc + (curr.loggedHours || 0), 0);

      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          status: user.status,
        },
        totalTasks: userTasks.length,
        activeTasks: activeTasks.length,
        completedTasks: completedTasks.length,
        overdueTasks: overdueTasks.length,
        estimatedHours: estHours,
        loggedHours: loggedHours,
      };
    });

    // Calculate average workload for overload warning detection
    const totalActiveTasks = workloadMap.reduce((acc, curr) => acc + curr.activeTasks, 0);
    const avgActiveTasks = workloadMap.length ? totalActiveTasks / workloadMap.length : 0;

    const formattedWorkload = workloadMap.map((item) => ({
      ...item,
      isOverloaded: item.activeTasks > Math.max(5, avgActiveTasks * 1.5) || item.estimatedHours > 40,
    }));

    return res.json({ status: true, data: formattedWorkload });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
