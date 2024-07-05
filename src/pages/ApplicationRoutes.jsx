import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// Import public pages to pass to router
import PublicLayout from "./PublicLayout.jsx";

import Login from "./public/Login.jsx";

// Import pages that require authorization
import ProtectedLayout from "./ProtectedLayout.jsx";

import Welcome from './protected/Welcome.jsx';
import CourseSelect from './protected/CourseSelect.jsx';
import Courseware from './protected/Courseware.jsx';
import Assessment from './protected/Assessment.jsx';
import Results from './protected/Results.jsx';
import Feedback from './protected/Feedback.jsx';
import Finish from './protected/Finish.jsx';

// Import authentication store
import rootStore from "../stores/rootStore.js";

export default function ApplicationRoutes() {
    const authStore = rootStore.authenticationStore;
    const [isSignedIn, setIsSignedIn] = useState(authStore.signedIn());

    useEffect(() => {
        setIsSignedIn(authStore.signedIn());
    }, [authStore]);

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

            {/* Protected routes */}
            <Route element={<ProtectedLayout />}>
                <Route
                    path="/welcome"
                    element={<RequireAuth><Welcome /></RequireAuth>}
                />
                <Route
                    path="/course-select"
                    element={<RequireAuth><CourseSelect /></RequireAuth>}
                />
                <Route
                    path="/courseware"
                    element={<RequireAuth><Courseware /></RequireAuth>}
                />
                <Route
                    path="/assessment"
                    element={<RequireAuth><Assessment /></RequireAuth>}
                />
                <Route
                    path="/results"
                    element={<RequireAuth><Results /></RequireAuth>}
                />
                <Route
                    path="/feedback"
                    element={<RequireAuth><Feedback /></RequireAuth>}
                />
                <Route
                    path="/finish"
                    element={<RequireAuth><Finish /></RequireAuth>}
                />
            </Route>
        </Routes>
    );
}

function RequireAuth({ children }) {
    const authStore = rootStore.authenticationStore;
    const location = useLocation();

    if (!authStore.signedIn()) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
}
