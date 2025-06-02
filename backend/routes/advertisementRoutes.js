import express from 'express';
import { 
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementsByLocation,
  deleteAdvertisement,
  updateAdvertisement 
} from '../services/advertisementServices.js';
import multer from 'multer';
import uploadAdvertisementImage from '../middleware/advertisementUpload.js';
import { isAuthenticated } from '../middleware/auth.js';
const router = express.Router();

router.post('/advertisement', isAuthenticated(),(req, res) => {
  uploadAdvertisementImage.single('advertisementImage')(req, res, async function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const {
        link,
        position,
        location,
        start_date,
        end_date,
        image_size, // 👈 Get it from form
        cityIds,
      } = req.body;

      let parsedCityIds = [];
      if (Array.isArray(cityIds)) {
        parsedCityIds = cityIds.map(id => parseInt(id));
      } else if (typeof cityIds === 'string') {
        parsedCityIds = cityIds.split(',').map(id => parseInt(id));
      }

      if (!req.file?.path) {
        return res.status(400).json({ error: "Image is required." });
      }

      const newAd = await createAdvertisement({
        link,
        image_url: req.file.path,
        position,
        location,
        start_date,
        end_date,
        image_size, // 👈 Just pass it through
        cityIds: parsedCityIds,
      });

      res.status(201).json({ message: "Advertisement created successfully", newAd });
    } catch (err) {
      console.error('Create Advertisement Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

router.get('/advertisement', async (req, res) => {
  try {
    const { location } = req.query;
    const ads = location
      ? await getAdvertisementsByLocation(location)
      : await getAllAdvertisements();

    res.json(ads);
  } catch (err) {
    console.error('Get Advertisement Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/advertisement/:id', async (req, res) => {
  const { id } = req.params;
  const {
    link,
    image_url,
    image_size,
    image_position,
    location,
    start_date,
    end_date,
    cityIds
  } = req.body;

  try {
    const updatedAd = await updateAdvertisement(
      id,
      link,
      image_url,
      image_size,
      image_position,
      location,
      start_date,
      end_date,
      cityIds
    );
    res.json(updatedAd);
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({ message: 'Failed to update advertisement' });
  }
});
router.delete('/advertisement/:id', isAuthenticated(),async (req, res) => {
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