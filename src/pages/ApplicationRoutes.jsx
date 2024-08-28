import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {AuthProvider, useAuth} from "../contexts/AuthContext.jsx";
import setupInterceptors from "../_helpers/axiosInterceptors.js";

// Import public pages to pass to router
import PublicLayout from "./PublicLayout.jsx";
import Login from "./public/Login.jsx";
import Terms from "./public/Terms.jsx";
import Privacy from "./public/Privacy.jsx";
import Register from "./public/payPerUse/Register.jsx";
import Purchase from "./public/payPerUse/Purchase.jsx";


// Import pages that require authorization
import ProtectedLayout from "./ProtectedLayout.jsx";
import Welcome from './protected/Welcome.jsx';
import CourseSelect from './protected/CourseSelect.jsx';
import Courseware from './protected/Courseware.jsx';
import Assessment from './protected/Assessment.jsx';
import Results from './protected/Results.jsx';
import Feedback from './protected/Feedback.jsx';
import Finish from './protected/Finish.jsx';
import { CourseAttemptProvider } from '../contexts/CourseAttemptContext.jsx';

function ApplicationRoutes() {
    const authContext = useAuth();
    const [isSignedIn, setIsSignedIn] = useState(authContext.signedIn());

    useEffect(() => {
        setupInterceptors(() => authContext);
    }, [authContext]);
    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/"
                element={
                    <PublicLayout>
                        <Login />
                    </PublicLayout>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicLayout>
                        <Login />
                    </PublicLayout>
                }
            />
            <Route
                path="/terms"
                element={<Terms />}
            />
            <Route
                path="/privacy"
                element={<Privacy />}
            />
            <Route
                path="/register"
                element={<Register />}
            />
            <Route
                path="/register/purchase"
                element={<Purchase />}
            />

            {/* Protected routes */}
            {authContext.signedIn() && (
                <Route element={<ProtectedLayout />}>
                    <Route path="/welcome" element={<RequireAuth><Welcome /></RequireAuth>} />
                    <Route path="/course-select" element={<RequireAuth><CourseSelect /></RequireAuth>} />
                    <Route path="/courseware" element={<RequireAuth><Courseware /></RequireAuth>} />
                    <Route path="/assessment" element={<RequireAuth><Assessment/></RequireAuth>} />
                    <Route path="/results" element={<RequireAuth><Results/></RequireAuth>} />
                    <Route path="/feedback" element={<RequireAuth><Feedback/></RequireAuth>} />
                    <Route path="/finish" element={<RequireAuth><Finish/></RequireAuth>} />
                </Route>
            )}
        </Routes>
    );
}

const RequireAuth = ({ children }) => {
    const location = useLocation();
    const { signedIn } = useAuth();

    if (!signedIn()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default () => (
    <AuthProvider>
        <CourseAttemptProvider>
            <ApplicationRoutes />
        </CourseAttemptProvider>        
    </AuthProvider>
);

