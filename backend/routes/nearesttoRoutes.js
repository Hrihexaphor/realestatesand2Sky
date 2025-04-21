import express from 'express';
import { createNearesTo,getAllNearest,updateNearestTo,deleteNearestTo } from '../services/nearestoServices.js';

const router = express.Router();
router.post('/nearest', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    try {
        const newNearest = await createNearesTo(name);
        res.status(201).json(newNearest);
    } catch (err) {
        console.error('Insert error:', err);
        res.status(500).json({ error: 'Failed to insert nearest location' });
    }
});
router.get('/nearest', async (req, res) => {
    try {
        const nearestList = await getAllNearest();
        res.json(nearestList);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch nearest locations' });
    }
});


// PUT /api/nearest-to/:id - Update a nearest_to entry
router.put('/nearest/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    try {
      const updatedNearestTo = await updateNearestTo(id, name);
      if (!updatedNearestTo) {
        return res.status(404).json({ error: 'nearest_to entry not found' });
      }
      res.status(200).json(updatedNearestTo);
    } catch (err) {
      console.error('Error updating nearest_to entry:', err);
      res.status(500).json({ error: 'Failed to update nearest_to entry' });
    }
  });

  
// DELETE /api/nearest-to/:id - Delete a nearest_to entry
router.delete('/nearest/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedNearestTo = await deleteNearestTo(id);
      if (!deletedNearestTo) {
        return res.status(404).json({ error: 'nearest_to entry not found' });
      }
      res.status(200).json({ message: 'nearest_to entry deleted successfully' });
    } catch (err) {
      console.error('Error deleting nearest_to entry:', err);
      res.status(500).json({ error: 'Failed to delete nearest_to entry' });
    }
  });
export default router;
