import express from "express";
import {
  createAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  cancelAppointment,
  getAppointmentsByUserId,
  getDoctorAppointments,
  listAllDoctors,
  deleteAppointment,
  completeAppointment
} from "../controllers/appointmentController.js";
import auth from "../middleware/auth.js"; // Don’t forget to import `auth` if it's used

const router = express.Router();

router.post("/", auth, createAppointment); // Book appointment
router.get("/doctor", auth, getAppointmentsByDoctor); // Get all appointments for a doctor
router.get("/patient", auth, getAppointmentsByPatient); // Get all appointments for a patient
router.get("/doctor/:id", auth, getDoctorAppointments); // Get all appointments for a doctor
router.put("/cancel/:id", auth, cancelAppointment); // Cancel appointment
router.put("/complete/:id", auth, completeAppointment); 
router.get("/user/:id", getAppointmentsByUserId);
router.get("/list-doctors", listAllDoctors); // List all doctors
router.delete("/delete/:id", auth, deleteAppointment);
export default router;
