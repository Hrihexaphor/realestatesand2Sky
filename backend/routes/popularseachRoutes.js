import express from 'express';
 import { logPropertyHit,logLocalityHit,getMostDemandedProperties,getTopLocalities } from '../services/popularSearch.js';
const router = express.Router();
// Log property hit
router.post("/property-hit", async (req, res) => {
  try {
    const { propertyId, ipAddress } = req.body;
    const userAgent = req.get("User-Agent");

    if (!propertyId) return res.status(400).json({ error: "propertyId is required" });

    await logPropertyHit({ propertyId, ipAddress, userAgent });
    res.status(201).json({ message: "Property hit logged" });
  } catch (err) {
    console.error("Error logging property hit:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Log locality hit
router.post("/locality-hit", async (req, res) => {
  try {
    const { city, locality, ipAddress } = req.body;
    const userAgent = req.get("User-Agent");

    if (!city || !locality) return res.status(400).json({ error: "city and locality are required" });

    await logLocalityHit({ city, locality, ipAddress, userAgent });
    res.status(201).json({ message: "Locality hit logged" });
  } catch (err) {
    console.error("Error logging locality hit:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})

// Get most popular properties
router.get("/top-properties", async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const result = await getMostDemandedProperties(parseInt(limit));
    res.json(result);
  } catch (err) {
    console.error("Error fetching top properties:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get most popular localities
router.get("/top-localities", async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const result = await getTopLocalities(parseInt(limit));
    res.json(result);
  } catch (err) {
    console.error("Error fetching top localities:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;