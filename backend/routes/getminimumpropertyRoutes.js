
import express from 'express'
import { getMinimalProperties } from '../services/minimumPropetyservice.js'

const router = express.Router()

router.get('/getminimumproperty', async (req,res)=>{
    try{
        const minimunPropeertydetails = await getMinimalProperties();
        res.status(201).json(minimunPropeertydetails)
    }catch(err){
        console.log("getiing minimum porperty details id failed",err);
        res.status(500).json({ error: 'Failed to fetch minimum property details' });
    }
})

export default router;