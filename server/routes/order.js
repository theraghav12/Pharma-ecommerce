import express from 'express';
import orderController from '../controllers/order.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

const router = express.Router();

router.post('/orders',  orderController.createOrder); 

router.get('/orders', orderController.getUserOrders); 

// Correct the path by adding the leading slash
router.get('/orders/:id',  orderController.getOrderById); 

router.put('/orders/:id/status',  orderController.updateOrderStatus); 

router.get('/admin/orders',  orderController.getAllOrders); 

export default router;
