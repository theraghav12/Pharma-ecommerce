import express from 'express';
import paymentController from '../controllers/paymentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Process payment (auth required)
router.post('/payment/process', authMiddleware, paymentController.processPayment);

// Get payment by ID (auth required)
router.get('/payment/:id', authMiddleware, paymentController.getPaymentById);

// Get user's payment history (auth required)
router.get('/payments', authMiddleware, paymentController.getUserPayments);

export default router;
