import Organization from '../models/Organization.js';
import User from '../models/User.js';

export const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;
    const organization = await Organization.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: req.user.role }],
    });

    req.user.organization = organization._id;
    await req.user.save();

    return res.status(201).json({ status: true, data: organization });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().populate('owner', 'name email').populate('members.user', 'name email role');
    return res.json({ status: true, data: orgs });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email role avatar status');
    if (!org) return res.status(404).json({ status: false, message: 'Organization not found' });
    return res.json({ status: true, data: org });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const addMemberToOrganization = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ status: false, message: 'Organization not found' });

    const exists = org.members.some((m) => m.user.toString() === userId);
    if (!exists) {
      org.members.push({ user: userId, role: role || 'Team Member' });
      await org.save();

      await User.findByIdAndUpdate(userId, { organization: org._id });
    }

    const updatedOrg = await Organization.findById(req.params.id).populate('members.user', 'name email role avatar');
    return res.json({ status: true, data: updatedOrg });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const removeMemberFromOrganization = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ status: false, message: 'Organization not found' });

    org.members = org.members.filter((m) => m.user.toString() !== req.params.userId);
    await org.save();

    await User.findByIdAndUpdate(req.params.userId, { $unset: { organization: 1 } });
    return res.json({ status: true, message: 'Member removed from organization' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
