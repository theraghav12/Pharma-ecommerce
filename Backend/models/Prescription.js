import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recordId: { type: mongoose.Schema.Types.ObjectId, ref: "PatientRecord", required: true },
  medicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true }, 
      duration: { type: String, required: true } 
    }
  ],
  dateIssued: { type: Date, default: Date.now }
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
