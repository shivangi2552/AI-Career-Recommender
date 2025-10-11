// src/components/Dashboard/RecommendationsSection.js
import React from "react";

export default function RecommendationsSection({ recommendations, loading }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Career Recommendations</h2>

      {loading ? (
        <p className="text-center">Loading recommendations...</p>
      ) : recommendations.roles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.roles.map((rec, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-xl transition">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{rec.role}</h2>
              <p className="text-sm text-gray-600 mb-4">
                Match: <span className="font-bold text-green-500">{rec.match}%</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No recommendations yet. Add some skills to get started!</p>
      )}
    </div>
  );
}
