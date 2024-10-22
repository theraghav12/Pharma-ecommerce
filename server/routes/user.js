import express from 'express';
import userController from '../controllers/user.js';
import authMiddleware from '../middleware/auth.js';
import { validateRegisterUser } from '../middleware/validation.js';


const router = express.Router();

router.post('/register', validateRegisterUser, userController.registerUser);


router.post('/login', userController.loginUser);
router.get('/profile', authMiddleware, userController.getUserProfile);

router.put('/profile', authMiddleware, userController.updateUserProfile);

export default router;
