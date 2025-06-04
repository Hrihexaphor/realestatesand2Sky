import express from 'express';
import { insertAminity, updateAmenity, deleteAmenity, getAllAmenities } from '../services/amenityServices.js';
import { isAuthenticated } from '../middleware/auth.js';
const router = express.Router();
router.post('/amenities', isAuthenticated(), async (req, res) => {
  const { name, icon } = req.body;
  if (!name || !icon) {
    return res.status(400).json({ error: "Name and icon is required" })
  }
  try {
    const newAminities = await insertAminity(name, icon)
    res.status(201).json(newAminities)

  } catch (err) {
    console.log(`insert error:`, err);
    res.status(500).json({ error: `failed to insert aminities` })
  }
})

router.get('/amenities', async (req, res) => {
  try {
    const amenities = await getAllAmenities();
    res.status(200).json(amenities);
  } catch (err) {
    console.error('Error fetching amenities:', err);
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

// PUT /api/amenities/:id - Update an amenity
router.put('/amenities/:id', isAuthenticated(), async (req, res) => {
  const { id } = req.params;
  const { name, icon } = req.body;

  try {
    const updatedAmenity = await updateAmenity(id, name, icon);
    if (!updatedAmenity) {
      return res.status(404).json({ error: 'Amenity not found' });
    }
    res.status(200).json(updatedAmenity);
  } catch (err) {
    console.error('Error updating amenity:', err);
    res.status(500).json({ error: 'Failed to update amenity' });
  }
});

// DELETE /api/amenities/:id - Delete an amenity
router.delete('/amenities/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAmenity = await deleteAmenity(id);
    if (!deletedAmenity) {
      return res.status(404).json({ error: 'Amenity not found' });
    }
    res.status(200).json({ message: 'Amenity deleted successfully' });
  } catch (err) {
    console.error('Error deleting amenity:', err);
    res.status(500).json({ error: 'Failed to delete amenity' });
  }
});


export default router;
