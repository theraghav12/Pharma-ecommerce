import express from 'express';
import productController from '../controllers/product.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/products', productController.getAllProducts);

router.get('/products/:id', productController.getProductById);
router.post('/create', authMiddleware, adminMiddleware, upload.single('image'), productController.createProduct);

router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), productController.updateProduct);

router.delete('/products/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

export default router;
