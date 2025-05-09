import multer from 'multer';
import cloudinaryConfig from '../utils/cloudinary.js'


const uploadAboutImage = multer({
    storage:cloudinaryConfig.aboutStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
      }
});

export default uploadAboutImage;