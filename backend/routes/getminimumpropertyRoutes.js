import express from "express";
import {
  getMinimalProperties,
  getNewProjectsSummary,
  getResaleProjectsSummary,
  getReadyToMoveProjectsSummary,
  getPropertiesInPriceRangeSummaryOnetotwo,
  getTopProjectsFromTopBuilders,
  getLatestPropertiesWithImages,
  getAllLocalitiesWithCount,
  getPropertiesByLocality,
  getPropertiesByDeveloperId,
  getPopularSearchOptions,
} from "../services/minimumPropetyservice.js";

const router = express.Router();

// get all property with minimum details
router.get("/getminimumproperty", async (req, res) => {
  try {
    const minimunPropeertydetails = await getMinimalProperties();
    res.status(201).json(minimunPropeertydetails);
  } catch (err) {
    console.log("getiing minimum porperty details id failed", err);
    res.status(500).json({ error: "Failed to fetch minimum property details" });
  }
});

//  get newproperty with minimun details

router.get("/getnewproperty", async (req, res) => {
  try {
    const newPropertyMinimunDetails = await getNewProjectsSummary();
    res.status(201).json(newPropertyMinimunDetails);
  } catch (err) {
    console.log("getting error to fetch the newProject property", err);
    res.status(500).json({ error: `failed ti fetch the newproject property` });
  }
});

// Routes for gettig resale property summary

router.get("/getresaleproperty", async (req, res) => {
  try {
    const resalePropertyMinimunDetails = await getResaleProjectsSummary();
    res.status(201).json(resalePropertyMinimunDetails);
  } catch (err) {
    console.log("getting error to fetch the Resale property", err);
    res.status(500).json({ error: `failed ti fetch the Resale property` });
  }
});

// Routes for getting Read to move property
router.get("/getreadytomoveproperty", async (req, res) => {
  try {
    const readytomovePropertyMinimunDetails =
      await getReadyToMoveProjectsSummary();
    res.status(201).json(readytomovePropertyMinimunDetails);
  } catch (err) {
    console.log("getting error to fetch the ReadytoMove property", err);
    res.status(500).json({ error: `failed to fetch the ReadytoMove property` });
  }
});

// Routes for get the property which is from 1cr to 2cr

router.get("/getpropertybtwnone", async (req, res) => {
  try {
    const propertyInrangeOne = await getPropertiesInPriceRangeSummaryOnetotwo();
    res.status(201).json(propertyInrangeOne);
  } catch (err) {
    console.log("error to getting property from 1Cr to 2Cr", err);
    res
      .status(500)
      .json({ error: `Failed to fetch the property from 1cr to 2cr` });
  }
});

// Routes for get top project from top builder

router.get("/projectfromtopbuilder", async (req, res) => {
  try {
    const topbuilderProject = await getTopProjectsFromTopBuilders();
    res.status(200).json(topbuilderProject);
  } catch (err) {
    console.log("failed to fetch the property from the top builder", err);
    res
      .status(500)
      .json({ error: `Failed to fetch the property from top builder` });
  }
});

// Routes for get the project gallary images
// routes/propertyRoutes.js
router.get("/latest-with-images", async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  try {
    const result = await getLatestPropertiesWithImages(limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/localities
router.get("/localities", async (req, res) => {
  try {
    const data = await getAllLocalitiesWithCount();
    res.json(data);
  } catch (error) {
    console.error("Error fetching localities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/properties/by-locality?name=Patia
router.get("/properties/by-locality", async (req, res) => {
  const { name } = req.query;
  if (!name)
    return res.status(400).json({ error: "Locality name is required" });

  try {
    const data = await getPropertiesByLocality(name);
    res.json(data);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// routes to get the property by developer name

router.get("/developer-properties/:id", async (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const properties = await getPropertiesByDeveloperId(id, limit, offset);
    res.json(properties);
  } catch (err) {
    console.error("Error fetching properties by developer ID:", err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});
// router to get the property by popular option
router.get("/search/popular-options", async (req, res) => {
  try {
    const options = await getPopularSearchOptions();
    res.json({ success: true, data: options });
  } catch (error) {
    console.error("Error fetching popular options:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
export default router;
