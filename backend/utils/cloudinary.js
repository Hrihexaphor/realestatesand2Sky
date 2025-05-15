import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import {v4 as uuidv4 }  from 'uuid'
// Ensure environment variables are loaded
dotenv.config();

// Validate that environment variables are present
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing Cloudinary credentials in environment variables');
  // You could throw an error here if you want to fail fast
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Set up storage
const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'realestate/blogs',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Optional: resize large images
  },
});

const aboutStorage = new CloudinaryStorage({
  cloudinary,
  params:{
    folder: 'realestate/about',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit'}]
  },
  });

 const advertisementStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const filename = file.originalname.split('.')[0]; // get name without extension
    return {
      folder: 'realestate/advertisement',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: `${filename}-${uuidv4()}`, // e.g., "banner-1-2f3e4g"
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    };
  },
});

export default { cloudinary, blogStorage,aboutStorage,advertisementStorage };
