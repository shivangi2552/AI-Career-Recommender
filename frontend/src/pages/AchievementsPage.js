// src/pages/AchievementsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export default function AchievementsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastBadgeEarned, setLastBadgeEarned] = useState(false);

  const { width, height } = useWindowSize();

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedSkills = Array.isArray(res.data.skills) ? res.data.skills : [];
      setSkills(fetchedSkills);

      // Trigger confetti if user earned a new badge (simplified logic)
      const completedSkills = fetchedSkills.filter((s) => s.status === "Completed");
      if (completedSkills.length > 0 && completedSkills.length % 5 === 0) {
        setLastBadgeEarned(true);
        setTimeout(() => setLastBadgeEarned(false), 3000);
      }
    } catch (err) {
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  // AchievementsPage.js
useEffect(() => {
  fetchSkills();

  // Listen for skill updates
  const handleSkillsUpdated = () => {
    fetchSkills(); // refetch skills when updated
  };

  window.addEventListener("skillsUpdated", handleSkillsUpdated);

  return () => {
    window.removeEventListener("skillsUpdated", handleSkillsUpdated);
  };
}, []);


  if (loading) return <div className="p-6 text-center">Loading achievements...</div>;

  const completedSkills = skills.filter((s) => s.status === "Completed");
  const totalCompleted = completedSkills.length;
  const xp = totalCompleted * 10; // each skill = 10 XP
  const level = Math.floor(xp / 50) + 1;

  const badge = totalCompleted >= 10
    ? { name: "🏆 Pro Learner Badge", emoji: "🏆", threshold: 10 }
    : totalCompleted >= 5
    ? { name: "🔥 Intermediate Badge", emoji: "🔥", threshold: 5 }
    : totalCompleted >= 1
    ? { name: "🎯 Beginner Badge", emoji: "🎯", threshold: 1 }
    : { name: "No Badge Yet", emoji: "⏳", threshold: 0 };

  const progressPercent = Math.min((totalCompleted / 10) * 100, 100);

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md max-w-3xl mx-auto transition-all duration-300">
      {lastBadgeEarned && <Confetti width={width} height={height} recycle={false} />}

      <h2 className="text-2xl font-semibold mb-6 text-center">🏆 Your Achievements</h2>

      {/* Level & XP */}
      <div className="text-center mb-4">
        <p className="text-gray-500 dark:text-gray-300">Level {level}</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full">
          <motion.div
            className="bg-green-500 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1 }}
          ></motion.div>
        </div>
        <p className="text-gray-500 dark:text-gray-300 mt-1">{xp} XP earned</p>
      </div>

      {/* Badge */}
      <motion.div
        className={`p-6 rounded-xl shadow-md text-center mb-6 ${
          totalCompleted >= badge.threshold ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-400"
        }`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-5xl">{badge.emoji}</div>
        <div className="mt-2 text-lg font-semibold">{badge.name}</div>
      </motion.div>

      {/* Motivational Tip */}
      {totalCompleted < 10 && (
        <p className="text-center text-gray-500 dark:text-gray-300 mb-6">
          Complete {10 - totalCompleted} more skill{10 - totalCompleted > 1 && "s"} to unlock the next badge! 🚀
        </p>
      )}

      {/* Completed Skills */}
      {totalCompleted > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {completedSkills.map((s, idx) => (
            <motion.div
              key={idx}
              className="p-4 rounded-lg bg-green-100 dark:bg-green-700 shadow hover:scale-105 transition-all duration-300"
            >
              <div className="font-semibold">{s.name}</div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            No achievements yet. Start completing skills to earn badges! 🎓
          </p>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-6xl"
          >
            🚀
          </motion.div>
        </div>
      )}
    </div>
  );
}
