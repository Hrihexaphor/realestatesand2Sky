import express from "express";
import uploadHeroImage from "../middleware/uploadHero.js";
import {
  createHeroImage,
  getAllHeroImages,
  deleteHeroImage,
} from "../services/heroServices.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Upload hero image
router.post("/hero", uploadHeroImage.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file?.key;
    if (!imageUrl) {
      return res
        .status(400)
        .json({ message: "Image upload failed or not provided" });
    }

    const id = await createHeroImage(imageUrl);
    res.status(201).json({ message: "Hero image uploaded", id, imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading hero image" });
  }
});

// Get all hero images
router.get("/hero", async (req, res) => {
  try {
    const heroes = await getAllHeroImages();
    res.status(200).json(heroes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch hero images" });
  }
});

// Delete hero image by ID
router.delete("/hero/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteHeroImage(id);
    if (!deleted) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ message: "Hero image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete hero image" });
  }
});

export default router;
