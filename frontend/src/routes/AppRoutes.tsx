import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Listings from '../pages/Listings';
import ListingDetails from '../pages/ListingDetails';
import CreateListing from '../pages/CreateListing';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import Matches from '../pages/Matches';
import Onboarding from '../pages/Onboarding';
import Settings from '../pages/Settings';
import AdminDashboard from '../pages/AdminDashboard';
import Notifications from '../pages/Notifications';
import ForgotPassword from '../pages/auth/ForgotPassword';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="onboarding" element={<Onboarding />} />
                <Route path="listings" element={<Listings />} />
                <Route path="listings/create" element={<CreateListing />} />
                <Route path="listings/:id" element={<ListingDetails />} />
                <Route path="matches" element={<Matches />} />
                <Route path="chat" element={<Chat />} />
                <Route path="chat/:chatId" element={<Chat />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;

