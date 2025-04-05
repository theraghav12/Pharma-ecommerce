import Prescription from "../models/Prescription.js";

// Create a new prescription
export const createPrescription = async (req, res) => {
  try {
    

    const { patientId, doctorId, recordId, medicines } = req.body;
    console.log("Incoming Prescription Request:", req.body);

    if (!patientId || !doctorId || !recordId) {
      return res.status(400).json({
        message: "Missing required fields",
        body: req.body
      });
    }

    const newPrescription = new Prescription({
      patientId,
      doctorId,
      recordId,
      medicines
    });

    await newPrescription.save();
    res.status(201).json({ message: "Prescription created successfully", prescription: newPrescription });
  } catch (error) {
    console.log("Error: ",error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all prescriptions for a patient
export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId }).populate("doctorId recordId");
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get a single prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate("doctorId recordId");
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a prescription
export const deletePrescription = async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
