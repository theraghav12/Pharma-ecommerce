import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with authentication
router.use(auth);

// Profile routes
router.get('/',getProfile);
router.put('/',updateProfile);

export default router;
