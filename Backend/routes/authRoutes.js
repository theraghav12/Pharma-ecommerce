import express from "express";
import { register, login, getDoctors, getUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/doctors", getDoctors);     // GET all doctors
router.get("/:id", getUser);            
export default router;
