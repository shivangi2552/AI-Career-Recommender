import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiFillHome,
  AiOutlinePieChart,
  AiOutlineUser,
  AiOutlineTrophy,
  AiOutlineMessage,
  AiOutlineBook,
  AiOutlineBulb,
} from "react-icons/ai";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <AiFillHome size={20} /> },
    { name: "Skills", path: "/dashboard/skills", icon: <AiOutlineBulb size={20} /> },
    { name: "Progress", path: "/dashboard/progress", icon: <AiOutlinePieChart size={20} /> },
    { name: "Role Recommendations", path: "/dashboard/recommendations", icon: <AiOutlineBook size={20} /> },
    { name: "AI Assistant", path: "/dashboard/messages", icon: <AiOutlineMessage size={20} /> },
    { name: "Achievements", path: "/dashboard/achievements", icon: <AiOutlineTrophy size={20} /> },
    { name: "Profile", path: "/dashboard/profile", icon: <AiOutlineUser size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-3">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg mt-6 flex items-center justify-center gap-2"
      >
        Logout
      </button>
    </aside>
  );
}
