import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Services from './pages/Services/Services';
import Barbers from './pages/Barbers/Barbers';
import Booking from './pages/Booking/Booking';
import Dashboard from './pages/Dashboard/Dashboard';

// Componente de loading
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

// Componente de rota protegida
const ProtectedRoute = ({ children, guestAllowed = false }) => {
  const { user, loading, isGuest } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  // Se não tem usuário, redireciona para login
  if (!user) return <Navigate to="/login" />;
  
  // Verifica se é guest e se guest é permitido
  if (isGuest && !guestAllowed) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Página para Meus Agendamentos
const MyAppointments = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📅 Meus Agendamentos</h1>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600 mb-4">Olá, {user?.name}! Aqui você verá todos os seus agendamentos.</p>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum agendamento encontrado</h3>
          <p className="text-gray-600 mb-6">Você ainda não fez nenhum agendamento.</p>
          <a href="/booking" className="btn-primary px-6 py-3">
            Fazer Primeiro Agendamento
          </a>
        </div>
      </div>
    </div>
  );
};

// Dashboard Admin básico
const AdminPanel = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">👑 Painel Administrativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Agendamentos</h3>
          <p className="text-gray-600">Gerencie todos os agendamentos</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Barbeiros</h3>
          <p className="text-gray-600">Gerencie a equipe</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Serviços</h3>
          <p className="text-gray-600">Gerencie serviços e preços</p>
        </div>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rotas protegidas - Acessíveis para todos autenticados (incluindo guests) */}
      <Route path="/services" element={
        <ProtectedRoute guestAllowed={true}>
          <Services />
        </ProtectedRoute>
      } />
      
      <Route path="/barbers" element={
        <ProtectedRoute guestAllowed={true}>
          <Barbers />
        </ProtectedRoute>
      } />
      
      <Route path="/booking" element={
        <ProtectedRoute guestAllowed={true}>
          <Booking />
        </ProtectedRoute>
      } />
      
      <Route path="/my-appointments" element={
        <ProtectedRoute>
          <MyAppointments />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Rotas protegidas - Admin */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminPanel />
        </ProtectedRoute>
      } />
      
      {/* Rotas protegidas - Barbeiro */}
      <Route path="/barbeiro" element={
        <ProtectedRoute>
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">✂️ Painel do Barbeiro</h1>
            <p>Gerencie seus agendamentos e disponibilidade.</p>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <AppRoutes />
          <Toaster position="top-right" />
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
