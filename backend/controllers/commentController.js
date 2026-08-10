import Comment from '../models/Comment.js';

export const createComment = async (req, res) => {
  try {
    const { task, content, mentions, attachments } = req.body;
    const comment = await Comment.create({
      task,
      user: req.user._id,
      content,
      mentions: mentions || [],
      attachments: attachments || [],
    });

    const populated = await Comment.findById(comment._id).populate('user', 'name email avatar');
    return res.status(201).json({ status: true, data: populated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getTaskComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: 1 });
    return res.json({ status: true, data: comments });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ status: false, message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ status: false, message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    return res.json({ status: true, message: 'Comment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
