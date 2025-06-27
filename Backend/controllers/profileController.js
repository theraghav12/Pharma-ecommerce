import Profile from '../models/profile.js';
import User from '../models/users.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOne({ user: req.user.id }).select("-__v");

    res.json({
      id: user._id,
      email: user.email,
      contact: user.contact,
      gender: user.gender,
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      dob: profile?.dob || ""
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dob, email, contact, gender } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { email, contact, gender },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { firstName, lastName, dob },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: "Profile updated successfully", user, profile });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
