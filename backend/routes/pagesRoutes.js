import express from 'express';
import uploadAboutImage from '../middleware/aboutupload.js'
import aboutServices from '../services/pagesServices.js'
import multer from 'multer';

const router = express.Router()

router.post('/addAbout', async (req, res) => {
    uploadAboutImage.single('aboutImage')(req, res, async function (err) {
        if (err instanceof multer.MulterError || err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const { title, description } = req.body;
            const image_url = req.file ? req.file.path : null;

            if (!title || !description) {
                return res.status(400).json({ error: 'Title and description are required' });
            }

          
            const aboutUs = await aboutServices.addAboutpage({ title, description, image_url });

            res.status(201).json({ aboutUs });
        } catch (err) {
            console.error('Error in route /addAbout:', err);
            return res.status(500).json({ error: 'Failed to add about page' });
        }
    });
});

router.get('/aboutus', async (req, res) => {
    try {
        const about = await aboutServices.getAboutUs();
        res.status(200).json(about);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch About Us content' });
    }
});

router.put('/aboutus/:id', (req, res) => {
    uploadAboutImage.single('aboutImage')(req, res, async function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ error: err.message });
      }
  
      try {
        const { title, description } = req.body;
        const image_url = req.file ? req.file.path : null;
        const id = req.params.id;
  
        if (!title || !description) {
          return res.status(400).json({ error: 'Title and description are required' });
        }
  
        const updatedAbout = await aboutServices.updateAboutPage(id, { title, description, image_url });
        if (!updatedAbout) {
          return res.status(404).json({ error: 'About page not found' });
        }
  
        res.status(200).json({ message: 'About page updated', data: updatedAbout });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update about page' });
      }
    });
  });

  router.delete('/aboutus/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await aboutServices.deleteAboutPage(id);
  
      if (!deleted) {
        return res.status(404).json({ error: 'About page not found' });
      }
  
      res.status(200).json({ message: 'About page deleted', data: deleted });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete about page' });
    }
  });
  
//   privacy polycy routes
router.post('/addprivacypolicy', async (req, res) => {
    try {
      const policy = await aboutServices.addPrivacyPolicy(req.body);
      res.status(201).json(policy);
    } catch (err) {
      console.error('Add Privacy Policy Error:', err);
      res.status(500).json({ error: 'Failed to add privacy policy' });
    }
  });
  
  router.get('/privacypolicy', async (req, res) => {
    try {
      const policies = await aboutServices.getPrivacyPolicies();
      res.status(200).json(policies);
    } catch (err) {
      console.error('Get Privacy Policies Error:', err);
      res.status(500).json({ error: 'Failed to fetch privacy policies' });
    }
  });
  
  router.put('/privacypolicy/:id', async (req, res) => {
    try {
      const updated = await aboutServices.updatePrivacyPolicy(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (err) {
      console.error('Update Privacy Policy Error:', err);
      res.status(500).json({ error: 'Failed to update privacy policy' });
    }
  });
  
  router.delete('/privacypolicy/:id', async (req, res) => {
    try {
      const deleted = await aboutServices.deletePrivacyPolicy(req.params.id);
      res.status(200).json(deleted);
    } catch (err) {
      console.error('Delete Privacy Policy Error:', err);
      res.status(500).json({ error: 'Failed to delete privacy policy' });
    }
  });
export default router;