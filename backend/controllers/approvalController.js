import Approval from '../models/Approval.js';
import Notification from '../models/Notification.js';

export const createApproval = async (req, res) => {
  try {
    const { title, deliverableName, description, project, client } = req.body;
    const approval = await Approval.create({
      title,
      deliverableName,
      description: description || '',
      project,
      client: client || null,
      status: 'Pending',
      requestedBy: req.user._id,
    });

    const populated = await Approval.findById(approval._id)
      .populate('project', 'name')
      .populate('client', 'name email')
      .populate('requestedBy', 'name email');

    // Send notification to client if assigned
    if (client) {
      await Notification.create({
        recipient: client,
        sender: req.user._id,
        type: 'approval_requested',
        title: 'New Deliverable Ready for Approval',
        message: `Please review deliverable: ${deliverableName}`,
        link: `/dashboard/client`,
      });
    }

    return res.status(201).json({ status: true, data: populated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getApprovals = async (req, res) => {
  try {
    const { project, status } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (status) filter.status = status;

    if (req.user.role === 'Client') {
      filter.client = req.user._id;
    }

    const approvals = await Approval.find(filter)
      .populate('project', 'name')
      .populate('client', 'name email')
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ status: true, data: approvals });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const respondToApproval = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const approval = await Approval.findById(req.params.id);
    if (!approval) return res.status(404).json({ status: false, message: 'Approval request not found' });

    approval.status = status;
    approval.feedback = feedback || '';
    approval.respondedDate = new Date();
    await approval.save();

    // Notify requester of decision
    if (approval.requestedBy) {
      await Notification.create({
        recipient: approval.requestedBy,
        sender: req.user._id,
        type: 'approval_response',
        title: `Deliverable ${status}`,
        message: `Client ${req.user.name} marked "${approval.deliverableName}" as ${status}`,
        link: `/dashboard/projects/${approval.project}`,
      });
    }

    const updated = await Approval.findById(approval._id)
      .populate('project', 'name')
      .populate('client', 'name email')
      .populate('requestedBy', 'name email');

    return res.json({ status: true, data: updated });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
