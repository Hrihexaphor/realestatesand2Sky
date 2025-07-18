import express from "express";
import {
  createPropertyLegalLeads,
  getPropertyLegalLeads,
  deletePropertyLegalLeads,
  updatePropertyLegalLeads,
  createInteriorLeads,
  getInteriorLeads,
  deleteInteriorLeads,
  updateInteriorLeads,
  createPropertyInvestmentLeads,
  getPropertyInvestmentLeads,
  deletePropertyInvestmentLeads,
  updatePropertyInvestmentLeads,
} from "../services/toolsServices.js";
const router = express.Router();

router.post("/property-legal-leads", async (req, res) => {
  try {
    const { name, email, phone_number } = req.body;

    if (!name || !email || !phone_number) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const lead = await createPropertyLegalLeads(name, email, phone_number);
    res.status(201).json(lead);
  } catch (err) {
    console.error("Error in POST /property-legal-leads:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/property-legal-leads", async (req, res) => {
  try {
    const result = await getPropertyLegalLeads();
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in GET /property-legal-leads:", err);
    res.status(500).json({ error: err.message });
  }
});
router.delete("/property-legal-leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deletePropertyLegalLeads(id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in DELETE /property-legal-leads/:id:", err);
    res.status(500).json({ error: err.message });
  }
});
router.patch("/property-legal-leads/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }
    const result = await updatePropertyLegalLeads(id, status);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in PATCH /property-legal-leads/:id/satus:", err);
    res.status(500).json({ error: err.message });
  }
});

// inetrior leads routes
router.post("/interior-leads", async (req, res) => {
  try {
    const { name, email, phone_number } = req.body;
    if (!name || !email || !phone_number) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const lead = await createInteriorLeads(name, email, phone_number);
    res.status(201).json(lead);
  } catch (err) {
    console.error("Error in POST /interior-leads:", err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/interior-leads", async (req, res) => {
  try {
    const data = await getInteriorLeads();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in GET /interior-leads:", err);
    res.status(500).json({ error: err.message });
  }
});
router.delete("/interior-leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await deleteInteriorLeads(id);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in DELETE /interior-leads/:id:", err);
    res.status(500).json({ error: err.message });
  }
});
router.patch("/interior-leads/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }
    const data = await updateInteriorLeads(id, status);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in PATCH /interior-leads/:id/status:", err);
    res.status(500).json({ error: err.message });
  }
});

// property investment leads routes
router.post("/property-investment-leads", async (req, res) => {
  try {
    const { name, email, phone_number } = req.body;
    if (!name || !email || !phone_number) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const lead = await createPropertyInvestmentLeads(name, email, phone_number);
    res.status(201).json(lead);
  } catch (err) {
    console.error("Error in POST /property-investment-leads:", err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/property-investment-leads", async (req, res) => {
  try {
    const data = await getPropertyInvestmentLeads();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in GET /property-investment-leads:", err);
    res.status(500).json({ error: err.message });
  }
});
router.delete("/property-investment-leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await deletePropertyInvestmentLeads(id);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in DELETE /property-investment-leads/:id:", err);
    res.status(500).json({ error: err.message });
  }
});
router.patch("/property-investment-leads/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }
    const data = await updatePropertyInvestmentLeads(id, status);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in PATCH /property-investment-leads/:id/status:", err);
    res.status(500).json({ error: err.message });
  }
});
export default router;
