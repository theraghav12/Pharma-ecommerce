import Prescription from "../models/prescription.js";

const prescriptionController = {
  // Upload prescription
  uploadPrescription: async (req, res) => {
    try {
      const { imageUrl } = req.body;
      const newPrescription = new Prescription({ user: req.user._id, imageUrl, status: 'pending' });
      await newPrescription.save();
      res.status(201).json({ message: "Prescription uploaded successfully", prescription: newPrescription });
    } catch (error) {
      console.error("Error uploading prescription:", error);
      res.status(400).json({ message: "Error uploading prescription", error });
    }
  },
  getPrescriptionsForReview: async (req, res) => {
    try {
      const prescriptions = await Prescription.find({ status: 'pending' }).populate('user', 'name email');
      res.status(200).json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      res.status(500).json({ message: 'Error fetching prescriptions', error });
    }
  },

  // Review prescription
  reviewPrescription: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, comments } = req.body; // status can be 'approved' or 'rejected'

      const prescription = await Prescription.findById(id);
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }

      prescription.status = status;
      prescription.reviewComments = comments; // Optional: Pharmacist can leave comments
      await prescription.save();

      res.status(200).json({ message: 'Prescription reviewed successfully', prescription });
    } catch (error) {
      console.error('Error reviewing prescription:', error);
      res.status(500).json({ message: 'Error reviewing prescription', error });
    }
  }
};

export default prescriptionController;
