const express = require("express");
const {
  createPatientRecord,
  getPatientRecords,
  getPatientRecordById,
  updatePatientRecord,
  deletePatientRecord
} = require("../controllers/patientRecordController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createPatientRecord); // Create patient record
router.get("/", auth, getPatientRecords); // Get all patient records (for doctors)
router.get("/:id", auth, getPatientRecordById); // Get a specific patient record
router.put("/:id", auth, updatePatientRecord); // Update a patient record
router.delete("/:id", auth, deletePatientRecord); // Delete a patient record

module.exports = router;
