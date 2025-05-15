import express from 'express';
import { createAdvertisement,getAllAdvertisements,getAdvertisementsByLocation,deleteAdvertisement } from '../services/advertisementServices.js';
import multer from 'multer';
import uploadAdvertisementImage from '../middleware/advertisementUpload.js';
const router = express.Router();

router.post('/advertisement', (req,res)=>{
    uploadAdvertisementImage.single('advertisementImage')(req,res,  async function(err){
        if (err instanceof multer.MulterError || err) {
              return res.status(400).json({ error: err.message });
            }
        try {
    const { link, position, location, start_date, end_date } = req.body;

    if (!req.file?.path) {
      return res.status(400).json({ error: "Image is required." });
    }

    const newAd = await createAdvertisement({
      link,
      image_url: req.file.path,
      position,
      location,
      start_date,
      end_date
    });
    res.status(201).json({ message: "Advertisement created successfully", newAd });
    } catch (err) {
    console.error('Create Advertisement Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})
});

router.get('/advertisement', async (req, res) => {
  try {
    const { location } = req.query;
    if (location) {
      const ads = await getAdvertisementsByLocation(location);
      res.json(ads);
    } else {
      const ads = await getAllAdvertisements();
      res.json(ads);
    }
  } catch (err) {
    console.error('Get Advertisement Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.delete('/advertisement/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteAdvertisement(id);
    res.status(200).json({ message: 'Advertisement deleted successfully' });
  } catch (err) {
    console.error('Delete Advertisement Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;