import Profile from '../models/profile.js';
import User from '../models/users.js';
// import authenticate from '../middleware/auth.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    
    // Create empty profile if it doesn't exist
    if (!profile) {
      const newProfile = new Profile({ user: req.user.id });
      await newProfile.save();
    }

    // Combine user and profile data, giving priority to profile fields
    const response = {
      ...user.toObject(),
      ...profile.toObject(),
      password: undefined // Remove password from response
    };
    
    res.json(response);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message || 'An error occurred while fetching profile' 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dob } = req.body;
    
    // Update profile info
    const profileUpdates = {};
    if (firstName) profileUpdates.firstName = firstName;
    if (lastName) profileUpdates.lastName = lastName;
    if (dob) profileUpdates.dob = dob;

    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new Profile({ user: req.user.id, ...profileUpdates });
      await profile.save();
    } else {
      await Profile.findOneAndUpdate(
        { user: req.user.id },
        profileUpdates,
        { new: true, runValidators: true }
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message || 'An error occurred while updating profile' 
    });
  }
};


