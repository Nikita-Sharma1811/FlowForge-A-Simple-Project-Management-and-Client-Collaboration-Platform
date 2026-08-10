import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flowforge_secret_key_jwt_2026_super_secure');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ status: false, message: 'User not found' });
      }
      return next();
    } catch (error) {
      console.error('[Auth Middleware] Invalid token:', error.message);
      return res.status(401).json({ status: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ status: false, message: 'Not authorized, no token provided' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: false, message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        message: `User role '${req.user.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
