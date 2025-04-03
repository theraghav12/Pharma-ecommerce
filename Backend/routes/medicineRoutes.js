const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");

router.post("/add", medicineController.addMedicine);
router.get("/", medicineController.getAllMedicines);
router.get("/:id", medicineController.getMedicineById);
router.put("/:id", medicineController.updateMedicine);
router.delete("/:id", medicineController.deleteMedicine);
router.patch("/stock/:id", medicineController.updateStock);
router.get("/check-prescription/:id", medicineController.checkPrescription);

module.exports = router;
