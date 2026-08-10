import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.read).length;
    return res.json({ status: true, data: notifications, unreadCount });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    return res.json({ status: true, message: 'Notification marked as read' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    return res.json({ status: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
