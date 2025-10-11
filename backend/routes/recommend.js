// backend/routes/recommendRoutes.js
import express from "express";
import { getRecommendations } from "../controllers/recommendControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route
router.get("/", protect, getRecommendations);

export default router;
