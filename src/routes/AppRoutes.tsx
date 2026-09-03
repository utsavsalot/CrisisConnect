import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { ProtectedRoute } from '../components/navigation/ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { SignupPage } from '../pages/public/SignupPage';

// User Experience Pages
import { UserDashboard } from '../pages/user/UserDashboard';
import { RequestHelpPage } from '../pages/user/RequestHelpPage';
import { MyRequestsPage } from '../pages/user/MyRequestsPage';
import { RequestTrackingPage } from '../pages/user/RequestTrackingPage';
import { ResponderModePage } from '../pages/user/ResponderModePage';
import { NotificationsPage } from '../pages/user/NotificationsPage';
import { ProfilePage } from '../pages/user/ProfilePage';
import { SettingsPage } from '../pages/user/SettingsPage';

// NGO Experience Pages
import { NGODashboard } from '../pages/ngo/NGODashboard';
import { NGORequestsPage } from '../pages/ngo/NGORequestsPage';
import { NGORequestDetailsPage } from '../pages/ngo/NGORequestDetailsPage';
import { LiveEmergencyMapPage } from '../pages/ngo/LiveEmergencyMapPage';
import { NGOActiveAssistancePage } from '../pages/ngo/NGOActiveAssistancePage';
import { NGOResourcesPage } from '../pages/ngo/NGOResourcesPage';

// Admin Experience Page
import { AdminDashboard } from '../pages/admin/AdminDashboard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User Routes (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-help"
          element={
            <ProtectedRoute>
              <RequestHelpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <MyRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/:id"
          element={
            <ProtectedRoute>
              <RequestTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/responder"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <ResponderModePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* NGO Routes (Protected for NGO and Admin) */}
        <Route
          path="/ngo/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ngo', 'admin']}>
              <NGODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/requests"
          element={
            <ProtectedRoute allowedRoles={['ngo', 'admin']}>
              <NGORequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/requests/:id"
          element={
            <ProtectedRoute allowedRoles={['ngo', 'admin']}>
              <NGORequestDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/map"
          element={
            <ProtectedRoute allowedRoles={['ngo', 'admin']}>
              <LiveEmergencyMapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/active"
          element={
            <ProtectedRoute allowedRoles={['ngo', 'admin']}>
              <NGOActiveAssistancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/resources"
          element={
            <ProtectedRoute allowedRoles={['ngo', 'admin']}>
              <NGOResourcesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/notifications"
          element={
            <ProtectedRoute allowedRoles={['ngo', 'admin']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/profile"
          element={
            <ProtectedRoute allowedRoles={['ngo', 'admin']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/settings"
          element={
            <ProtectedRoute allowedRoles={['ngo', 'admin']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Route (Protected for Admin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
