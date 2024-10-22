import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user from the token payload
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Authorization denied, user not found' });
    }

    // Attach the user info to the request object
    req.user = user;

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

export default authMiddleware;
