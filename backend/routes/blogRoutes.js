import express from 'express';
import uploadBlogImage from '../middleware/blogUpload.js';
import { addBlog, getAllBlogs, updateBlog, deleteBlog } from '../services/blogServices.js';
import multer from 'multer';

const router = express.Router();

// Route to add a new blog post
router.post('/addblog', (req, res) => {
  uploadBlogImage.single('blogImage')(req, res, async function(err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { title, description, meta_title, meta_description } = req.body;
      const image_url = req.file ? req.file.path : null;

      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      const blog = await addBlog({ title, description, image_url, meta_title, meta_description });

      res.status(201).json({ blog });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Route to view all blog posts
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update a blog post
router.put('/blogs/:id', (req, res) => {
  uploadBlogImage.single('blogImage')(req, res, async function(err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { title, description } = req.body;
      const image_url = req.file ? req.file.path : null;
      const blogId = req.params.id;

      const updatedBlog = await updateBlog(blogId, { title, description, image_url });
      if (!updatedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.status(200).json({ blog: updatedBlog });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Route to delete a blog post
router.delete('/blogs/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const deletedBlog = await deleteBlog(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
