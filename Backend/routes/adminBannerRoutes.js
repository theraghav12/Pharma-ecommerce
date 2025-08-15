import express from 'express';
import { createBanner, getAllBanners, updateBanner, deleteBanner } from '../controllers/adminBanner.js';
import authenticate from '../middleware/auth.js';
import adminAuth from '../middleware/AdminAuth.js';
import upload from '../config/multer.js';

const router = express.Router();

// Apply both authenticate and adminAuth middleware to protect all routes
router.use(authenticate);
router.use(adminAuth);

// Create a new banner (Admin only)
router.post('/', upload.single('image'), createBanner);

// Get all banners (Public access)
router.get('/', getAllBanners);

// Update a banner (Admin only)
router.put('/:id', upload.single('image'), updateBanner);

// Delete a banner (Admin only)
router.delete('/:id', deleteBanner);

export default router;
