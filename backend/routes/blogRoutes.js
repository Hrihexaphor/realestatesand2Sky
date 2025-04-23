import express from 'express';
import uploadBlogImage from '../middleware/blogUpload.js';
import { addBlog,getAllBlogs } from '../services/blogServices.js';
import multer from 'multer';
const router = express.Router()

// / Route to add a new blog post
router.post('/addblog', (req, res) => {
  console.log('Received blog upload request');

  uploadBlogImage.single('blogImage')(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer upload error:', err);
      return res.status(400).json({ error: `Upload error: ${err.message}`  });
    } else if (err) {
      console.error('Unknown upload error:', err);
      return res.status(500).json({ error: `Something went wrong: ${err.message}` });
    }

    try {
      console.log('File upload successful, full file object:', req.file);
      const { title, description } = req.body;
      const image_url = req.file ? req.file.path : null;

      console.log('Image URL to be saved:', image_url);

      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      const blog = await addBlog({ title, description, image_url });
      res.status(201).json({ blog });

    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  });
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