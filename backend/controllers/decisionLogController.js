import DecisionLog from '../models/DecisionLog.js';

export const createDecision = async (req, res) => {
  try {
    const { title, description, project, reason, impact, date } = req.body;
    const decision = await DecisionLog.create({
      title,
      description,
      project,
      madeBy: req.user._id,
      reason,
      impact,
      date: date || new Date(),
    });

    const populated = await DecisionLog.findById(decision._id)
      .populate('madeBy', 'name email avatar')
      .populate('project', 'name');

    return res.status(201).json({ status: true, data: populated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getDecisions = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const decisions = await DecisionLog.find(filter)
      .populate('madeBy', 'name email avatar')
      .populate('project', 'name')
      .sort({ date: -1, createdAt: -1 });

    return res.json({ status: true, data: decisions });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
