import ChatMessage from '../models/ChatMessage.js';

export const getProjectMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ project: req.params.projectId })
      .populate('sender', 'name email avatar role')
      .populate('readBy.user', 'name')
      .sort({ createdAt: 1 });
    return res.json({ status: true, data: messages });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { projectId, message, attachments } = req.body;
    const chatMsg = await ChatMessage.create({
      project: projectId,
      sender: req.user._id,
      message,
      attachments: attachments || [],
      readBy: [{ user: req.user._id, readAt: new Date() }],
    });

    const populated = await ChatMessage.findById(chatMsg._id)
      .populate('sender', 'name email avatar role')
      .populate('readBy.user', 'name');

    return res.status(201).json({ status: true, data: populated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { projectId } = req.params;
    await ChatMessage.updateMany(
      { project: projectId, 'readBy.user': { $ne: req.user._id } },
      { $push: { readBy: { user: req.user._id, readAt: new Date() } } }
    );
    return res.json({ status: true, message: 'Messages marked as read' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
