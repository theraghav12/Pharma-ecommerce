import Banner from '../models/Banner.js';
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//Create a Banner
export const createBanner = async (req, res) => {
    try {
      const { offerName, description } = req.body;
      
      // Validate required fields
      if (!offerName || !description) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both offer name and description'
        });
      }
  
      // Validate file upload
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image file'
        });
      }
  
      // Validate file type
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Only JPG, PNG, and WebP images are allowed'
        });
      }
  
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'Image size should not exceed 5MB'
        });
      }
  
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'banners',
        resource_type: 'auto'
      });
  
      // Create banner in database
      const banner = await Banner.create({
        imageUrl: result.secure_url,
        offerName: offerName.trim(),
        description: description.trim(),
        cloudinaryId: result.public_id
      });
  
      res.status(201).json({
        success: true,
        message: 'Banner created successfully',
        data: banner
      });
    } catch (error) {
      console.error('Error creating banner:', error);
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'A banner with this name already exists'
        });
      }
  
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: messages
        });
      }
  
      res.status(500).json({
        success: false,
        message: 'Failed to create banner',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

// @desc    Get all banners
// @route   GET /api/admin/banners
// @access  Public
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

//  Update a banner

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { offerName, description, isActive } = req.body;
    
    const updateData = { offerName, description };
    
    // If isActive is provided, update it
    if (typeof isActive !== 'undefined') {
      updateData.isActive = isActive;
    }

    // If new image is uploaded
    if (req.file) {
      // First get the banner to delete old image
      const banner = await Banner.findById(id);
      if (banner && banner.cloudinaryId) {
        // Delete old image from Cloudinary
        await cloudinary.uploader.destroy(banner.cloudinaryId);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'banners',
        resource_type: 'auto'
      });

      updateData.imageUrl = result.secure_url;
      updateData.cloudinaryId = result.public_id;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedBanner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: updatedBanner
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a banner

export const deleteBanner = async (req, res) => {
    try {
      const banner = await Banner.findById(req.params.id);
      
      if (!banner) {
        return res.status(404).json({
          success: false,
          message: 'Banner not found'
        });
      }
  
      // Delete image from Cloudinary
      if (banner.cloudinaryId) {
        await cloudinary.uploader.destroy(banner.cloudinaryId);
      }
  
      // Use deleteOne() instead of remove()
      await Banner.deleteOne({ _id: req.params.id });
  
      res.status(200).json({
        success: true,
        message: 'Banner deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting banner:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete banner',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };