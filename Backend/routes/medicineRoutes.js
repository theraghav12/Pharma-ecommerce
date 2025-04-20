import express from "express";
import * as medicineController from "../controllers/medicineController.js";
import adminAuth from "../middleware/AdminAuth.js";
import { uploadMedicineImages } from "../middleware/upload.js";
import { getMedicinesForDashboard } from "../controllers/medicineController.js";

const router = express.Router();

router.post("/add", uploadMedicineImages, medicineController.addMedicine);
router.get("/", medicineController.getAllMedicines);
router.get('/dashboard',getMedicinesForDashboard);
router.get("/:id", medicineController.getMedicineById);
router.put("/:id",  uploadMedicineImages, medicineController.updateMedicine);
router.delete("/:id",  medicineController.deleteMedicine);
router.patch("/stock/:id",  medicineController.updateStock);
// Add to your medicine routes

router.get("/check-prescription/:id", medicineController.checkPrescription);

export default router;
