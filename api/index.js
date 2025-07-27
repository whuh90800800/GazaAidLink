const express = require('express');
const path = require('path');
const { storage } = require('./storage.js');
const { insertCharitySchema } = require('./schema.js');
const {
  rateLimitMiddleware,
  securityHeadersMiddleware,
  fingerprintMiddleware,
  secureLoggingMiddleware,
  honeypotMiddleware,
  antiDDoSMiddleware
} = require('./security.js');

const app = express();

// Apply military-grade security middleware for Vercel
app.use(securityHeadersMiddleware);
app.use(honeypotMiddleware);
app.use(rateLimitMiddleware);
app.use(antiDDoSMiddleware);
app.use(fingerprintMiddleware);
app.use(secureLoggingMiddleware);

app.use(express.json());

// Get all charities
app.get("/api/charities", async (req, res) => {
  try {
    const charities = await storage.charities.getAll();
    res.json(charities);
  } catch (error) {
    console.error('Error fetching charities:', error);
    res.status(500).json({ message: "Failed to fetch charities" });
  }
});

// Get charities by category
app.get("/api/charities/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const charities = await storage.charities.getByCategory(category);
    res.json(charities);
  } catch (error) {
    console.error('Error fetching charities by category:', error);
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
    const charities = await storage.charities.search(q);
    res.json(charities);
  } catch (error) {
    console.error('Error searching charities:', error);
    res.status(500).json({ message: "Failed to search charities" });
  }
});

// Create a new charity (for future admin functionality)
app.post("/api/charities", async (req, res) => {
  try {
    const charity = await storage.charities.create(req.body);
    res.status(201).json(charity);
  } catch (error) {
    console.error('Error creating charity:', error);
    res.status(500).json({ message: "Failed to create charity" });
  }
});

module.exports = app;