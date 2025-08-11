import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
// Ensure environment variables are loaded
dotenv.config();

// Validate that environment variables are present
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Missing Cloudinary credentials in environment variables");
  // You could throw an error here if you want to fail fast
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});
const allowedPdfMimeTypes = [
  "application/pdf",
  "application/x-pdf",
  "application/acrobat",
  "text/pdf",
];
// Set up storage
const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "realestate/blogs",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], // Optional: resize large images
  },
});

const aboutStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "realestate/about",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

const advertisementStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const filename = file.originalname.split(".")[0]; // get name without extension
    return {
      folder: "realestate/advertisement",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `${filename}-${uuidv4()}`, // e.g., "banner-1-2f3e4g"
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

const developerLogoStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const filename = file.originalname.split(".")[0]; // get name without extension
    return {
      folder: "realestate/developer",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `${filename}-${uuidv4()}`, // e.g., "banner-1-2f3e4g"
      transformation: [{ width: 100, height: 100, crop: "limit" }],
    };
  },
});

const propertyStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPDF = allowedPdfMimeTypes.includes(file.mimetype);
    const filename = file.originalname.split(".")[0];
    // Get the file extension
    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    return {
      folder:
        file.fieldname === "images"
          ? "realestate/property/images"
          : "realestate/property/documents",
      allowed_formats: ["jpg", "png", "jpeg", "pdf"],
      resource_type: isPDF ? "raw" : "image",
      // Include the file extension in the public_id for PDFs
      public_id: isPDF
        ? `${filename}-${Date.now()}-${uuidv4()}.${fileExtension}`
        : `${filename}-${Date.now()}-${uuidv4()}`,
      // Don't add transformation for PDFs
      transformation: isPDF
        ? undefined
        : [{ width: 1200, height: 1200, crop: "limit" }],
    };
  },
});

// hero section image storage
const heroImageStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const filename = file.originalname.split(".")[0];
    return {
      folder: "realestate/hero",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `${filename}-${uuidv4()}`,
      transformation: [{ width: 1600, height: 900, crop: "limit" }],
    };
  },
});

// interior image storage
const interiorImageStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const filename = file.originalname.split(".")[0];
    return {
      folder: "realestate/interior",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `${filename}-${uuidv4()}`,
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});
export default {
  cloudinary,
  blogStorage,
  aboutStorage,
  advertisementStorage,
  developerLogoStorage,
  propertyStorage,
  heroImageStorage,
  interiorImageStorage,
};
