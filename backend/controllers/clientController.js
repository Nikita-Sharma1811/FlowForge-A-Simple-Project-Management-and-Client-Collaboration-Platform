import Client from '../models/Client.js';
import User from '../models/User.js';

export const createClient = async (req, res) => {
  try {
    const { name, company, email, projectIds } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: 'password123', // Default temporary password
        role: 'Client',
        organization: req.user.organization,
      });
    }

    const client = await Client.create({
      name,
      company,
      email,
      user: user._id,
      projects: projectIds || [],
    });

    return res.status(201).json({ status: true, data: client });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('user', 'name email').populate('projects', 'name status');
    return res.json({ status: true, data: clients });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
