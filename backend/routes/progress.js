import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const progress = user.skills.map(skill => ({
      skill: skill.name,
      totalResources: skill.resources.length,
      completed: skill.resources.filter(r => r.completed).length,
    }));

    res.json(progress);
  } catch (err) {
    console.error("progress route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// GET all skills for logged-in user


export default router;
