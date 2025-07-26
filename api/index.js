import express from 'express';
import { storage } from '../server/storage.js';
import { insertCharitySchema } from '../shared/schema.js';

const app = express();
app.use(express.json());

// Get all charities
app.get("/api/charities", async (req, res) => {
  try {
    const charities = await storage.getAllCharities();
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch charities" });
  }
});

// Get charities by category
app.get("/api/charities/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const charities = await storage.getCharitiesByCategory(category);
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch charities by category" });
  }
});

// Search charities
app.get("/api/charities/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ message: "Search query is required" });
      return;
    }
    const charities = await storage.searchCharities(q);
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: "Failed to search charities" });
  }
});

// Create a new charity (for future admin functionality)
app.post("/api/charities", async (req, res) => {
  try {
    const result = insertCharitySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid charity data", errors: result.error.errors });
      return;
    }
    const charity = await storage.createCharity(result.data);
    res.status(201).json(charity);
  } catch (error) {
    res.status(500).json({ message: "Failed to create charity" });
  }
});

export default app;