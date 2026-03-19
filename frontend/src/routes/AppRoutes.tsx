import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Listings from "../pages/Listings";
import ListingDetails from "../pages/ListingDetails";
import CreateListing from "../pages/CreateListing";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile";
import Matches from "../pages/Matches";
import Favorites from "../pages/Favorites";
import Onboarding from "../pages/Onboarding";
import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFound from "../pages/NotFound";
import TermsOfService from "../pages/TermsOfService";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Dashboard from "../pages/Dashboard";
import MyListings from "../pages/MyListings";
import MyVisits from "../pages/MyVisits";
import Unauthorized from "../pages/Unauthorized";

// Admin imports
import AdminLayout from "../admin/layouts/AdminLayout";
import AdminDashboard from "../admin/pages/Dashboard";
import UserManagement from "../admin/pages/UserManagement";
import ContentEditor from "../admin/pages/ContentEditor";
import ModerationLogs from "../admin/pages/ModerationLogs";
import AdminSettings from "../admin/pages/Settings";
import AdminReports from "../admin/pages/Reports";
import AdminNotifications from "../admin/pages/Notifications";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="listings" element={<Listings />} />
        <Route
          path="listings/create"
          element={
            <ProtectedRoute requiredRoles={["LANDLORD", "ADVERTISER"]}>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="listings/edit/:id"
          element={
            <ProtectedRoute requiredRoles={["LANDLORD", "ADVERTISER"]}>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route path="listings/:id" element={<ListingDetails />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-listings"
          element={
            <ProtectedRoute requiredRoles={["LANDLORD", "ADVERTISER"]}>
              <MyListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-visits"
          element={
            <ProtectedRoute>
              <MyVisits />
            </ProtectedRoute>
          }
        />
        <Route
          path="matches"
          element={
            <ProtectedRoute requiredRoles={["USER"]}>
              <Matches />
            </ProtectedRoute>
          }
        />
        <Route
          path="favorites"
          element={
            <ProtectedRoute requiredRoles={["USER", "LANDLORD", "ADVERTISER"]}>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat/:chatId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes - Separated from Main Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="content" element={<ContentEditor />} />
        <Route path="moderation" element={<ModerationLogs />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
