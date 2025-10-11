// src/components/Achievements.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming JWT is stored here
        const { data } = await axios.get("http://localhost:5000/api/skills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAchievements(data.achievements || []);
      } catch (err) {
        console.error("Error fetching achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) return <p>Loading achievements...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Achievements 🏆</h1>
      {achievements.length === 0 ? (
        <p>No achievements yet. Start learning skills!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg shadow-md text-center bg-yellow-100"
            >
              <h2 className="font-semibold">{ach.title}</h2>
              <p className="text-sm mt-2">{ach.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
