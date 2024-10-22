import express from 'express';
import prescriptionController from '../controllers/prescriptionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/prescriptions/upload', authMiddleware, prescriptionController.uploadPrescription);

router.get('/prescriptions', authMiddleware, adminMiddleware, prescriptionController.getPrescriptionsForReview);

router.put('/prescriptions/:id/review', authMiddleware, adminMiddleware, prescriptionController.reviewPrescription);

export default router;
