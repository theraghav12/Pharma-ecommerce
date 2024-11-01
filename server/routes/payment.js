import express from 'express';
import paymentController from '../controllers/payment.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Process payment (auth required)
router.post('/payment/process',  paymentController.processPayment);

// Get payment by ID (auth required)
router.get('/payment/:id',  paymentController.getPaymentById);

// Get user's payment history (auth required)
router.get('/payments',  paymentController.getUserPayments);

export default router;
