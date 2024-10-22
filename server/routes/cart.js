import express from 'express';
import cartController from '../controllers/cart.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Add item to cart (auth required)
router.post('/cart/add', authMiddleware, cartController.addItemToCart);

// Remove item from cart (auth required)
router.delete('/cart/remove', authMiddleware, cartController.removeItemFromCart);

// Get user's cart (auth required)
router.get('/cart', authMiddleware, cartController.getCart);

// Clear cart (auth required)
router.delete('/cart/clear', authMiddleware, cartController.clearCart);

export default router;
