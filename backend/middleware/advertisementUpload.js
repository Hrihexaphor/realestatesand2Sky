import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
// get advertisement storage from the imported object

const uploadAdvertisementImage = multer({
    storage: cloudinary.advertisementStorage,
    limits:{
         fileSize: 5 * 1024 * 1024 // 5MB limit
    }
})
export default uploadAdvertisementImage;