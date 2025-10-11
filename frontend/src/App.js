import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DashboardOverview from "./pages/DashboardOverview";
import SkillsPage from "./pages/SkillsPage";
import ProgressPage from "./pages/ProgressPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import WelcomePage from "./pages/WelcomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AchievementsPage from "./pages/AchievementsPage";

// Protect dashboard routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (

    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private dashboard routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route index element={<DashboardOverview />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="messages" element={<MessagesPage />} />
                <Route path="achievements" element={<AchievementsPage />} />

          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
        

  );
}

export default App;
