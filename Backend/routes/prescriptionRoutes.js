const express = require("express");
const {
  createPrescription,
  getPrescriptionsByPatient,
  getPrescriptionById,
  deletePrescription
} = require("../controllers/prescriptionController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createPrescription); // Create prescription
router.get("/patient/:patientId", auth, getPrescriptionsByPatient); // Get prescriptions by patient ID
router.get("/:id", auth, getPrescriptionById); // Get specific prescription
router.delete("/:id", auth, deletePrescription); // Delete prescription

module.exports = router;
