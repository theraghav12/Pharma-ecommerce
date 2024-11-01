import express from 'express';
import cartController from '../controllers/cart.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Add item to cart (auth required)
router.post('/cart/add',  cartController.addItemToCart);

// Remove item from cart (auth required)
router.delete('/cart/remove',  cartController.removeItemFromCart);

// Get user's cart (auth required)
router.get('/cart', cartController.getCart);

// Clear cart (auth required)
router.delete('/cart/clear',  cartController.clearCart);

export default router;
