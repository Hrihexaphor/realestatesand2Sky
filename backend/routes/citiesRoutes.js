import express from "express";
import {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
  getLocalityByCity,
} from "../services/cityServices.js";
const router = express.Router();
import { isAuthenticated } from "../middleware/auth.js";
// Get all cities
router.get("/cities", async (req, res) => {
  try {
    const cities = await getAllCities();
    res.status(200).json(cities);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch cities", details: err.message });
  }
});

// Get city by ID
router.get("/cities/:id", async (req, res) => {
  try {
    const city = await getCityById(req.params.id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json(city);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch city", details: err.message });
  }
});

// Create new city
router.post("/cities", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "City name is required" });
  }

  try {
    const newCity = await createCity(name);
    res.status(201).json(newCity);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create city", details: err.message });
  }
});

// Update city
router.put("/cities/:id",async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({ message: "City name is required" });
  }

  try {
    const updatedCity = await updateCity(id, name);

    if (!updatedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json(updatedCity);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update city", details: err.message });
  }
});

// Delete city
router.delete("/cities/:id", async (req, res) => {
  try {
    const deletedCity = await deleteCity(req.params.id);

    if (!deletedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json({ message: "City deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete city", details: err.message });
  }
});

// Get locality by city name Route
router.get("/by-city/:cityName", async (req, res) => {
  const { cityName } = req.params;

  try {
    const localities = await getLocalityByCity(cityName);

    res.json({
      city: cityName,
      localities: localities,
    });
  } catch (error) {
    console.error("Error in route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
