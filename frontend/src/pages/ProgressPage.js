// src/pages/ProgressPage.js
import React from "react";
import ProgressChart from "../components/Dashboard/ProgressChart";

export default function ProgressPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
      <ProgressChart />
    </div>
  );
}
