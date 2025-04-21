import express from 'express';
import { addPropertyCategory,getAllPropertyCategories,updateCategory,deleteCategory } from '../services/propertyCategory.js';
const router = express.Router();
router.post('/category', async (req, res) => {
    const { name } = req.body;
    try {
      const category = await addPropertyCategory(name);
      res.status(201).json(category);
    } catch (err) {
      console.error('Error adding category:', err);
      res.status(500).json({ error: 'Failed to add category' });
    }
  });
  
  // GET /api/category - Get All Categories
  router.get('/category', async (req, res) => {
    try {
      const categories = await getAllPropertyCategories();
      res.json(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Failed to get categories' });
    }
  });
  // Update category
  router.put('/category/:id', async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    try {
      const updated = await updateCategory(id, name);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Delete category
  router.delete('/category/:id', async (req, res) => {
    try {
      const deleted = await deleteCategory(req.params.id);
      res.json(deleted);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  export default router;
  