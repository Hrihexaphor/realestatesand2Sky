import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinaryConfig from '../utils/cloudinary.js'; // Import the full config object
const storage = cloudinaryConfig.propertyStorage;

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
    console.log(`✅ File accepted: ${file.originalname} (${file.mimetype})`);
    cb(null, true);
  } else {
    console.log(`❌ File rejected: ${file.originalname} (${file.mimetype})`);
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
