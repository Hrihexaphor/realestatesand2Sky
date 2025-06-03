import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
// get advertisement storage from the imported object

const uploadAdvertisementImage = multer({
    storage: cloudinary.advertisementStorage,
    limits:{
         fileSize: 10 * 1024 * 1024 // 10MB limit
    }
})
export default uploadAdvertisementImage;