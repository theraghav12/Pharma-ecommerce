import express from 'express';
import prescriptionController from '../controllers/prescription.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

const router = express.Router();

router.post('/prescriptions/upload', prescriptionController.uploadPrescription);

router.get('/prescriptions',  prescriptionController.getPrescriptionsForReview);

router.put('/prescriptions/:id/review',  prescriptionController.reviewPrescription);

export default router;
