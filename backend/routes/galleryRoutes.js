import express from 'express';
import { checkIfInGallery,addToGallery,getActiveGalleryImages,removeFromGallery } from '../services/gallaryServices.js';
import { isAuthenticated } from '../middleware/auth.js';
const router = express.Router()
// POST /api/gallery/add
router.post('/addgallary',isAuthenticated(), async (req, res) => {
  const { property_id, gallery_from, gallery_to } = req.body;

  if (!property_id || !gallery_from || !gallery_to) {
    return res.status(400).json({ message: "Property ID, From Date and To Date are required." });
  }

  try {
    const alreadyExists = await checkIfInGallery(property_id);
    if (alreadyExists) {
      return res.status(400).json({ message: "This property is already in the gallery." });
    }

    const galleryEntry = await addToGallery(property_id, gallery_from, gallery_to);
    res.status(200).json({ message: "Property added to gallery successfully", data: galleryEntry });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to gallery", error: err.message });
  }
});

// GET /api/gallery/active
router.get('/activegallary', async (req, res) => {
  try {
    const images = await getActiveGalleryImages();
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch gallery images", error: err.message });
  }
});
// DELETE /api/gallery/remove/:property_id
router.delete('/removegallary/:property_id',isAuthenticated(), async (req, res) => {
  const { property_id } = req.params;

  try {
    const removed = await removeFromGallery(property_id);
    if (!removed) {
      return res.status(404).json({ message: "Property not found in gallery." });
    }

    res.status(200).json({ message: "Property removed from gallery successfully", data: removed });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from gallery", error: err.message });
  }
});


export default router;