import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinaryConfig from '../utils/cloudinary.js'; // Import the full config object

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig.cloudinary, // ✅ use cloudinary instance
  params: async (req, file) => ({
    folder: file.fieldname === 'images' ? 'realestate_images' : 'realestate_documents',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
  }),
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

export default upload;
