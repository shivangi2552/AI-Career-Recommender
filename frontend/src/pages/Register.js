import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError("Failed to register. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=80')", // AI or tech-themed background
      }}
    >
      {/* Overlay for blur and dimming */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-md">
          Register
        </h2>

        {error && <p className="text-red-300 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 border border-white/40 bg-white/10 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-white/40 bg-white/10 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-white/40 bg-white/10 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          onClick={handleRegister}
          className="w-full bg-green-500/90 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-100">
          Already have an account?{" "}
          <Link to="/login" className="text-green-300 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
