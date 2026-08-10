import Team from '../models/Team.js';

export const createTeam = async (req, res) => {
  try {
    const { name, description, organizationId, leaderId, memberIds } = req.body;
    const team = await Team.create({
      name,
      description,
      organization: organizationId || req.user.organization,
      leader: leaderId || req.user._id,
      members: memberIds || [req.user._id],
    });
    return res.status(201).json({ status: true, data: team });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const query = {};
    if (req.user.organization) {
      query.organization = req.user.organization;
    }
    const teams = await Team.find(query)
      .populate('leader', 'name email avatar')
      .populate('members', 'name email avatar role');
    return res.json({ status: true, data: teams });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
