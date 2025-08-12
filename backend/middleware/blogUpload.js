import multer from "multer";
// import cloudinaryConfig from '../utils/cloudinary.js'; // Import the default export
import { storage } from "../lib/multer.js";

// Get blogStorage from the imported object
const uploadBlogImage = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export default uploadBlogImage;
