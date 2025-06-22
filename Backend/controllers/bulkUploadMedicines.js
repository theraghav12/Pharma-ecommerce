import Medicine from "../models/medicine.js";

// Bulk upload controller
export const bulkUploadMedicines = async (req, res) => {
  try {
    const { medicines } = req.body;
    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ error: 'No medicines provided' });
    }
    const result = await Medicine.insertMany(medicines, { ordered: false });
    res.status(201).json({ message: 'Bulk upload successful', inserted: result.length });
  } catch (err) {
    console.error('Bulk upload error:', err);
    res.status(500).json({ error: 'Bulk upload failed', details: err.message });
  }
};
