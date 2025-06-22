import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  genericName: { type: String },
  brandName: { type: String },
  manufacturer: { type: String },
  images: [{ type: String }], // Array of image URLs
  description: { type: String },
  category: { type: String, enum: ["OTC", "Prescription", "Ayurvedic", "Homeopathic"] },
  prescriptionRequired: { type: Boolean },

  composition: {
    activeIngredients: [{ type: String }],
    inactiveIngredients: [{ type: String }],
  },

  dosage: {
    form: { type: String }, // Tablet, Syrup, Injection, etc.
    strength: { type: String },
    recommendedDosage: { type: String },
  },

  pricing: {
    mrp: { type: Number },
    discount: { type: Number, default: 0 },
    sellingPrice: { type: Number },
  },

  stock: {
    available: { type: Boolean, default: true },
    quantity: { type: Number },
    minOrderQuantity: { type: Number, default: 1 },
    maxOrderQuantity: { type: Number },
  },

  packaging: {
    packSize: { type: String },
    expiryDate: { type: Date },
    storageInstructions: { type: String },
  },

  regulatory: {
    drugType: { type: String },
    sideEffects: [{ type: String }],
    warnings: [{ type: String }],
    contraindications: [{ type: String }],
    interactions: [{ type: String }],
  },

  additionalFeatures: {
    alternativeMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }],
    userReviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        review: String,
        rating: Number,
      },
    ],
    faqs: [{ question: String, answer: String }],
    doctorAdvice: { type: String },
  },
}, { timestamps: true });

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;
