import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register Admin
export const registerAdmin = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ name, email, phone, password });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      adminToken: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      adminToken: generateToken(admin._id,"admin"),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
