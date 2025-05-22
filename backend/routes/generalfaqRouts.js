import express from 'express';
import {
  addFAQ,
  getAllFAQs,
  updateFAQ,
  deleteFAQ
} from '../services/generalfaqServices.js';

const router = express.Router();

// Create FAQ
router.post('/generalfaq', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFAQ = await addFAQ(question, answer);
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

// Read all FAQs
router.get('/generalfaq', async (req, res) => {
  try {
    const faqs = await getAllFAQs();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Update FAQ
router.put('/generalfaq/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const updated = await updateFAQ(id, question, answer);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// Delete FAQ
router.delete('/generalfaq/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteFAQ(id);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

export default router;
