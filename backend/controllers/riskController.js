import Risk from '../models/Risk.js';

export const createRisk = async (req, res) => {
  try {
    const { title, description, project, probability, impact, severity, owner, status, mitigationPlan } = req.body;
    const risk = await Risk.create({
      title,
      description: description || '',
      project,
      probability: probability || 'Medium',
      impact: impact || 'Medium',
      severity: severity || 'Medium',
      owner: owner || req.user._id,
      status: status || 'Open',
      mitigationPlan: mitigationPlan || '',
    });

    const populated = await Risk.findById(risk._id).populate('owner', 'name email avatar').populate('project', 'name');
    return res.status(201).json({ status: true, data: populated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getRisks = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const risks = await Risk.find(filter)
      .populate('owner', 'name email avatar')
      .populate('project', 'name')
      .sort({ createdAt: -1 });
    return res.json({ status: true, data: risks });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateRisk = async (req, res) => {
  try {
    const risk = await Risk.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('owner', 'name email avatar')
      .populate('project', 'name');
    if (!risk) return res.status(404).json({ status: false, message: 'Risk not found' });
    return res.json({ status: true, data: risk });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteRisk = async (req, res) => {
  try {
    await Risk.findByIdAndDelete(req.params.id);
    return res.json({ status: true, message: 'Risk deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
