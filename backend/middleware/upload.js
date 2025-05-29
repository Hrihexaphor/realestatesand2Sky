import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinaryConfig from '../utils/cloudinary.js'; // Import the full config object

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig.cloudinary, // ✅ use cloudinary instance
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';
    return {
      folder: file.fieldname === 'images' ? 'realestate_images' : 'realestate_documents',
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
      resource_type: isPDF ? 'raw' : 'image',  // ✅ important for non-image files
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'text/pdf'
  ];
  
  const isImage = file.mimetype.startsWith('image/');
  const isPDF = allowedMimeTypes.includes(file.mimetype) || 
                file.originalname.toLowerCase().endsWith('.pdf');
  
  if (isImage || isPDF) {
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
