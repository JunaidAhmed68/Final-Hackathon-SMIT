import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: true, message: 'Token not provided!' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Token validation error:', err);
    res.status(401).json({ error: true, message: 'Invalid token!' });
  }
};

export default authMiddleware;