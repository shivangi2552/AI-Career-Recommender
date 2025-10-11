// src/context/SkillsContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const SkillsContext = createContext();

export const SkillsProvider = ({ children }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch skills from backend
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(res.data.skills || []);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a skill's status locally
  const updateSkills = (skillName, newStatus) => {
    setSkills((prevSkills) =>
      prevSkills.map((s) =>
        s.name === skillName ? { ...s, status: newStatus } : s
      )
    );
  };

  // Add a new skill locally
  const addSkill = (skill) => {
    setSkills((prev) => [...prev, skill]);
  };

  // Remove a skill locally
  const removeSkill = (skillName) => {
    setSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  // Save all skills to backend
  const saveSkills = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/skills/update",
        { skills },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchSkills(); // sync latest from backend
    } catch (err) {
      console.error(err);
      setError("Failed to update skills");
    } finally {
      setLoading(false);
    }
  };

  // Load skills once on mount
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return (
    <SkillsContext.Provider
      value={{
        skills,
        setSkills,
        addSkill,
        removeSkill,
        updateSkills,
        fetchSkills,
        saveSkills,
        loading,
        error,
      }}
    >
      {children}
    </SkillsContext.Provider>
  );
};
