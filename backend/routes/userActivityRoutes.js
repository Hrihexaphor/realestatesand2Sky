import express from 'express';
import {
  createGuestSession,
  logActivity,
  updateContactInfo,
  createPropertyInquiry,
  getAllLeads
} from '../services/userActivityService.js';

const router = express.Router();

// Route to create a guest session
router.post('/guest-session', async (req, res) => {
    const { fingerprint } = req.body;
    
    // Capture IP address, user-agent, and device info
    const ipAddress = req.ip; // This gives you the IP address of the client
    const userAgent = req.get('User-Agent'); // This gives the user-agent string
    const deviceInfo = {
      browser: userAgent, // You could use a package like 'user-agent-parser' to extract detailed info
      // Other device info can be added here
    };
    
    try {
      const session = await createGuestSession(fingerprint, ipAddress, userAgent, deviceInfo);
      res.json(session);
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Route to log user activity
router.post('/activity', async (req, res) => {
  const { visitor_id, page_url, action_type, action_details } = req.body;
  try {
    // Logging the user activity
    const activity = await logActivity(visitor_id, page_url, action_type, action_details);
    res.json(activity);
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update contact info (after 2 minutes or for a registered user)
router.post('/update-contact', async (req, res) => {
    const { visitor_id, email, phone } = req.body;
    try {
      const contact = await updateContactInfo(visitor_id, email, phone);
      res.json(contact);
    } catch (error) {
      console.error('Error updating contact info:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Route to create property inquiry (when a visitor submits an inquiry for a property)
router.post('/property-inquiry', async (req, res) => {
  const { visitor_id, property_id, name, email, phone, message } = req.body;
  try {
    // Storing the property inquiry details
    const inquiry = await createPropertyInquiry(visitor_id, property_id, name, email, phone, message);
    res.json(inquiry);
  } catch (error) {
    console.error('Error creating property inquiry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get all leads
router.get('/leads', async (req, res) => {
  try {
    const leads = await getAllLeads();
    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});
export default router;
