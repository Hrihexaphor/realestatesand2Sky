import express from 'express';
import { addToFeatured, removeFromFeatured, getAllFeaturedIds, checkIfFeatured,getActiveFeaturedPropertiesLite } from '../services/featuredProperty.js';
const router = express.Router();

router.post('/addtofeatured', async (req, res) => {
    const { property_id, start_date, end_date } = req.body;
    
    if (!property_id) {
        return res.status(400).json({ message: "Property ID is required" });
    }
    if (!start_date || !end_date) {
        return res.status(400).json({ message: "Start and End dates are required" });
    }

    try {
        const isfeatured = await checkIfFeatured(property_id);
        if (isfeatured) {
           return res.status(400).json({ message: "This property is already featured" });
        }
        
        const result = await addToFeatured(property_id, start_date, end_date);
        res.status(200).json({ message: "Property added to featured successfully", data: result });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to add to featured", details: err.message });
    }
});


router.delete('/featured/:property_id', async (req, res) => {
    const { property_id } = req.params;
    
    try {
        const result = await removeFromFeatured(property_id);
        if (!result) {
            return res.status(404).json({ message: "Featured property not found" });
        }
        
        res.status(200).json({ message: "Removed from featured", data: result });
    } catch (err) {
        res.status(500).json({ error: "Failed to remove featured property", details: err.message });
    }
});

router.get('/featuredids', async (req, res) => {
    try {
        const ids = await getAllFeaturedIds();
        res.status(200).json(ids);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch featured IDs', details: err.message });
    }
});

// get all featured property with details
// router.get('/featuredproperties',async(req,res)=>{
//     try {
//         const properties = await getFeaturedPropertiesWithDetails();
//         res.status(200).json(properties);
//       } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch featured property details', details: err.message });
//       }
// })

// get featured property lite
router.get('/featured-properties-lite', async (req, res) => {
    try {
      const data = await getActiveFeaturedPropertiesLite();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch featured properties", details: err.message });
    }
  });
  
export default router;