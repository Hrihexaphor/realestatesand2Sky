import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'realestate/blogs',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

export default { cloudinary, blogStorage };