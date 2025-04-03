const PatientRecord = require("../models/PatientRecord");

// Create a new patient record
exports.createPatientRecord = async (req, res) => {
  try {
    const { patientId, doctorId, diagnosis, notes } = req.body;

    const newRecord = new PatientRecord({
      patientId,
      doctorId,
      diagnosis,
      notes
    });

    await newRecord.save();
    res.status(201).json({ message: "Patient record created successfully", record: newRecord });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all patient records (for doctors)
exports.getPatientRecords = async (req, res) => {
  try {
    const records = await PatientRecord.find({ doctorId: req.user.id }).populate("patientId doctorId prescriptions");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get a single patient record
exports.getPatientRecordById = async (req, res) => {
  try {
    const record = await PatientRecord.findById(req.params.id).populate("patientId doctorId prescriptions");
    if (!record) return res.status(404).json({ message: "Record not found" });

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update a patient record
exports.updatePatientRecord = async (req, res) => {
  try {
    const updatedRecord = await PatientRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Patient record updated successfully", updatedRecord });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a patient record
exports.deletePatientRecord = async (req, res) => {
  try {
    await PatientRecord.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Patient record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
