import multer from "multer";
// import cloudinaryConfig from '../utils/cloudinary.js'
import { storage } from "../lib/multer.js";

const uploadAboutImage = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export default uploadAboutImage;
