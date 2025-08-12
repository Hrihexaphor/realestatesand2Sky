import multer from "multer";
// import cloudinary from "../utils/cloudinary.js";
// get advertisement storage from the imported object
import { storage } from "../lib/multer.js";
const uploadAdvertisementImage = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
export default uploadAdvertisementImage;
