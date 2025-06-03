import multer from 'multer';
import cloudinaryConfig from '../utils/cloudinary.js'; // Import the default export

// Get blogStorage from the imported object
const uploadBlogImage = multer({
  storage: cloudinaryConfig.blogStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export default uploadBlogImage;