import Medicine from "../models/medicine.js";
import cloudinary from "../utils/cloudinary.js";

// // Add a new medicine
// export const addMedicine = async (req, res) => {
//   try {
//     const medicine = new Medicine(req.body);
//     await medicine.save();
//     res.status(201).json({ message: "Medicine added successfully", medicine });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding medicine", error });
//   }
// };

// export const addMedicine = async (req, res) => {
//   try {
//     // Upload images to Cloudinary
//     const imageUrls = [];
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         imageUrls.push(file.path);
//       }
//     }

//     const medicineData = {
//       ...req.body,
//       images: imageUrls
//     };

//     const medicine = new Medicine(medicineData);
//     await medicine.save();
    
//     res.status(201).json({ 
//       message: "Medicine added successfully", 
//       medicine 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       message: "Error adding medicine", 
//       error: error.message 
//     });
//   }
// };


export const addMedicine = async (req, res) => {
  try {
    const imageUrls = req.files?.map(file => file.path) || [];

    const safeParse = (str) => {
      try {
        return str ? JSON.parse(str) : {};
      } catch {
        return str || '';
      }
    };

    // Handle packaging separately to ensure required fields
    const packagingObj = safeParse(req.body.packaging);
    if (!packagingObj.packSize) {
      throw new Error("Pack Size is required");
    }
    if (packagingObj.expiryDate) {
      packagingObj.expiryDate = new Date(packagingObj.expiryDate);
    }

    const medicineData = {
      ...req.body,
      images: imageUrls,
      composition: safeParse(req.body.composition),
      dosage: safeParse(req.body.dosage),
      pricing: safeParse(req.body.pricing),
      stock: safeParse(req.body.stock),
      packaging: packagingObj,
      regulatory: safeParse(req.body.regulatory),
      additionalFeatures: safeParse(req.body.additionalFeatures)
    };

    // Fix typo in pricing field
    if (medicineData.pricing?.tmp) {
      medicineData.pricing.mrp = medicineData.pricing.tmp;
      delete medicineData.pricing.tmp;
    }

    // Validate required fields
    if (!medicineData.productName || !medicineData.genericName || !medicineData.brandName) {
      throw new Error("Required fields are missing");
    }

    const medicine = new Medicine(medicineData);
    await medicine.save();

    res.status(201).json({
      message: "Medicine added successfully",
      medicine
    });
  } catch (error) {
    console.error("❌ Error adding medicine:", error);
    res.status(400).json({  // Changed to 400 for client errors
      message: error.message || "Error adding medicine",
      error: error.message
    });
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
// export const updateMedicine = async (req, res) => {
//   try {
//     const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!medicine) return res.status(404).json({ message: "Medicine not found" });

//     res.status(200).json({ message: "Medicine updated successfully", medicine });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating medicine", error });
//   }
// };

export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    // Existing images
    let imageUrls = [...medicine.images];

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        imageUrls.push(file.path);
      }
    }

    // Handle image deletions
    if (req.body.imagesToDelete) {
      const toDelete = JSON.parse(req.body.imagesToDelete);
      await Promise.all(toDelete.map(publicId => cloudinary.uploader.destroy(publicId)));
      imageUrls = imageUrls.filter(img => !toDelete.includes(img));
    }

    // Safe JSON parsing for nested fields
    const safeParse = (str) => {
      try {
        return str ? JSON.parse(str) : {};
      } catch {
        return str || '';
      }
    };

    // Parse packaging & ensure proper expiryDate
    const packaging = safeParse(req.body.packaging);
    if (packaging.expiryDate) {
      packaging.expiryDate = new Date(packaging.expiryDate);
    }

    const updatedData = {
      ...req.body,
      images: imageUrls,
      composition: safeParse(req.body.composition),
      dosage: safeParse(req.body.dosage),
      pricing: safeParse(req.body.pricing),
      stock: safeParse(req.body.stock),
      packaging,
      regulatory: safeParse(req.body.regulatory),
      additionalFeatures: safeParse(req.body.additionalFeatures)
    };

    const updatedMedicine = await Medicine.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.status(200).json({
      message: "Medicine updated successfully",
      medicine: updatedMedicine
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating medicine",
      error: error.message
    });
  }
};


// Delete a medicine
// export const deleteMedicine = async (req, res) => {
//   try {
//     const medicine = await Medicine.findByIdAndDelete(req.params.id);
//     if (!medicine) return res.status(404).json({ message: "Medicine not found" });

//     res.status(200).json({ message: "Medicine deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting medicine", error });
//   }
// };

export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    // Delete images from Cloudinary
    if (medicine.images && medicine.images.length > 0) {
      await Promise.all(
        medicine.images.map(publicId =>
          cloudinary.uploader.destroy(publicId) // If stored as publicId
        )
      );
    }

    await Medicine.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting medicine",
      error: error.message
    });
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


// Add to your medicine controller
export const getMedicinesForDashboard = async (req, res) => {
  try {
    const medicines = await Medicine.find({})
      .sort({ createdAt: -1 }); // fetch all, sorted by most recent

    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching medicines for dashboard", 
      error: error.message 
    });
  }
};
