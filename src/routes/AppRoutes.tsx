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
import { NotificationsPage } from '../pages/user/NotificationsPage';
import { ProfilePage } from '../pages/user/ProfilePage';
import { SettingsPage } from '../pages/user/SettingsPage';
import { CommunityHelpPage } from '../pages/user/CommunityHelpPage';

// NGO Experience Pages
import { NGODashboard } from '../pages/ngo/NGODashboard';
import { NGORequestsPage } from '../pages/ngo/NGORequestsPage';
import { NGORequestDetailsPage } from '../pages/ngo/NGORequestDetailsPage';
import { NGOActiveAssistancePage } from '../pages/ngo/NGOActiveAssistancePage';

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
        <Route
          path="/community-help"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <CommunityHelpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <CommunityHelpPage />
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
          path="/ngo/active"
          element={
            <ProtectedRoute allowedRoles={['ngo', 'admin']}>
              <NGOActiveAssistancePage />
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
