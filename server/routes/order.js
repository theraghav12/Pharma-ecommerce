import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/orders', authMiddleware, orderController.createOrder);


router.get('/orders', authMiddleware, orderController.getUserOrders);

router.put('/orders/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);


router.get('/admin/orders', authMiddleware, adminMiddleware, orderController.getAllOrders);

export default router;
