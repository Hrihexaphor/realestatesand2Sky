import multer from 'multer';
import cloudinaryconfig from '../utils/cloudinary.js';

const uploadDeveloperLogo = multer({
    storage:cloudinaryconfig.developerLogoStorage,
    limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

export default uploadDeveloperLogo;