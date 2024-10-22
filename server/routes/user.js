import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/register', validateRegisterUser, userController.registerUser);


router.post('/login', userController.loginUser);
router.get('/profile', authMiddleware, userController.getUserProfile);

router.put('/profile', authMiddleware, userController.updateUserProfile);

export default router;
