import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadMedicineImages = upload.array('images', 5); // Max 5 images

export default upload;