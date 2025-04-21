import express from 'express';
import uploadBlogImage from '../middleware/blogUpload.js';
import { addBlog,getAllBlogs } from '../services/blogServices.js';
const router = express.Router()

// / Route to add a new blog post
router.post('/addblog', uploadBlogImage.single('blogImage'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const image_url = req.file ? `http://localhost:3001/uploads/blogs/${req.file.filename}` : null;

    const blog = await addBlog({ title, description, image_url });
    res.status(201).json({ blog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/blogs', async (req, res) => {
    try {
      const blogs = await getAllBlogs();
      res.status(200).json({ blogs });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  export default router;