import mongoose from "mongoose";

const patientRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to Patient
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to Doctor
  diagnosis: { type: String, required: true },
  visitDate: { type: Date, default: Date.now },
  notes: { type: String },
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }] // Links to Prescriptions
});

const PatientRecord = mongoose.model("PatientRecord", patientRecordSchema);
export default PatientRecord;
