import express from "express";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains { id: ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// GET all messages of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// POST a new message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Message text is required" });

    const user = await User.findById(req.user.id);

    const newMessage = new Message({
      userId: req.user.id,
      fromName: user.name,
      text,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
