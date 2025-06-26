import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

// Initialize multer with cloudinary storage
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).array('images', 5); // Max 5 files

// Handle image upload
export const uploadImages = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading files',
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading files',
      });
    }

    try {
      // Get the uploaded files
      const files = req.files;
      
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files were uploaded',
        });
      }

      // Map the files to their URLs
      const uploadedFiles = files.map(file => ({
        url: file.path,
        public_id: file.filename,
        format: file.format,
        bytes: file.size,
      }));

      res.status(200).json({
        success: true,
        message: 'Files uploaded successfully',
        files: uploadedFiles,
        urls: uploadedFiles.map(file => file.url)
      });
    } catch (error) {
      console.error('Error processing uploads:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while processing uploads',
      });
    }
  });
};

// Delete an image
export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    
    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'Image public ID is required',
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(public_id);
    
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
    });
  }
};
