const Prescription = require("../models/Prescription");

// Create a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, recordId, medicines } = req.body;

    const newPrescription = new Prescription({
      patientId,
      doctorId,
      recordId,
      medicines
    });

    await newPrescription.save();
    res.status(201).json({ message: "Prescription created successfully", prescription: newPrescription });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all prescriptions for a patient
exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId }).populate("doctorId recordId");
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get a single prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate("doctorId recordId");
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a prescription
exports.deletePrescription = async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
