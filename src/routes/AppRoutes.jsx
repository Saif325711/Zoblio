import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Jobs from '../pages/Jobs';
import JobDetails from '../pages/JobDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Notifications from '../pages/Notifications';
import Messages from '../pages/Messages';
import JobSeeker from '../pages/dashboard/JobSeeker';
import Employer from '../pages/dashboard/Employer';
import Admin from '../pages/dashboard/Admin';
import PostJob from '../features/employer/pages/PostJob';
import ManageApplications from '../features/employer/pages/ManageApplications';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/dashboard/seeker" element={<ProtectedRoute><JobSeeker /></ProtectedRoute>} />
            <Route path="/dashboard/employer" element={<ProtectedRoute><Employer /></ProtectedRoute>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
            <Route path="/dashboard/employer/applications" element={<ProtectedRoute><ManageApplications /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/messages/:conversationId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        </Routes>
    );
};

export default AppRoutes;
