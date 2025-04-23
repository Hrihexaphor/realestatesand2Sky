import express from 'express';
import uploadBlogImage from '../middleware/blogUpload.js';
import { addBlog,getAllBlogs } from '../services/blogServices.js';
import multer from 'multer';
const router = express.Router()

// / Route to add a new blog post
router.post('/addblog', (req, res, next) => {
  // Pre-upload logging
  console.log('Received blog upload request');
  
  // Handle the file upload with proper error handling
  uploadBlogImage.single('blogImage')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error('Multer upload error:', err);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred
      console.error('Unknown upload error:', err);
      return res.status(500).json({ error: `Something went wrong: ${err.message}` });
    }
    // If successful, continue to the next middleware
    next();
  });
}, async (req, res) => {
  try {
    // Log successful upload and inspect the file object
    console.log('File upload successful, full file object:', req.file);
    
    const { title, description } = req.body;
    // Use secure_url instead of path for Cloudinary
    const image_url = req.file ? req.file.secure_url : null;
    
    console.log('Image URL to be saved:', image_url);

    // Add additional validation if needed
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const blog = await addBlog({ title, description, image_url });
    res.status(201).json({ blog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    
    // Log the image URLs to check their format
    console.log('Blog image URLs:', blogs.map(blog => blog.image_url));
    
    res.status(200).json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
  export default router;