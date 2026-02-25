import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Jobs from '../pages/Jobs';
import JobDetails from '../pages/JobDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import JobSeeker from '../pages/dashboard/JobSeeker';
import Employer from '../pages/dashboard/Employer';
import Admin from '../pages/dashboard/Admin';
import PostJob from '../features/employer/pages/PostJob';
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
        </Routes>
    );
};

export default AppRoutes;
