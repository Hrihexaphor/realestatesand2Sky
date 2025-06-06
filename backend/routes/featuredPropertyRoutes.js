import express from 'express';
import { addToFeatured, removeFromFeatured, getAllFeaturedIds, checkIfFeatured,getActiveFeaturedPropertiesLite,getFeaturedProperties,updateFeaturedProperty,getFeaturedPropertyDetails } from '../services/featuredProperty.js';
import { isAuthenticated } from '../middleware/auth.js';
const router = express.Router();

router.post('/addtofeatured', async (req, res) => {
  const { property_id, start_date, end_date, cities } = req.body;
  
  if (!property_id) {
    return res.status(400).json({ message: "Property ID is required" });
  }
  if (!start_date || !end_date) {
    return res.status(400).json({ message: "Start and End dates are required" });
  }

  try {
    const isFeatured = await checkIfFeatured(property_id);
    if (isFeatured) {
      return res.status(400).json({ message: "This property is already featured" });
    }
    
    const result = await addToFeatured(property_id, start_date, end_date, cities);
    res.status(200).json({ message: "Property added to featured successfully", data: result });
  }
  catch (err) {
    res.status(500).json({ error: "Failed to add to featured", details: err.message });
  }
});
// edit featured property route
router.put('/updatefeatured/:id', async (req, res) => {
  const featured_property_id = req.params.id;
  const { start_date, end_date, cities } = req.body;

  if (!start_date || !end_date) {
    return res.status(400).json({ message: "Start and End dates are required" });
  }

  try {
    const result = await updateFeaturedProperty(featured_property_id, start_date, end_date, cities);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to update featured property", details: err.message });
  }
});

router.get('/getfeatured/:id', async (req, res) => {
  const featured_property_id = req.params.id;

  try {
    const data = await getFeaturedPropertyDetails(featured_property_id);
    if (!data) {
      return res.status(404).json({ message: "Featured property not found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch featured property", details: err.message });
  }
});
// Remove a property from featured
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
router.get('/featured', async (req, res) => {
  try {
    const { cities } = req.query;
    const cityIds = cities ? cities.split(',').map(id => parseInt(id)) : [];
    
    const featuredProperties = await getFeaturedProperties(cityIds);
    res.status(200).json(featuredProperties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured properties', details: err.message });
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