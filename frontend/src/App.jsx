import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePlanning from './pages/CreatePlanning';
import ViewPlanning from './pages/ViewPlanning';
import Profile from './pages/Profile';
import AddEvent from './pages/addEvent';  

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-purple-600">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-purple-600">Chargement...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plannings/create"
            element={
              <ProtectedRoute>
                <CreatePlanning />
              </ProtectedRoute>
            }
        />
        <Route
          path="/plannings/:id"
            element={
              <ProtectedRoute>
                <ViewPlanning />
              </ProtectedRoute>
            }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plannings/:id/add-event"
          element={
            <ProtectedRoute>
              <AddEvent />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div className="text-center text-2xl">Page non trouvée</div>} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;