import express from 'express';
import uploadDeveloperLogo from '../middleware/developer.js';
import { createDevloper,getAllDeveloper,updateDeveloper,deleteDeveloper } from '../services/developerServices.js';
import multer from 'multer';
const router = express.Router();
import { isAuthenticated } from '../middleware/auth.js';
// create developer

router.post('/developer', (req, res) => {
  uploadDeveloperLogo.single('developerImage')(req, res, async function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }
     try {
        const image_url = req.file ? req.file.path : null;
        const developerData = {
          ...req.body,
          developer_logo: image_url,
          // Convert empty string to null for partial_amount
          partial_amount: req.body.partial_amount && req.body.partial_amount.trim() !== '' 
            ? req.body.partial_amount 
            : null,
      };

      const developer = await createDevloper(developerData);
      res.status(201).json(developer);
    } catch (err) {
      console.error('Create developer error:', err);
      res.status(500).json({ error: 'Failed to create developer' });
    }
  });
});

//  get  developer
router.get('/developer', async (req, res) => {
    try {
        const developers = await getAllDeveloper();
        res.json(developers);
    } catch (err) {
        console.error('Fetch developers error:', err);
        res.status(500).json({ error: 'Failed to fetch developers' });
    }
});

// PUT /api/developers/:id - Update a developer
router.put('/developer/:id', async (req, res) => {
  const { id } = req.params;
  const developerData = req.body;

  console.log('Incoming developer update data:', developerData); // ✅ Helpful log

  try {
    const updatedDeveloper = await updateDeveloper(id, developerData);
    if (!updatedDeveloper) {
      return res.status(404).json({ error: 'Developer not found' });
    }
    res.status(200).json(updatedDeveloper);
  } catch (err) {
    console.error('Error updating developer:', err);
    res.status(500).json({ error: 'Failed to update developer' });
  }
});

  // DELETE /api/developers/:id - Delete a developer
router.delete('/developer/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedDeveloper = await deleteDeveloper(id);
      if (!deletedDeveloper) {
        return res.status(404).json({ error: 'Developer not found' });
      }
      res.status(200).json({ message: 'Developer deleted successfully' });
    } catch (err) {
      console.error('Error deleting developer:', err);
      res.status(500).json({ error: 'Failed to delete developer' });
    }
  });

export default router;