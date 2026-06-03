import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/doctors"     element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/appointments" element={
          <PrivateRoute><MyAppointments /></PrivateRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
