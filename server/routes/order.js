import express from 'express';
import orderController from '../controllers/order.js';
import authMiddleware from '../middleware/admin.js';
import adminMiddleware from '../middleware/admin.js';

const router = express.Router();

router.post('/orders', authMiddleware, orderController.createOrder);


router.get('/orders', authMiddleware, orderController.getUserOrders);

router.put('/orders/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);


router.get('/admin/orders', authMiddleware, adminMiddleware, orderController.getAllOrders);

export default router;
