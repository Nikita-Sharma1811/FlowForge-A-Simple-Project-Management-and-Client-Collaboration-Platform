import User from '../models/User.js';
import Organization from '../models/Organization.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, organizationName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: false, message: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Team Member',
    });

    let organization = null;
    if (organizationName) {
      organization = await Organization.create({
        name: organizationName,
        owner: user._id,
        members: [{ user: user._id, role: user.role }],
      });
      user.organization = organization._id;
      await user.save();
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      status: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).populate('organization', 'name description');
    if (user && (await user.matchPassword(password))) {
      user.status = 'online';
      user.lastActive = new Date();
      await user.save();

      const token = generateToken(user._id);

      return res.json({
        status: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          organization: user.organization,
          token,
        },
      });
    } else {
      return res.status(401).json({ status: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('organization');
    return res.json({ status: true, data: user });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
