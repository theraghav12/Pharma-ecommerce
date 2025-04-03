const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  genericName: { type: String, required: true },
  brandName: { type: String, required: true },
  manufacturer: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  description: { type: String, required: true },
  category: { type: String, enum: ["OTC", "Prescription", "Ayurvedic", "Homeopathic"], required: true },
  prescriptionRequired: { type: Boolean, required: true },

  composition: {
    activeIngredients: [{ type: String, required: true }],
    inactiveIngredients: [{ type: String }],
  },
  
  dosage: {
    form: { type: String, required: true }, // Tablet, Syrup, Injection, etc.
    strength: { type: String, required: true },
    recommendedDosage: { type: String, required: true }
  },

  pricing: {
    mrp: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // Discount in percentage
    sellingPrice: { type: Number, required: true },
  },

  stock: {
    available: { type: Boolean, default: true },
    quantity: { type: Number, required: true },
    minOrderQuantity: { type: Number, default: 1 },
    maxOrderQuantity: { type: Number }
  },

  packaging: {
    packSize: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    storageInstructions: { type: String, required: true }
  },

  regulatory: {
    drugType: { type: String, required: true },
    sideEffects: [{ type: String }],
    warnings: [{ type: String }],
    contraindications: [{ type: String }],
    interactions: [{ type: String }]
  },

  additionalFeatures: {
    alternativeMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }],
    userReviews: [{ userId: mongoose.Schema.Types.ObjectId, review: String, rating: Number }],
    faqs: [{ question: String, answer: String }],
    doctorAdvice: { type: String }
  },

}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);
