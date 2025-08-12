import multer from "multer";
// import cloudinaryconfig from '../utils/cloudinary.js';
import { storage } from "../lib/multer.js";

const uploadDeveloperLogo = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default uploadDeveloperLogo;
