import express from 'express';
import { autofillMedicineDetails, getAutofillOptions } from '../controllers/aiAutofillController.js';
import adminAuth from '../middleware/AdminAuth.js';

const router = express.Router();

// Get available autofill options
router.get('/options', adminAuth, getAutofillOptions);

// Autofill medicine details
router.post('/medicine/:medicineId', adminAuth, autofillMedicineDetails);

export default router;
