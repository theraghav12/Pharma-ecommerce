import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["doctor", "patient"], required: true },
  specialization: { 
    type: String, 
    required: function () { return this.role === "doctor"; } 
  },
  qualification: { 
    type: String, 
    required: function () { return this.role === "doctor"; } 
  },
  age: { 
    type: Number, 
    required: function () { return this.role === "patient"; } 
  },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  contact: { type: String, required: true,unique:true },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'India' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date } // Added for the pre-save hook
});

// Update updatedAt timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
