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
            {isSignedIn && (
                <Route element={<ProtectedLayout />}>
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/course-select" element={<CourseSelect />} />
                    <Route path="/courseware" element={<Courseware />} />
                    <Route path="/assessment" element={<Assessment />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/finish" element={<Finish />} />
                </Route>
            )}
            {!isSignedIn && (
                <Route
                    path="*"
                    element={<Navigate to="/login" />}
                />
            )}
        </Routes>
    );
}
