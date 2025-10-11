// src/pages/DashboardOverview.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardOverview() {
  const [userName, setUserName] = useState("");
  const [skills, setSkills] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [recommendRes, userRes] = await Promise.all([
        axios.get("http://localhost:5000/api/recommend", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUserName(userRes.data.name || "User");
      setSkills(Array.isArray(recommendRes.data.skills) ? recommendRes.data.skills : []);
      setRoles(recommendRes.data.roles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const completedCount = skills.filter((s) => s.completed).length;
  const totalCount = skills.length;
  const overallProgress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading your dashboard...</p>;

  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        👋 Welcome back, <span className="text-blue-600">{userName}</span>!
      </h1>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-2xl shadow-md text-center"
        >
          <h2 className="text-lg font-medium mb-1">Skills Searched</h2>
          <p className="text-4xl font-bold">{totalCount}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl shadow-md text-center"
        >
          <h2 className="text-lg font-medium mb-1">Resources Completed</h2>
          <p className="text-4xl font-bold">{completedCount}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-md text-center"
        >
          <h2 className="text-lg font-medium mb-1">Overall Progress</h2>
          <div className="flex justify-center items-center mt-2">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="#fff"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - overallProgress / 100)}`}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                {overallProgress}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommended Roles */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">🎯 Top Recommended Roles</h2>
        {roles.length === 0 ? (
          <p className="text-gray-600">No roles available yet. Try adding more skills.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.slice(0, 3).map((role, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2 text-blue-700">{role.role}</h3>
                <p className="text-gray-600">
                  Match:{" "}
                  <span className="font-semibold text-green-600">{role.match}%</span>
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Skill Distribution Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📊 Skill Distribution</h2>
        {skills.length === 0 ? (
          <p className="text-gray-500">No skills yet. Add some to see insights.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skills.map((s) => ({ name: s.name, progress: s.completed ? 100 : 50 }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/dashboard/skills"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Manage Skills
        </Link>
        <Link
          to="/dashboard/progress"
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
        >
          View Progress
        </Link>
        <Link
          to="/dashboard/recommendations"
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          See Recommendations
        </Link>
      </div>
    </motion.div>
  );
}
