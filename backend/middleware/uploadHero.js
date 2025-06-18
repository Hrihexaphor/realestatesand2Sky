import multer from "multer";
import cloudinaryConfig from "../utils/cloudinary.js"; // Import the full config object
const uploadHeroImage = multer({
  storage: cloudinaryConfig.heroImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default uploadHeroImage;
