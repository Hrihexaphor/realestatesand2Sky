import multer from "multer";
import { storage } from "../lib/multer.js";
const uploadHeroImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default uploadHeroImage;
