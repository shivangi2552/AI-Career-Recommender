import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Target, BarChart3, Rocket } from "lucide-react";

export default function WelcomePage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=80')", // AI or tech-themed background
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 text-center max-w-4xl px-6 py-10 text-white">
        {/* Title */}
        <motion.h1
          className="text-5xl font-extrabold mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI Career Recommender
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg mb-8 text-gray-100 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Discover IT career roles that perfectly match your skills.  
          Get AI-powered guidance, track your progress, and unlock curated learning paths to grow faster.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link
            to="/login"
            className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Register
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        {[
          {
            icon: <Brain className="w-10 h-10 text-green-400 mb-3" />,
            title: "AI-Based Career Guidance",
            desc: "Get personalized role suggestions based on your unique IT skills.",
          },
          {
            icon: <Target className="w-10 h-10 text-green-400 mb-3" />,
            title: "Personalized Learning Path",
            desc: "Bridge your skill gaps with curated resources and roadmaps.",
          },
          {
            icon: <BarChart3 className="w-10 h-10 text-green-400 mb-3" />,
            title: "Track Your Progress",
            desc: "Visualize your growth with detailed skill progress charts.",
          },
          {
            icon: <Rocket className="w-10 h-10 text-green-400 mb-3" />,
            title: "Achieve Career Goals",
            desc: "Follow a structured plan to reach your dream IT role efficiently.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg text-center text-gray-100"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex flex-col items-center">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm opacity-90">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        className="relative z-10 mt-20 max-w-4xl text-center text-white px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold mb-4">Why Choose AI Career Recommender?</h2>
        <p className="text-gray-100 text-lg leading-relaxed">
          We go beyond generic suggestions — our AI evaluates your real skill set, recommends suitable
          IT roles, and provides a personalized path to mastery. From web development to data science,
          start your journey with clarity and confidence.
        </p>
      </motion.div>

      <footer className="relative z-10 mt-16 mb-6 text-gray-300 text-sm text-center">
        © {new Date().getFullYear()} AI Career Recommender — Empowering IT Learners with AI
      </footer>
    </div>
  );
}
