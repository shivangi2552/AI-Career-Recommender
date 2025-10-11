// backend/routes/coursesRoutes.js
import express from "express";
import Course from "../models/Course.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: ... }
    next();
  } catch {
    res.status(401).json({ message: "Token invalid" });
  }
};

// Get courses for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id });
    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// Add new course
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, platform, link } = req.body;
    const course = await Course.create({ user: req.user.id, title, platform, link });
    res.json({ course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add course" });
  }
});

export default router;
