import React, { useState } from "react";
import axios from "axios";

export default function SkillsSection({ skills, setSkills, fetchRecommendations }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // Add skill locally
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setInput("");
  };

  // Remove skill
  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Save skills to backend
  const handleSaveSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/skills/update",
        { skills },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRecommendations(); // refresh recommendations
    } catch (err) {
      console.error(err);
      setError("Failed to update skills");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6 max-w-xl mx-auto">
      <form onSubmit={handleAddSkill} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a skill and press Enter"
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        {skills.length > 0 ? (
          skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <p className="text-gray-500">No skills added yet</p>
        )}
      </div>

      <button
        onClick={handleSaveSkills}
        className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition w-full"
      >
        Save Skills
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
