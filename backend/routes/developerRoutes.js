import express from 'express';
import { createDevloper,getAllDeveloper,updateDeveloper,deleteDeveloper } from '../services/developerServices.js';
const router = express.Router();

// create developer

router.post('/developer',async(req,res)=>{
    try {
        const developer = await createDevloper(req.body);
        res.status(201).json(developer);
    } catch (err) {
        console.error('Create developer error:', err);
        res.status(500).json({ error: 'Failed to create developer' });
    }
})
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