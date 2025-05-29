// routes/keyFeatureRoutes.js
import express from 'express';
import {
  createKeyFeature,
  getAllKeyFeatures,
  updateKeyFeature,
  deleteKeyFeature,
} from '../services/keyfeatureServices.js';
import { isAuthenticated } from '../middleware/auth.js';
const router = express.Router();

// Create
router.post('/keyfeature', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const feature = await createKeyFeature(name);
    res.status(201).json(feature);
  } catch (err) {
    console.error('Create key feature error:', err);
    res.status(500).json({ error: 'Failed to create key feature' });
  }
});

// Read all
router.get('/keyfeature', async (req, res) => {
  try {
    const features = await getAllKeyFeatures();
    res.json(features);
  } catch (err) {
    console.error('Get key features error:', err);
    res.status(500).json({ error: 'Failed to fetch key features' });
  }
});

// Update
router.put('/keyfeature/:id',isAuthenticated(), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await updateKeyFeature(id, name);
    res.json(updated);
  } catch (err) {
    console.error('Update key feature error:', err);
    res.status(500).json({ error: 'Failed to update key feature' });
  }
});

// Delete
router.delete('/keyfeature/:id',isAuthenticated(), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteKeyFeature(id);
    res.json(deleted);
  } catch (err) {
    console.error('Delete key feature error:', err);
    res.status(500).json({ error: 'Failed to delete key feature' });
  }
});

export default router;
