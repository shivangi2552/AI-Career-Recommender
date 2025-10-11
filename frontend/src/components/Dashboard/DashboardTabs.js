// src/components/Dashboard/DashboardTabs.js
import React, { useState } from "react";

const tabs = ["Skills & Resources", "Progress", "Career Recommendations"];

export default function DashboardTabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex justify-center mb-6 gap-4">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === idx
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {children.map((child, idx) => (
          <div key={idx} className={activeTab === idx ? "block" : "hidden"}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
