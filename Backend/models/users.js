// import mongoose from "mongoose"

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["doctor", "patient"], required: true },
//   specialization: { type: String, required: function () { return this.role === "doctor"; } },
//   // Only for doctors
//   age: { type: Number, required: function () { return this.role === "patient"; } }, // Only for patients
//   gender: { type: String, enum: ["Male", "Female", "Other"] },
//   contact: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("User", userSchema);


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
  age: { 
    type: Number, 
    required: function () { return this.role === "patient"; } 
  },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  contact: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;
