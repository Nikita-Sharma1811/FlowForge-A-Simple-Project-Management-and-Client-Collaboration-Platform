import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'flowforge_secret_key_jwt_2026_super_secure', {
    expiresIn: '30d',
  });
};
