import express from "express";
import * as medicineController from "../controllers/medicineController.js";
import adminAuth from "../middleware/AdminAuth.js";

const router = express.Router();

router.post("/add",adminAuth ,medicineController.addMedicine);
router.get("/", medicineController.getAllMedicines);
router.get("/:id", medicineController.getMedicineById);
router.put("/:id", medicineController.updateMedicine);
router.delete("/:id", medicineController.deleteMedicine);
router.patch("/stock/:id", medicineController.updateStock);
router.get("/check-prescription/:id", medicineController.checkPrescription);

export default router;
