import express from 'express';
import orderController from '../controllers/order.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

const router = express.Router();

router.post('/orders', authMiddleware, orderController.createOrder); 

router.get('/orders', authMiddleware, orderController.getUserOrders); 

// Correct the path by adding the leading slash
router.get('/orders/:id', authMiddleware, orderController.getOrderById); 

router.put('/orders/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus); 

router.get('/admin/orders', authMiddleware, adminMiddleware, orderController.getAllOrders); 

export default router;
