import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'pharmacist', 'doctor', 'admin'], default: 'customer' },
    phone: { type: String, required: true },
    address: { 
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
    createdAt: { type: Date, default: Date.now }
  });
  
const User = mongoose.model("User", UserSchema);
export default User;