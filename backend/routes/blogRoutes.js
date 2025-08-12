import express from "express";
import uploadBlogImage from "../middleware/blogUpload.js";
import {
  addBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  getAllBlogCategories,
  getBlogById,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogCategoryCounts,
} from "../services/blogServices.js";

import { isAuthenticated } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// Route to add a new blog post
router.post("/addblog", (req, res) => {
  uploadBlogImage.single("blogImage")(req, res, async function (err) {
    if (err instanceof multer.MulterError || err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
    try {
      const {
        title,
        description,
        meta_title,
        meta_description,
        blog_category_id,
        youtube_link,
      } = req.body;
      // Only save the key , and later construct the full URL or , save the location to db.
      // 2 options.
      // 1st one is better, in the similar situation where you have to change the storage provider
      // you can easily switc, you dont have to rewrite the full url.
      const image_url = req.file ? req.file.key : null;

      if (!title || !description) {
        return res
          .status(400)
          .json({ error: "Title and description are required" });
      }

      const blog = await addBlog({
        title,
        description,
        image_url,
        meta_title,
        meta_description,
        youtube_link,
        blog_category_id: blog_category_id ? parseInt(blog_category_id) : null,
      });

      res.status(201).json({ blog });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Route to view all blog posts
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update a blog post
router.put("/blogs/:id", (req, res) => {
  uploadBlogImage.single("blogImage")(req, res, async function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const {
        title,
        description,
        meta_title,
        meta_description,
        blog_category_id,
      } = req.body;

      const image_url = req.file ? req.file.path : null;
      const blogId = req.params.id;

      const updatedBlog = await updateBlog(blogId, {
        title,
        description,
        image_url,
        meta_title,
        meta_description,
        blog_category_id: blog_category_id ? parseInt(blog_category_id) : null,
      });

      if (!updatedBlog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      res.status(200).json({ blog: updatedBlog });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ error: error.message });
    }
  });
});

// GET blog by ID
router.get("/blog/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await getBlogById(id);
    res.status(200).json(blog);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a blog post
router.delete("/blogs/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const deletedBlog = await deleteBlog(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// blog_category routes
router.get("/blog-categories", async (req, res) => {
  try {
    const categories = await getAllBlogCategories();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single blog category by ID
router.get("/blog-categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await getBlogCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new blog category
router.post("/blogCategories", isAuthenticated(), async (req, res) => {
  const { name, slug } = req.body;
  try {
    const newCategory = await createBlogCategory(name, slug);
    res.status(201).json({ category: newCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a blog category
router.put("/blog-categories/:id", isAuthenticated(), async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;
  try {
    const updatedCategory = await updateBlogCategory(id, name, slug);
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ category: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a blog category
router.delete("/blog-categories/:id", isAuthenticated(), async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await deleteBlogCategory(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/blogcategories", async (req, res) => {
  try {
    const categories = await getBlogCategoryCounts();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
