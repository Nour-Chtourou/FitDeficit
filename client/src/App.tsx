import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import SetupProfile from './pages/SetupProfile';


// Page temporaire Dashboard
const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.tdee) {
      navigate('/setup');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-400">Bienvenue {user?.name} 💪</h1>
        <p className="text-gray-400 mt-2">Dashboard — coming soon</p>
        <p className="text-green-400 mt-2">🔥 TDEE : {user?.tdee} kcal</p>
        <button
          onClick={logoutUser}
          className="mt-4 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

// Route protégée
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/setup" element={
        <PrivateRoute>
          <SetupProfile />
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;