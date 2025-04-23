// const express = require("express");
import express from "express"
import dotenv from "dotenv"
// const connectDB = require("./config/db");
import connectDB from './config/db.js'
import authRoutes from "./routes/authRoutes.js"
import patientRecordRoutes from "./routes/patientRecordRoutes.js"
import prescriptionRoutes from "./routes/prescriptionRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
// const authRoutes = require("./routes/authRoutes");
// const patientRecordRoutes = require("./routes/patientRecordRoutes");
// const prescriptionRoutes = require("./routes/prescriptionRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");

import medicineRoutes from "./routes/medicineRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import adminRoutes from "./routes/admin.routes.js"
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Body parser

app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-production-frontend-url.com'], // Update with actual production URL
    credentials: true, // Allow cookies if needed
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: "GET, POST, PUT, DELETE", // Allow specific methods
  };

app.use(cors(corsOptions));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patient-records", patientRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medicines",medicineRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/admin",adminRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
