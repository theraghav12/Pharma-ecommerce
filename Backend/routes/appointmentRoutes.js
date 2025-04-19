import express from "express";
import {
  createAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  cancelAppointment,
  getAppointmentsByUserId
} from "../controllers/appointmentController.js";
import auth from "../middleware/auth.js"; // Don’t forget to import `auth` if it's used

const router = express.Router();

router.post("/", auth, createAppointment); // Book appointment
router.get("/doctor", auth, getAppointmentsByDoctor); // Get all appointments for a doctor
router.get("/patient", auth, getAppointmentsByPatient); // Get all appointments for a patient
router.put("/:id/cancel", auth, cancelAppointment); // Cancel appointment
router.get("/user/:id", getAppointmentsByUserId);
export default router;
