import express from 'express';
import { uploadImages, deleteImage } from '../controllers/uploadController.js';

const router = express.Router();

// Upload images
router.post('/images', uploadImages);

// Delete an image
router.delete('/images', deleteImage);

export default router;
