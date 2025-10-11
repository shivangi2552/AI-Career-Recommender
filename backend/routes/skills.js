import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { computeAchievements } from "../utils/achievements.js";

const router = express.Router();

// ================== Skill → Resources Mapping ==================
const skillResources = {
  React: [
    { title: "React Official Docs", url: "https://react.dev" },
    { title: "FreeCodeCamp React Course", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/" },
    { title: "React Tutorial (W3Schools)", url: "https://www.w3schools.com/react/" },
  ],
  "Node.js": [
    { title: "Node.js Docs", url: "https://nodejs.org/en/docs" },
    { title: "Express.js Guide", url: "https://expressjs.com/en/starter/installing.html" },
    { title: "Node.js Crash Course", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4" },
  ],
  MongoDB: [
    { title: "MongoDB Manual", url: "https://www.mongodb.com/docs/manual/" },
    { title: "MongoDB University Free Courses", url: "https://learn.mongodb.com/" },
    { title: "MongoDB CRUD Tutorial", url: "https://www.w3schools.com/mongodb/" },
  ],
  Python: [
    { title: "Python Official Docs", url: "https://docs.python.org/3/" },
    { title: "Learn Python - FreeCodeCamp", url: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
    { title: "Real Python Tutorials", url: "https://realpython.com/" },
  ],
  JavaScript: [
    { title: "MDN JavaScript Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { title: "JavaScript Info", url: "https://javascript.info/" },
    { title: "FreeCodeCamp JS Course", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
  ],
  HTML: [
    { title: "HTML Tutorial (W3Schools)", url: "https://www.w3schools.com/html/" },
    { title: "MDN HTML Docs", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  ],
  CSS: [
    { title: "CSS Tutorial (W3Schools)", url: "https://www.w3schools.com/css/" },
    { title: "MDN CSS Docs", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  ],
  Express: [
    { title: "Express Docs", url: "https://expressjs.com/" },
    { title: "Express Crash Course", url: "https://www.youtube.com/watch?v=L72fhGm1tfE" },
  ],
  SQL: [
    { title: "SQL Tutorial (W3Schools)", url: "https://www.w3schools.com/sql/" },
    { title: "SQLZoo", url: "https://sqlzoo.net/" },
  ],
  AWS: [
    { title: "AWS Free Tier Docs", url: "https://aws.amazon.com/free/" },
    { title: "AWS Tutorials", url: "https://aws.amazon.com/training/" },
  ],
  Docker: [
    { title: "Docker Docs", url: "https://docs.docker.com/" },
    { title: "Docker Tutorial (FreeCodeCamp)", url: "https://www.youtube.com/watch?v=fqMOX6JJhGo" },
  ],
  Kubernetes: [
    { title: "Kubernetes Official Docs", url: "https://kubernetes.io/docs/" },
    { title: "Kubernetes Crash Course", url: "https://www.youtube.com/watch?v=X48VuDVv0do" },
  ],
  TensorFlow: [
    { title: "TensorFlow Tutorials", url: "https://www.tensorflow.org/tutorials" },
    { title: "TensorFlow Docs", url: "https://www.tensorflow.org/api_docs" },
  ],
  Pandas: [
    { title: "Pandas Docs", url: "https://pandas.pydata.org/docs/" },
    { title: "Pandas Tutorial", url: "https://www.datacamp.com/courses/pandas-foundations" },
  ],
  NumPy: [
    { title: "NumPy Docs", url: "https://numpy.org/doc/" },
    { title: "NumPy Tutorial", url: "https://www.datacamp.com/courses/intro-to-python-for-data-science" },
  ],
  Excel: [
    { title: "Excel Tutorials", url: "https://support.microsoft.com/en-us/excel" },
    { title: "Excel for Data Analysis", url: "https://www.coursera.org/learn/excel-data-analysis" },
  ],
  Git: [
    { title: "Git Official Docs", url: "https://git-scm.com/doc" },
    { title: "Learn Git - FreeCodeCamp", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
  ],
  Linux: [
    { title: "Linux Command Guide", url: "https://linuxcommand.org/" },
    { title: "Linux Tutorial", url: "https://www.tutorialspoint.com/unix/index.htm" },
  ],
  TypeScript: [
    { title: "TypeScript Docs", url: "https://www.typescriptlang.org/docs/" },
    { title: "TypeScript Crash Course", url: "https://www.youtube.com/watch?v=BwuLxPH8IDs" },
  ],
  Angular: [
    { title: "Angular Docs", url: "https://angular.io/docs" },
    { title: "Angular Tutorial", url: "https://www.youtube.com/watch?v=2OHbjep_WjQ" },
  ],
  Vue: [
    { title: "Vue.js Docs", url: "https://vuejs.org/guide/introduction.html" },
    { title: "Vue Crash Course", url: "https://www.youtube.com/watch?v=Wy9q22isx3U" },
  ],
  "React Native": [
    { title: "React Native Docs", url: "https://reactnative.dev/docs/getting-started" },
    { title: "React Native Crash Course", url: "https://www.youtube.com/watch?v=Hf4MJH0jDb4" },
  ],
  "CI/CD": [
    { title: "CI/CD Concepts", url: "https://www.redhat.com/en/topics/devops/what-is-ci-cd" },
    { title: "Jenkins Tutorial", url: "https://www.jenkins.io/doc/" },
  ],
  "Machine Learning": [
    { title: "Machine Learning by Andrew Ng", url: "https://www.coursera.org/learn/machine-learning" },
    { title: "Scikit-Learn Docs", url: "https://scikit-learn.org/stable/" },
  ],
  "Data Science": [
    { title: "Data Science Handbook", url: "https://jakevdp.github.io/PythonDataScienceHandbook/" },
    { title: "Data Science Tutorials", url: "https://www.kaggle.com/learn/data-science" },
  ],
};

const findSkillKey = (skillName) => {
  if (!skillName || typeof skillName !== "string") return null;
  const lower = skillName.toLowerCase().trim();
  return Object.keys(skillResources).find((key) => key.toLowerCase() === lower);
};

// ================== PUT /api/skills/update ==================
router.put("/update", protect, async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Map and store each skill with resources
    user.skills = skills.map((skill) => {
      const name = typeof skill === "string" ? skill.trim() : (skill.name || "").trim();
      const key = findSkillKey(name);
      const matchedResources = key ? skillResources[key] : [];
      return { name, status: skill.status || "Not Started", resources: matchedResources };
    });

    await user.save();

    res.json({ message: "Skills updated successfully", skills: user.skills });
  } catch (err) {
    console.error("updateSkills error:", err);
    res.status(500).json({ message: "Failed to update skills" });
  }
});

// ================== GET /api/skills ==================
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let skillsWithResources;
    if (!user || !user.skills.length) {
      skillsWithResources = Object.keys(skillResources).map((key) => ({
        name: key,
        resources: skillResources[key],
      }));
    } else {
      skillsWithResources = user.skills.map((s) => {
        const key = findSkillKey(s.name);
        return { name: s.name, status: s.status || "Not Started", resources: key ? skillResources[key] : [] };
      });
    }

    const achievements = user ? computeAchievements(user) : [];

    res.json({ skills: skillsWithResources, achievements });
  } catch (err) {
    console.error("Error fetching skills & achievements:", err);
    res.status(500).json({ error: "Failed to fetch skills and achievements" });
  }
});

// ================== PUT /api/skills/resource ==================
router.put("/resource", protect, async (req, res) => {
  try {
    const { skillName, resourceTitle, status } = req.body;
    if (!skillName || !resourceTitle || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const validStatuses = ["Not Started", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const skill = user.skills.find(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    const resource = skill.resources.find(
      (r) => r.title.toLowerCase() === resourceTitle.toLowerCase()
    );
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    resource.status = status;
    await user.save();

    res.json({ message: "Resource status updated", skill });
  } catch (err) {
    console.error("updateResource error:", err);
    res.status(500).json({ message: "Failed to update resource status" });
  }
});

// ================== GET /api/skills/progress ==================
router.get("/progress", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.skills) return res.json([]);

    const progress = user.skills.map((skill) => ({
      skill: skill.name,
      completed: skill.status === "Completed" ? 1 : 0,
      totalResources: 1,
    }));

    res.json(progress);
  } catch (err) {
    console.error("progress error:", err);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
});

export default router;