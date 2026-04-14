import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagement } from './pages/UserManagement';
import { LevelManagement } from './pages/LevelManagement';
import { QuestionManagement } from './pages/QuestionManagement';
import { TriviaManagement } from './pages/TriviaManagement';
import { NotificationManagement } from './pages/NotificationManagement';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

const AdminApp: React.FC = () => {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/levels" element={<ProtectedRoute><LevelManagement /></ProtectedRoute>} />
          <Route path="/admin/questions" element={<ProtectedRoute><QuestionManagement /></ProtectedRoute>} />
          <Route path="/admin/trivia" element={<ProtectedRoute><TriviaManagement /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute><NotificationManagement /></ProtectedRoute>} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
};

export default AdminApp;
