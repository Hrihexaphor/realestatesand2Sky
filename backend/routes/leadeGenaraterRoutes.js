import express from 'express';
import {insertLead,getAllLeads,updateContactedStatus} from '../services/leadServices.js'

const router = express.Router();

router.post('/inquiryleads', async (req, res) => {
    try {
      const lead = await insertLead(req.body);
      res.status(201).json({ message: 'Lead submitted', lead });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error submitting lead' });
    }
  });
  
  router.get('/inquiryleads', async (req, res) => {
    try {
      const leads = await getAllLeads();
      res.json(leads);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch leads' });
    }
  });
  
  router.put('/inquiryleads/:id/contacted', async (req, res) => {
    try {
      const { contacted } = req.body;
      const updated = await updateContactedStatus(req.params.id, contacted);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating contacted status' });
    }
  });
  
  export default router;