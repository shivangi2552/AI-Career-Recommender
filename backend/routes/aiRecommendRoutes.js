// routes/aiRoutes.js
import express from "express";
import axios from "axios"; // if your AI API is external
import {protect} from "../middleware/authMiddleware.js"; // reuse your JWT middleware

const router = express.Router();

router.post("/recommend", protect, async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) return res.status(400).json({ message: "Skill is required" });

    // Example: Call your AI backend API
    // const aiRes = await axios.post("http://localhost:5001/recommend", { skill });
    // const recommendations = aiRes.data.resources;

    // For demonstration, mock AI resources
    const recommendations = [
      { name: `AI Resource 1 for ${skill}`, link: "https://example.com" },
      { name: `AI Resource 2 for ${skill}`, link: "https://example.com" },
    ];

    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch AI resources" });
  }
});

export default router;
