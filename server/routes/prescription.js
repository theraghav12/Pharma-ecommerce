import express from 'express';
import prescriptionController from '../controllers/prescription.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

const router = express.Router();

router.post('/prescriptions/upload', authMiddleware, prescriptionController.uploadPrescription);

router.get('/prescriptions', authMiddleware, adminMiddleware, prescriptionController.getPrescriptionsForReview);

router.put('/prescriptions/:id/review', authMiddleware, adminMiddleware, prescriptionController.reviewPrescription);

export default router;
