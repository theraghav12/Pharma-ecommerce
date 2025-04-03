const express = require("express");
const {
  createAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  cancelAppointment
} = require("../controllers/appointmentController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createAppointment); // Book appointment
router.get("/doctor", auth, getAppointmentsByDoctor); // Get all appointments for a doctor
router.get("/patient", auth, getAppointmentsByPatient); // Get all appointments for a patient
router.put("/:id/cancel", auth, cancelAppointment); // Cancel appointment

module.exports = router;
