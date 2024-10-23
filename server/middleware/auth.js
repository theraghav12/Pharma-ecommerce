import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from the Authorization header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the token payload
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Authorization denied, user not found' });
    }

    // Attach the user to the request object for further use
    req.user = user;

    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, authorization denied' });
    }

    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

export default authMiddleware;
