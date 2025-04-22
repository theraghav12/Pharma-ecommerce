// const bcrypt = require("bcryptjs");
import bcrypt from "bcryptjs"
// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken"
// const User = require("../models/users.js");
import User from "../models/users.js"


export const register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, age, gender, contact } = req.body;

    // ✅ Basic validation
    if (!name || !email || !password || !role || !contact) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Role-based validation
    if (role === "doctor" && !specialization) {
      return res.status(400).json({ message: "Specialization is required for doctors" });
    }

    if (role === "patient" && (age === undefined || age === null)) {
      return res.status(400).json({ message: "Age is required for patients" });
    }

    // ✅ Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    user = new User({ name, email, password: hashedPassword, role, specialization, age, gender, contact });

    await user.save();

    res.status(201).json({ 
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        contact: user.contact,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password"); // Exclude password field
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
