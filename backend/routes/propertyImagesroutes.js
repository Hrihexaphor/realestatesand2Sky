    import express from 'express';
    import { getPropertiesWithImages,setPrimaryImage,getPropertyImagesById } from '../services/propertyImagesServices.js';
    const router = express.Router();
    router.get('/with-images', async (req, res) => {
  try {
    const data = await getPropertiesWithImages();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// get the property images by id
router.get("/:id/images", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const images = await getPropertyImagesById(propertyId);

    res.json({ success: true, images });
  } catch (error) {
    console.error("Error fetching property images:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.post('/set-primary', async (req, res) => {
  const { propertyId, imageId } = req.body;
  if (!propertyId || !imageId) return res.status(400).json({ error: "Missing fields" });

  try {
    await setPrimaryImage(propertyId, imageId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 
    export default router;