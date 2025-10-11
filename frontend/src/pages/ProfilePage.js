// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Personal Info
  const [name, setName] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState("");

  // Contact Info
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch user data
  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setName(res.data.name || "");
      setEmail(res.data.email || "");
      setPhone(res.data.phone || "");
      setDistrict(res.data.district || "");
      setStateName(res.data.state || "");
      setCountry(res.data.country || "");
      setDob(res.data.dob ? new Date(res.data.dob) : null);
      setGender(res.data.gender || "");
    } catch (err) {
      toast.error("Failed to load profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    if (!name || !email) {
      toast.error("Name and Email are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/user/update",
        { name, email, phone, district, state: stateName, country, dob, gender },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      setPasswordLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/user/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated successfully!");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-20">Loading profile...</p>;

  const inputClass = `border rounded px-2 py-1 w-full`;

  return (
    <div className="transition-all duration-300 min-h-screen p-6 max-w-lg mx-auto rounded-xl shadow-md bg-white text-gray-800">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {/* Personal Info */}
      <motion.div layout className="mb-4 p-4 border rounded-lg border-gray-300">
        <h2 className="text-lg font-semibold mb-2">Personal Info</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {editMode ? (
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            ) : (
              user.name
            )}
          </div>
          <div>
            <span className="font-semibold">Date of Birth:</span>{" "}
            {editMode ? (
              <DatePicker selected={dob} onChange={(date) => setDob(date)} className={inputClass} dateFormat="yyyy-MM-dd" />
            ) : dob ? dob.toLocaleDateString() : "-"}
          </div>
          <div>
            <span className="font-semibold">Gender:</span>{" "}
            {editMode ? (
              <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              user.gender || "-"
            )}
          </div>
        </div>
      </motion.div>

      {/* Contact Info */}
      <motion.div layout className="mb-4 p-4 border rounded-lg border-gray-300">
        <h2 className="text-lg font-semibold mb-2">Contact Info</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Email:</span>{" "}
            {editMode ? (
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            ) : (
              user.email
            )}
          </div>
          <div>
            <span className="font-semibold">Phone:</span>{" "}
            {editMode ? (
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            ) : (
              user.phone || "-"
            )}
          </div>
          <div>
            <span className="font-semibold">District:</span>{" "}
            {editMode ? (
              <input value={district} onChange={(e) => setDistrict(e.target.value)} className={inputClass} />
            ) : (
              user.district || "-"
            )}
          </div>
          <div>
            <span className="font-semibold">State:</span>{" "}
            {editMode ? (
              <input value={stateName} onChange={(e) => setStateName(e.target.value)} className={inputClass} />
            ) : (
              user.state || "-"
            )}
          </div>
          <div>
            <span className="font-semibold">Country:</span>{" "}
            {editMode ? (
              <input value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
            ) : (
              user.country || "-"
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-4">
        {editMode ? (
          <>
            <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Save
            </button>
            <button onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Edit Profile
            </button>
            <button onClick={() => setShowPasswordModal(true)} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Change Password
            </button>
          </>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="p-6 rounded-xl w-96 bg-white text-gray-800">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass + " mb-4"} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPasswordModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={handlePasswordChange} disabled={passwordLoading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                {passwordLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
