import express from 'express';
import { addToFeatured,removeFromFeatured,getAllFeaturedIds,checkIfFeatured } from '../services/featuredProperty.js';
const router = express.Router();

router.post('/addtofeatured', async (req,res)=>{
    const {property_id} = req.body;
    try{
        const isfeatured = await checkIfFeatured(property_id);
        if(isfeatured){
           return res.status(400).json({message:"this property already in featured"})
        }
        await addToFeatured(property_id);
        res.status(200).json({message:"Property added to featured successfully"})
    }
    catch(err){
        res.status(500).json({err:"failed to add to featured",details:err.message});
    }
});

// remove from featured

router.delete('/featured/:property_id',async (req,res)=>{
    const {property_id} = req.params;
    try{
        await removeFromFeatured(property_id);
        res.status(200).json({message:"Removed from featured"});
    } catch (err){
        res.status(500).json({err:"Failed to remove featured",details:err.message})
    }
})

router.get('/featuredids', async (req, res) => {
    try {
      const ids = await getAllFeaturedIds();
      res.status(200).json(ids);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch featured IDs', details: err.message });
    }
  });
  export default router;