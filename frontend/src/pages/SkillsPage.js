// src/pages/SkillsPage.js
import React, { useState, useEffect,useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";


// Full skillResources mapping
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



// ================= Helper Functions ==================

// ================= Helper Functions ==================
const normalizeSkillName = (name) =>
  name
    ? name
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "";

const getResourcesForSkill = (skillName) => {
  const key = Object.keys(skillResources).find(
    (k) => k.toLowerCase() === skillName.toLowerCase()
  );
  if (key) return skillResources[key];
  return [
    { name: "Google the topic", link: `https://www.google.com/search?q=${skillName}+tutorial` },
    { name: "YouTube Tutorials", link: `https://www.youtube.com/results?search_query=${skillName}+for+beginners` },
  ];
};

// ================= Component ==================
export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // Fetch skills from backend
  const fetchSkills = useCallback(async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/skills", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetched = Array.isArray(res.data.skills)
      ? res.data.skills.map((s) => ({
          name: normalizeSkillName(s.name),
          status: s.status || "Not Started",
          resources: getResourcesForSkill(s.name),
        }))
      : [];

    setSkills(fetched);
  } catch (err) {
    console.error(err);
    setError("Failed to load skills");
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => {
  fetchSkills();
}, [fetchSkills]);


  // Add new skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    const normalizedName = normalizeSkillName(trimmed);
    if (!skills.some((s) => s.name === normalizedName)) {
      setSkills([
        ...skills,
        {
          name: normalizedName,
          status: "Not Started",
          resources: getResourcesForSkill(normalizedName),
        },
      ]);
    }
    setSkillInput("");
  };

  // Remove skill
  const handleRemoveSkill = (skillName) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };

  // Update skill status
  // Update skill status
const handleStatusChange = (skillName, newStatus) => {
  const updated = skills.map((s) =>
    s.name === skillName ? { ...s, status: newStatus } : s
  );
  setSkills(updated);

  // Dispatch event so progress chart updates instantly
  window.dispatchEvent(new CustomEvent("skillsUpdated", { detail: updated }));
};


  const handleSaveSkills = async () => {
  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    // Only send name + status to backend
    const payload = skills.map((s) => ({
      name: s.name,
      status: s.status
    }));

    const res = await axios.put(
      "http://localhost:5000/api/skills/update",
      { skills: payload }, // <-- must be an array inside { skills: [...] }
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Skills saved:", res.data);

    // Update progress chart immediately
    window.dispatchEvent(new CustomEvent("skillsUpdated", { detail: skills }));
  } catch (err) {
    console.error("Failed to save skills", err);
    setError("Failed to save skills");
  } finally {
    setLoading(false);
  }
};




  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-lg max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🎯 Manage Your Skills</h2>

      <form onSubmit={handleAddSkill} className="flex gap-3 mb-6">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Add a new skill (e.g. React, Python)"
          className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>

      {skills.length === 0 ? (
        <p className="text-gray-500 text-center">No skills added yet.</p>
      ) : (
        <div className="grid gap-4">
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition bg-gray-50"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{skill.name}</h3>
                <button
                  onClick={() => handleRemoveSkill(skill.name)}
                  className="text-red-500 text-lg font-bold hover:text-red-700"
                >
                  ×
                </button>
              </div>

              <div className="mb-2">
                <label className="text-gray-700 mr-2">Status:</label>
                <select
                  value={skill.status}
                  onChange={(e) => handleStatusChange(skill.name, e.target.value)}
                  className={`px-3 py-1 rounded-lg border focus:outline-none ${
                    skill.status === "Completed"
                      ? "bg-green-100 border-green-400"
                      : skill.status === "In Progress"
                      ? "bg-yellow-100 border-yellow-400"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="h-2 bg-gray-200 rounded-full mt-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    skill.status === "Completed"
                      ? "bg-green-500 w-full"
                      : skill.status === "In Progress"
                      ? "bg-yellow-400 w-1/2"
                      : "bg-gray-300 w-1/6"
                  }`}
                ></div>
              </div>

              {skill.resources?.length > 0 && (
                <ul className="mt-4 list-disc ml-6 text-blue-600">
                  {skill.resources.map((res, i) => (
                    <li key={i}>
                      <a
                        href={res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {res.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <button
        onClick={handleSaveSkills}
        disabled={loading}
        className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition mt-6 w-full"
      >
        {loading ? "Saving..." : "💾 Save Skills"}
      </button>

      {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
    </motion.div>
  );
}