import express from "express";
import {
  addInteriorProject,
  getAllInteriorProjects,
  updateInteriorProject,
  deleteInteriorProject,
} from "../services/interiorProjectService.js";

import uploadInteriorImage from "../middleware/interiorImageUpload.js";

const router = express.Router();

// GET ALL
router.get("/intriorProject", async (req, res) => {
  try {
    const projects = await getAllInteriorProjects();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD (with image upload)
router.post("/", uploadInteriorImage.single("img_url"), async (req, res) => {
  try {
    const img_url = req.file ? req.file.path : null;
    const { title, category, location } = req.body;

    const newProject = await addInteriorProject({
      img_url,
      title,
      category,
      location,
    });
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.patch(
  "/:id",
  uploadInteriorImage.single("img_url"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const img_url = req.file ? req.file.path : req.body.img_url; // keep old image if not updated
      const { title, category, location } = req.body;

      const updated = await updateInteriorProject(id, {
        img_url,
        title,
        category,
        location,
      });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteInteriorProject(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
