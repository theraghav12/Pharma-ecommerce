import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import Profile from "../models/profile.js";

// Helper function to format user response
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  specialization: user.specialization,
  age: user.age,
  gender: user.gender,
  contact: user.contact,
  address: {
    street: user.address?.street || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    postalCode: user.address?.postalCode || '',
    country: user.address?.country || 'India'
  },
  createdAt: user.createdAt
});

export const register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, age, gender, contact, address } = req.body;

    // Validate required fields
    const requiredFields = { name, email, password, role, contact };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Role-specific validations
    if (role === "doctor" && !specialization) {
      return res.status(400).json({ message: "Specialization is required for doctors" });
    }
    if (role === "patient" && (age === undefined || age === null)) {
      return res.status(400).json({ message: "Age is required for patients" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or:[{contact},{email}] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user data object
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      contact,
      ...(gender && { gender }),
      ...(address && { address }),
      ...(role === "doctor" && { specialization }),
      ...(role === "patient" && { age })
    };

    // Create and save user
    const user = new User(userData);
    await user.save();

    // Create associated profile
    const profile = new Profile({ user: user._id });
    await profile.save();

    // Generate JWT token
    // const token = jwt.sign(
    //   { id: user._id, role: user.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1m" }
    // );

    // Format response
    const responseUser = formatUserResponse(user);

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      user: responseUser
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    const responseUser = formatUserResponse(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: responseUser
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("-password")
      .lean();

    const formattedDoctors = doctors.map(doctor => formatUserResponse(doctor));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({ 
      message: "Failed to retrieve doctors",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedUser = formatUserResponse(user);

    res.status(200).json(formattedUser);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ 
      message: "Failed to retrieve user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};