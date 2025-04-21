
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const blogImagePath = 'uploads/blogs/';


if (!fs.existsSync(blogImagePath)) {
  fs.mkdirSync(blogImagePath, { recursive: true });
}

const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, blogImagePath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const uploadBlogImage = multer({ storage: blogStorage });

export default uploadBlogImage;
