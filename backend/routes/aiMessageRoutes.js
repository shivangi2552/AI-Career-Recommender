// backend/routes/aiMessageRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// ================== Advanced Career AI ==================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Please send a message." });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ reply: "User not found." });

// Extract skill names
const userSkills = Array.isArray(user.skills)
  ? user.skills.map(s => typeof s === "string" ? s : s.name)
  : [];
    const userProgress = Array.isArray(user.progress) ? user.progress : [];
    const userRoles = Array.isArray(user.recommendedRoles) ? user.recommendedRoles : [];

    const msg = message.toLowerCase();
    let reply = "Sorry, I didn't understand that. Try asking about your skills, progress, or recommended roles.";

    // Greet
    if (msg.includes("hello") || msg.includes("hi")) {
      reply = `Hello ${user.name || ""}! How can I help you with your career today?`;
    }
    // Skills info
    else if (msg.includes("skills")) {
  reply = userSkills.length
    ? `You currently have these skills: ${userSkills.join(", ")}.`
    : "You haven’t added any skills yet. Add them in the Skills section!";
}

    // Progress info
    else if (msg.includes("progress")) {
      const completed = userProgress.filter(p => p.completed).length;
      const total = userProgress.length;
      const percentage = total ? Math.round((completed / total) * 100) : 0;
      reply = `You have completed ${completed} out of ${total} tasks. Your overall progress is ${percentage}%. Keep going!`;
    }
    // Recommended roles
    else if (msg.includes("recommend") || msg.includes("role")) {
      if (userSkills.length) {
        const suggestedRoles = [];
        if (userSkills.some(s => /javascript|react|frontend/i.test(s))) suggestedRoles.push("Frontend Developer");
        if (userSkills.some(s => /python|data|ml/i.test(s))) suggestedRoles.push("Data Analyst / ML Engineer");
        if (userSkills.some(s => /cloud|aws|azure/i.test(s))) suggestedRoles.push("Cloud Engineer");

        reply = suggestedRoles.length
          ? `Based on your skills (${userSkills.join(", ")}), you could aim for these roles: ${suggestedRoles.join(", ")}.`
          : "You have skills, but I don't have matching roles yet. Keep adding skills!";
      } else {
        reply = "Add some skills first to get personalized role recommendations.";
      }
    }
    // Courses suggestion
    else if (msg.includes("course") || msg.includes("learn")) {
      reply = "You can improve your skills with relevant courses. For example:\n";
      if (userSkills.includes("JavaScript")) reply += "- Advanced JavaScript (Frontend Masters)\n";
      if (userSkills.includes("React")) reply += "- React for Professionals (Udemy)\n";
      if (userSkills.includes("Python")) reply += "- Python Data Science Bootcamp (Coursera)\n";
      if (reply === "You can improve your skills with relevant courses. For example:\n") reply += "- Explore beginner courses based on your interests in IT.";
    }
    // Thank you
    else if (msg.includes("thank")) {
      reply = "You’re welcome! Keep learning and growing your career!";
    }

    res.json({ reply });
  } catch (err) {
    console.error("AI message error:", err);
    res.status(500).json({ reply: "Something went wrong. Please try again." });
  }
});

export default router;
