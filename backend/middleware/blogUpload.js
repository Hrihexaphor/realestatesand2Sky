import multer from 'multer';
import blogStorage from '../utils/cloudinary.js'; // adjust path if needed

const uploadBlogImage = multer({ storage: blogStorage });

export default uploadBlogImage;

