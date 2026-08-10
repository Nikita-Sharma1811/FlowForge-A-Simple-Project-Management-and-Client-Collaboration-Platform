import Label from '../models/Label.js';

export const createLabel = async (req, res) => {
  try {
    const { name, color, project } = req.body;
    const label = await Label.create({ name, color: color || '#3b82f6', project });
    return res.status(201).json({ status: true, data: label });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getLabels = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const labels = await Label.find(filter);
    return res.json({ status: true, data: labels });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteLabel = async (req, res) => {
  try {
    await Label.findByIdAndDelete(req.params.id);
    return res.json({ status: true, message: 'Label deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
