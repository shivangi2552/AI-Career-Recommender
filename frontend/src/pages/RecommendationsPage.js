import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user's current skills from backend
  const fetchUserSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const currentSkills = Array.isArray(res.data.skills)
        ? res.data.skills.map((s) => (typeof s === "string" ? s : s.name))
        : [];

      setSkills(currentSkills);
      return currentSkills;
    } catch (err) {
      console.error("Error fetching user skills:", err);
      setError("Failed to load user skills");
      return [];
    }
  };

  // Fetch AI-powered recommendations
  const fetchAIRecommendations = async (skillsArray) => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5001/recommend", {
        skills: skillsArray,
      });

      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error("Error fetching AI recommendations:", err);
      setError("Failed to fetch AI recommendations");
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const userSkills = await fetchUserSkills();
      // ✅ Always call AI backend, even if userSkills is empty
      await fetchAIRecommendations(userSkills);
    };
    loadData();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading AI recommendations...</p>;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        AI Career Recommendations
      </h2>

      {/* User Skills */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Your Current Skills</h3>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven’t added any skills yet.</p>
        )}
      </div>

      {/* Role Recommendations */}
      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          Recommended Career Paths
        </h3>

        {recommendations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="border p-5 rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <h4 className="text-lg font-bold text-blue-600">{rec.role}</h4>
                <p className="text-gray-600 mt-1">
                  Match Score:{" "}
                  <span className="font-semibold text-green-600">{rec.match}%</span>
                </p>

                {/* Progress Bar */}
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${rec.match}%` }}
                  ></div>
                </div>

                {/* Required Skills */}
                <p className="mt-3 text-gray-700">
                  <strong>Required Skills:</strong> {rec.required_skills.join(", ")}
                </p>

                {/* Missing Skills */}
                {rec.missing_skills.length > 0 && (
                  <p className="mt-1 text-red-500">
                    <strong>Missing Skills:</strong> {rec.missing_skills.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No recommendations available yet.
          </p>
        )}
      </div>
    </div>
  );
}
