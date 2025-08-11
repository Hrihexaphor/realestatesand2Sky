import multer from "multer";
import cloudinaryConfig from "../utils/cloudinary.js"; // Import the default export
const uploadInteriorImage = multer({
  storage: cloudinaryConfig.interiorImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default uploadInteriorImage;
