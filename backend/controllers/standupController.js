import Standup from '../models/Standup.js';

export const createStandup = async (req, res) => {
  try {
    const { project, yesterday, today, blockers, date } = req.body;
    const standupDate = date || new Date().toISOString().split('T')[0];

    // Check if user already submitted standup for this project and date
    let standup = await Standup.findOne({ user: req.user._id, project, date: standupDate });
    if (standup) {
      standup.yesterday = yesterday;
      standup.today = today;
      standup.blockers = blockers || '';
      await standup.save();
    } else {
      standup = await Standup.create({
        user: req.user._id,
        project,
        yesterday,
        today,
        blockers: blockers || '',
        date: standupDate,
      });
    }

    const populated = await Standup.findById(standup._id).populate('user', 'name email avatar role');
    return res.status(201).json({ status: true, data: populated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getStandups = async (req, res) => {
  try {
    const { project, date } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (date) filter.date = date;

    const standups = await Standup.find(filter)
      .populate('user', 'name email avatar role')
      .sort({ createdAt: -1 });

    return res.json({ status: true, data: standups });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
