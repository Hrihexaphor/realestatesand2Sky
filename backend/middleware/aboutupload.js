import multer from 'multer';
import cloudinaryConfig from '../utils/cloudinary.js'


const uploadAboutImage = multer({
    storage:cloudinaryConfig.aboutStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
      }
});

export default uploadAboutImage;