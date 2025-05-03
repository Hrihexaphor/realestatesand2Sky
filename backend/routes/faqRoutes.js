import express from 'express'
import { getFaqsByPropertyId,addFaq } from '../services/faqServices.js';
const router = express.Router();

router.get('/faq/:propertyId', async (req, res) => {
    const { propertyId } = req.params;
  
    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }
  
    try {
      const faqs = await getFaqsByPropertyId(propertyId);
      res.json(faqs.rows);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
  });
  
  // POST a new FAQ
  router.post('/addfaq', async (req, res) => {
    const { property_id, question, answer } = req.body;
  
    if (!property_id || !question || !answer) {
      return res.status(400).json({ error: 'Property ID, question, and answer are required' });
    }
  
    try {
      const faq = await addFaq(req.body);
      res.status(201).json(faq.rows[0]);
    } catch (err) {
      console.error('Error adding FAQ:', err);
      res.status(500).json({ error: 'Failed to add FAQ' });
    } 
  });
  
  export default router;