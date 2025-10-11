// src/components/ProgressChart.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EC4899", "#3B82F6"];

const ProgressChart = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedData = res.data.map((item) => ({
        ...item,
        percentage: item.totalResources
          ? Math.round((item.completed / item.totalResources) * 100)
          : 0,
      }));

      setProgressData(updatedData);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedData = res.data.skills.map((s) => ({
        skill: s.name,
        totalResources: s.resources?.length || 1,
        completed: s.status === "Completed" ? s.resources?.length || 1 : 0,
        status: s.status || "Not Started",
        percentage: s.status === "Completed"
          ? 100
          : s.status === "In Progress"
          ? 50
          : 0,
      }));

      setProgressData(updatedData);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    } finally {
      setLoading(false);
    }
  };

  // initial fetch
  fetchProgress();

  // listen to skillsUpdated event
  const handleSkillsUpdated = (e) => {
    const updatedSkills = e.detail;
    if (updatedSkills) {
      const updatedData = updatedSkills.map((s) => ({
        skill: s.name,
        totalResources: s.resources?.length || 1,
        completed: s.status === "Completed" ? s.resources?.length || 1 : 0,
        status: s.status || "Not Started",
        percentage: s.status === "Completed"
          ? 100
          : s.status === "In Progress"
          ? 50
          : 0,
      }));
      setProgressData(updatedData);
    } else {
      fetchProgress();
    }
  };

  window.addEventListener("skillsUpdated", handleSkillsUpdated);

  return () => {
    window.removeEventListener("skillsUpdated", handleSkillsUpdated);
  };
}, []);


  if (loading)
    return <p className="text-center mt-20 text-gray-600">Loading progress...</p>;

  if (progressData.length === 0)
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Progress Dashboard
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          You haven’t started learning yet. Begin exploring skills to track your progress here!
        </p>
      </div>
    );

  const totalSkills = progressData.length;
  const completedSkills = progressData.filter((item) => item.percentage === 100)
    .length;
  const overallProgress =
    progressData.reduce((sum, item) => sum + item.percentage, 0) / totalSkills;

  return (
    <motion.div
      className="p-8 bg-white dark:bg-gray-900 shadow-xl rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Progress Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-xl shadow-md text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-lg font-semibold">Total Skills</h3>
          <p className="text-3xl font-bold mt-2">{totalSkills}</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-md text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-lg font-semibold">Completed Skills</h3>
          <p className="text-3xl font-bold mt-2">{completedSkills}</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-md text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-lg font-semibold">Overall Progress</h3>
          <p className="text-3xl font-bold mt-2">{overallProgress.toFixed(0)}%</p>
        </motion.div>
      </div>

      {/* Skill Bars */}
      <div className="mb-8">
        {progressData.map((item, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span>{item.skill}</span>
              <span>{item.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1 }}
              ></motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Graph */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={progressData}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="skill" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", color: "#fff" }}
            formatter={(value, name) =>
              name === "percentage"
                ? [`${value}%`, "Completion"]
                : [value, name === "completed" ? "Completed" : "Total Resources"]
            }
          />
          <Legend />
          <Bar dataKey="completed" name="Completed" radius={[5, 5, 0, 0]}>
            {progressData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
          <Bar dataKey="totalResources" name="Total Resources" fill="#CBD5E1" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ProgressChart;
