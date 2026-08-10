import Checklist from '../models/Checklist.js';

export const getChecklist = async (req, res) => {
  try {
    let checklist = await Checklist.findOne({ task: req.params.taskId }).populate('items.completedBy', 'name');
    if (!checklist) {
      checklist = await Checklist.create({ task: req.params.taskId, items: [] });
    }
    return res.json({ status: true, data: checklist });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const addChecklistItem = async (req, res) => {
  try {
    const { title } = req.body;
    let checklist = await Checklist.findOne({ task: req.params.taskId });
    if (!checklist) {
      checklist = await Checklist.create({ task: req.params.taskId, items: [{ title }] });
    } else {
      checklist.items.push({ title });
      await checklist.save();
    }
    const updated = await Checklist.findById(checklist._id).populate('items.completedBy', 'name');
    return res.json({ status: true, data: updated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const toggleChecklistItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const checklist = await Checklist.findOne({ task: req.params.taskId });
    if (!checklist) return res.status(404).json({ status: false, message: 'Checklist not found' });

    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ status: false, message: 'Item not found' });

    item.completed = !item.completed;
    item.completedBy = item.completed ? req.user._id : null;
    await checklist.save();

    const updated = await Checklist.findById(checklist._id).populate('items.completedBy', 'name');
    return res.json({ status: true, data: updated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteChecklistItem = async (req, res) => {
  try {
    const checklist = await Checklist.findOne({ task: req.params.taskId });
    if (!checklist) return res.status(404).json({ status: false, message: 'Checklist not found' });

    checklist.items = checklist.items.filter((i) => i._id.toString() !== req.params.itemId);
    await checklist.save();

    return res.json({ status: true, data: checklist });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
