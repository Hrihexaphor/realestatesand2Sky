    import express from 'express';
    import { getPropertiesWithImages,setPrimaryImage } from '../services/propertyImagesServices.js';
    const router = express.Router();
    router.get('/with-images', async (req, res) => {
  try {
    const data = await getPropertiesWithImages();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
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