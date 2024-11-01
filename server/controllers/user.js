import User from "../models/user.js";
import bcrypt from "bcryptjs";  
import jwt from "jsonwebtoken"; 

const userController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password, phone, address } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
 
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword, 
        phone,
        address
      });

      await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h"
      });

      res.status(201).json({ message: "User registered successfully", user: newUser, token });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(400).json({ message: "Error registering user", error });
    }
  },

  // Login user
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h"
      });

      res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(400).json({ message: "Error logging in user", error });
    }
  },

  // Get user profile
  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('cart prescriptions appointments');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Error fetching user profile", error });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      const { name, email, phone, address } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { name, email, phone, address },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile", error });
    }
  }
};

export default userController;
