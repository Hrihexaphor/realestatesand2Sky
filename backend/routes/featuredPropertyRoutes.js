import express from 'express';
import { addToFeatured, removeFromFeatured, getAllFeaturedIds, checkIfFeatured,getFeaturedPropertiesWithDetails } from '../services/featuredProperty.js';
const router = express.Router();

router.post('/addtofeatured', async (req, res) => {
    const { property_id } = req.body;
    
    if (!property_id) {
        return res.status(400).json({ message: "Property ID is required" });
    }
    
    try {
        const isfeatured = await checkIfFeatured(property_id);
        if (isfeatured) {
           return res.status(400).json({ message: "This property is already featured" });
        }
        
        const result = await addToFeatured(property_id);
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
router.get('/featuredproperties',async(req,res)=>{
    try {
        const properties = await getFeaturedPropertiesWithDetails();
        res.status(200).json(properties);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch featured property details', details: err.message });
      }
})
export default router;