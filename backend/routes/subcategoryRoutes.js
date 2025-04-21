import express from 'express';
import { addPropertySubcategory,getSubcategoriesByCategoryId,updateSubcategory,deleteSubcategory,getAllSubcategories } from '../services/propertySubcategory.js';
const router = express.Router();

router.post('/subcategory', async (req, res) => {
    const { name, category_id } = req.body;
    try {
      const subcategory = await addPropertySubcategory(name, category_id);
      res.status(201).json(subcategory);
    } catch (err) {
      console.error('Error adding subcategory:', err);
      res.status(500).json({ error: 'Failed to add subcategory' });
    }
  });
  router.get('/subcategory', async (req, res) => {
    try {
      const subcategories = await getAllSubcategories(); // Use the service
      res.json(subcategories);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      res.status(500).json({ error: 'Failed to get subcategories' });
    }
  });
  // GET /api/subcategory/:category_id - Get Subcategories by Category ID
  router.get('/subcategory/:category_id', async (req, res) => {
    const { category_id } = req.params;
    try {
      const subcategories = await getSubcategoriesByCategoryId(category_id);
      res.json(subcategories);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      res.status(500).json({ error: 'Failed to get subcategories' });
    }
  });
  // Update subcategory
router.put('/subcategory/:id', async (req, res) => {
  const { name, category_id } = req.body;
  const { id } = req.params;
  try {
    const updated = await updateSubcategory(id, name, category_id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete subcategory
router.delete('/subcategory/:id', async (req, res) => {
  try {
    const deleted = await deleteSubcategory(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;