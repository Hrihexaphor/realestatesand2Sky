import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js'; // adjust path if needed

const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'realestate_blogs',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const uploadBlogImage = multer({ storage: blogStorage });

export default uploadBlogImage;

