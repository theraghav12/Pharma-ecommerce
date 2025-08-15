import express from "express";
import * as medicineController from "../controllers/medicineController.js";
import adminAuth from "../middleware/AdminAuth.js";
import { uploadMedicineImages } from "../middleware/upload.js";
import { 
  addMedicine, 
  getAllMedicines, 
  getMedicineById, 
  updateMedicine, 
  deleteMedicine, 
  updateStock, 
  bulkUploadMedicines, 
  getMedicinesForDashboard 
} from '../controllers/medicineController.js';
import { getMedicinesWithoutImages, getSuggestedImage, approveImage } from '../controllers/imageSuggestionController.js';
import { autofillAndUpdateMedicine } from '../controllers/aiAutofillController.js';

const router = express.Router();

// AI Autofill route - Must be before the /:id route to avoid conflict
router.post('/:id/autofill', adminAuth, autofillAndUpdateMedicine);

router.post("/add", uploadMedicineImages, addMedicine);
router.post('/bulk-upload', bulkUploadMedicines);
router.get("/", getAllMedicines);
router.get('/no-images', getMedicinesWithoutImages);
router.get('/suggest-image', getSuggestedImage);
router.put('/:id/add-image', approveImage);
router.get('/dashboard',getMedicinesForDashboard);
router.get("/:id", getMedicineById);
router.put("/:id", adminAuth, uploadMedicineImages, updateMedicine);
router.delete("/:id",  deleteMedicine);
router.patch("/stock/:id",  updateStock);
// Add to your medicine routes

router.get("/check-prescription/:id", medicineController.checkPrescription);

export default router;
