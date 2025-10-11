import User from "../models/User.js";


// ================== Skill Resources Mapping ==================
const skillResources = {
  React: [
    { name: "React Official Docs", link: "https://react.dev" },
    { name: "FreeCodeCamp React Course", link: "https://www.freecodecamp.org/learn/front-end-development-libraries/" },
    { name: "React Tutorial (W3Schools)", link: "https://www.w3schools.com/react/" },
  ],
  "Node.js": [
    { name: "Node.js Docs", link: "https://nodejs.org/en/docs" },
    { name: "Express.js Guide", link: "https://expressjs.com/en/starter/installing.html" },
    { name: "Node.js Crash Course", link: "https://www.youtube.com/watch?v=fBNz5xF-Kx4" },
  ],
  MongoDB: [
    { name: "MongoDB Manual", link: "https://www.mongodb.com/docs/manual/" },
    { name: "MongoDB University Free Courses", link: "https://learn.mongodb.com/" },
    { name: "MongoDB CRUD Tutorial", link: "https://www.w3schools.com/mongodb/" },
  ],
  Python: [
    { name: "Python Official Docs", link: "https://docs.python.org/3/" },
    { name: "Learn Python - FreeCodeCamp", link: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
    { name: "Real Python Tutorials", link: "https://realpython.com/" },
  ],
  JavaScript: [
    { name: "MDN JavaScript Docs", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "JavaScript Info", link: "https://javascript.info/" },
    { name: "FreeCodeCamp JS Course", link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
  ],
  HTML: [
    { name: "HTML Tutorial (W3Schools)", link: "https://www.w3schools.com/html/" },
    { name: "MDN HTML Docs", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  ],
  CSS: [
    { name: "CSS Tutorial (W3Schools)", link: "https://www.w3schools.com/css/" },
    { name: "MDN CSS Docs", link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  ],
  Express: [
    { name: "Express Docs", link: "https://expressjs.com/" },
    { name: "Express Crash Course", link: "https://www.youtube.com/watch?v=L72fhGm1tfE" },
  ],
  SQL: [
    { name: "SQL Tutorial (W3Schools)", link: "https://www.w3schools.com/sql/" },
    { name: "SQLZoo", link: "https://sqlzoo.net/" },
  ],
  AWS: [
    { name: "AWS Free Tier Docs", link: "https://aws.amazon.com/free/" },
    { name: "AWS Tutorials", link: "https://aws.amazon.com/training/" },
  ],
  Docker: [
    { name: "Docker Docs", link: "https://docs.docker.com/" },
    { name: "Docker Tutorial (FreeCodeCamp)", link: "https://www.youtube.com/watch?v=fqMOX6JJhGo" },
  ],
  Kubernetes: [
    { name: "Kubernetes Official Docs", link: "https://kubernetes.io/docs/" },
    { name: "Kubernetes Crash Course", link: "https://www.youtube.com/watch?v=X48VuDVv0do" },
  ],
  TensorFlow: [
    { name: "TensorFlow Tutorials", link: "https://www.tensorflow.org/tutorials" },
    { name: "TensorFlow Docs", link: "https://www.tensorflow.org/api_docs" },
  ],
  Pandas: [
    { name: "Pandas Docs", link: "https://pandas.pydata.org/docs/" },
    { name: "Pandas Tutorial", link: "https://www.datacamp.com/courses/pandas-foundations" },
  ],
  NumPy: [
    { name: "NumPy Docs", link: "https://numpy.org/doc/" },
    { name: "NumPy Tutorial", link: "https://www.datacamp.com/courses/intro-to-python-for-data-science" },
  ],
  Excel: [
    { name: "Excel Tutorials", link: "https://support.microsoft.com/en-us/excel" },
    { name: "Excel for Data Analysis", link: "https://www.coursera.org/learn/excel-data-analysis" },
  ],
  Git: [
    { name: "Git Official Docs", link: "https://git-scm.com/doc" },
    { name: "Learn Git - FreeCodeCamp", link: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
  ],
  Linux: [
    { name: "Linux Command Guide", link: "https://linuxcommand.org/" },
    { name: "Linux Tutorial", link: "https://www.tutorialspoint.com/unix/index.htm" },
  ],
  TypeScript: [
    { name: "TypeScript Docs", link: "https://www.typescriptlang.org/docs/" },
    { name: "TypeScript Crash Course", link: "https://www.youtube.com/watch?v=BwuLxPH8IDs" },
  ],
  Angular: [
    { name: "Angular Docs", link: "https://angular.io/docs" },
    { name: "Angular Tutorial", link: "https://www.youtube.com/watch?v=2OHbjep_WjQ" },
  ],
  Vue: [
    { name: "Vue.js Docs", link: "https://vuejs.org/guide/introduction.html" },
    { name: "Vue Crash Course", link: "https://www.youtube.com/watch?v=Wy9q22isx3U" },
  ],
  "React Native": [
    { name: "React Native Docs", link: "https://reactnative.dev/docs/getting-started" },
    { name: "React Native Crash Course", link: "https://www.youtube.com/watch?v=Hf4MJH0jDb4" },
  ],
  "CI/CD": [
    { name: "CI/CD Concepts", link: "https://www.redhat.com/en/topics/devops/what-is-ci-cd" },
    { name: "Jenkins Tutorial", link: "https://www.jenkins.io/doc/" },
  ],
  "Machine Learning": [
    { name: "Machine Learning by Andrew Ng", link: "https://www.coursera.org/learn/machine-learning" },
    { name: "Scikit-Learn Docs", link: "https://scikit-learn.org/stable/" },
  ],
  "Data Science": [
    { name: "Data Science Handbook", link: "https://jakevdp.github.io/PythonDataScienceHandbook/" },
    { name: "Data Science Tutorials", link: "https://www.kaggle.com/learn/data-science" },
  ],
};

// ================== Update or Add Skills ==================
export const updateSkills = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { skills } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.skills = skills.map((skill) => {
      const skillName = typeof skill === "string" ? skill.trim() : skill.name?.trim();
      const resourceKey = Object.keys(skillResources).find(
        (k) => k.toLowerCase() === skillName.toLowerCase()
      );
      return {
        name: skillName,
        resources: resourceKey ? skillResources[resourceKey] : [],
      };
    });

    await user.save();

    res.json({ message: "Skills updated successfully", skills: user.skills });
  } catch (err) {
    console.error("updateSkills error:", err);
    res.status(500).json({ message: "Failed to update skills" });
  }
};

export const getSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const skillsWithResources = user.skills.map((s) => {
      const resourceKey = Object.keys(skillResources).find(
        (k) => k.toLowerCase() === s.name.toLowerCase()
      );
      return {
        name: s.name,
        resources: resourceKey ? skillResources[resourceKey] : [],
      };
    });

    res.json({ skills: skillsWithResources });
  } catch (err) {
    console.error("getSkills error:", err);
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};