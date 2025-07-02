import Profile from '../models/profile.js';
import User from '../models/users.js';

// Helper function to format address
const formatAddress = (address) => ({
  street: address?.street || '',
  city: address?.city || '',
  state: address?.state || '',
  postalCode: address?.postalCode || '',
  country: address?.country || 'India'
});

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -__v")
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ user: req.user.id })
      .select("-__v -createdAt -updatedAt")
      .lean();

    // Combine user and profile data into a single object
    const response = {
      id: user._id,
      email: user.email,
      contact: user.contact,
      gender: user.gender,
      role: user.role,
      name: user.name, // Add this line to include the name from User model
      address: formatAddress(user.address),
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      dob: profile?.dob ? profile.dob.toISOString().split('T')[0] : ""
    };

    res.json(response);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ 
      message: "Failed to get profile",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dob, email, contact, gender, address } = req.body;

    // Validate email if provided
    if (email) {
      const emailExists = await User.findOne({ 
        email, 
        _id: { $ne: req.user.id } 
      });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Prepare user updates
    const userUpdates = {};
    if (email) userUpdates.email = email;
    if (contact) userUpdates.contact = contact;
    if (gender) userUpdates.gender = gender;
    if (address) userUpdates.address = address;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      userUpdates,
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile
    const profileUpdates = {};
    if (firstName !== undefined) profileUpdates.firstName = firstName;
    if (lastName !== undefined) profileUpdates.lastName = lastName;
    if (dob !== undefined) profileUpdates.dob = dob;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      profileUpdates,
      { 
        new: true,
        upsert: true,
        runValidators: true 
      }
    ).select("-__v -createdAt -updatedAt");

    // Format response
    const response = {
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        contact: updatedUser.contact,
        gender: updatedUser.gender,
        role: updatedUser.role,
        address: formatAddress(updatedUser.address)
      },
      profile: {
        firstName: updatedProfile.firstName || "",
        lastName: updatedProfile.lastName || "",
        dob: updatedProfile.dob ? updatedProfile.dob.toISOString().split('T')[0] : ""
      }
    };

    res.json(response);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ 
      message: "Failed to update profile",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};