import express from 'express';
import { 
  getFaqsByPropertyId, 
  addFaq, 
  generateAutomaticFaqs, 
  saveAutomaticFaqs, 
  getAllFaqsByPropertyId, 
  refreshAutomaticFaqs 
} from '../services/faqServices.js';

const router = express.Router();




// GET all FAQs (both manual and automatic) for a property
router.get('/faq/:propertyId', async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    return res.status(400).json({ error: 'Property ID is required' });
  }

  try {
    // Get manual FAQs from database
    const manualFaqsResult = await getFaqsByPropertyId(propertyId);
    const manualFaqs = manualFaqsResult.rows;
    
    // Generate automatic FAQs based on property details
    const autoFaqs = await generateAutomaticFaqs(propertyId);
    
    // Combine both types of FAQs with a type identifier
    const allFaqs = [
      ...manualFaqs.map(faq => ({ ...faq, type: 'manual' })),
      ...autoFaqs.map(faq => ({ ...faq, type: 'auto' }))
    ];
    
    res.json(allFaqs);
  } catch (err) {
    console.error('Error fetching FAQs:', err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// POST a new manual FAQ
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

// POST to generate and save automatic FAQs for a property
router.post('/auto-faq/:propertyId', async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    return res.status(400).json({ error: 'Property ID is required' });
  }

  try {
    // Generate automatic FAQs based on property details
    const autoFaqs = await generateAutomaticFaqs(propertyId);
    
    // Save the generated FAQs
    const result = await saveAutomaticFaqs(autoFaqs);
    
    res.status(201).json({ 
      message: 'Automatic FAQs generated and saved successfully',
      count: autoFaqs.length,
      faqs: autoFaqs
    });
  } catch (err) {
    console.error('Error generating and saving automatic FAQs:', err);
    res.status(500).json({ error: 'Failed to generate and save automatic FAQs' });
  }
});

// PUT to refresh/regenerate automatic FAQs for a property
router.put('/refresh-auto-faq/:propertyId', async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    return res.status(400).json({ error: 'Property ID is required' });
  }

  try {
    const result = await refreshAutomaticFaqs(propertyId);
    res.json({
      message: 'Automatic FAQs refreshed successfully',
      count: result.count
    });
  } catch (err) {
    console.error('Error refreshing automatic FAQs:', err);
    res.status(500).json({ error: 'Failed to refresh automatic FAQs' });
  }
});

// DELETE a FAQ (manual or automatic)
router.delete('/faq/:faqId', async (req, res) => {
  const { faqId } = req.params;

  if (!faqId) {
    return res.status(400).json({ error: 'FAQ ID is required' });
  }

  try {
    await deleteFaq(faqId);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    console.error('Error deleting FAQ:', err);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

export default router;