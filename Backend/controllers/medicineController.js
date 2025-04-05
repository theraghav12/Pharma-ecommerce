import Medicine from "../models/medicine.js";

// Add a new medicine
export const addMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json({ message: "Medicine added successfully", medicine });
  } catch (error) {
    res.status(500).json({ message: "Error adding medicine", error });
  }
};

// Get all medicines (with optional filtering)
export const getAllMedicines = async (req, res) => {
  try {
    let query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.prescriptionRequired) {
      query.prescriptionRequired = req.query.prescriptionRequired === "true";
    }

    const medicines = await Medicine.find(query);
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines", error });
  }
};

// Get a single medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicine", error });
  }
};

// Update a medicine
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    res.status(200).json({ message: "Medicine updated successfully", medicine });
  } catch (error) {
    res.status(500).json({ message: "Error updating medicine", error });
  }
};

// Delete a medicine
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting medicine", error });
  }
};

// Update stock quantity
export const updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    if (quantity < 0 && medicine.stock.quantity < Math.abs(quantity)) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    medicine.stock.quantity += quantity;
    await medicine.save();

    res.status(200).json({ message: "Stock updated successfully", medicine });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error });
  }
};

// Check if prescription is required
export const checkPrescription = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    res.status(200).json({ prescriptionRequired: medicine.prescriptionRequired });
  } catch (error) {
    res.status(500).json({ message: "Error checking prescription", error });
  }
};
