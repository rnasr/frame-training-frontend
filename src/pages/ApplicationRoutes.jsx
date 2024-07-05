import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// Import public pages to pass to router
import PublicLayout from "./PublicLayout.jsx";
import Login from "./public/Login.jsx";

// Import pages that require authorization
import ProtectedLayout from "./ProtectedLayout.jsx";
import Welcome from './protected/Welcome.jsx';

// Import authentication store
import rootStore from "../stores/rootStore.js";

export default function ApplicationRoutes() {
    const authStore = rootStore.authenticationStore;
    const [isSignedIn, setIsSignedIn] = useState(authStore.signedIn());

    useEffect(() => {
        setIsSignedIn(authStore.signedIn());
        console.log("isSignedIn: " + isSignedIn);
    }, [authStore]);

    return (
        <Routes>
            {/* Set /login and root to login page */}
            <Route path="/" element={
                <PublicLayout>
                    <Login />
                </PublicLayout>
            } />

            <Route path="/login" element={
                <PublicLayout>
                    <Login />
                </PublicLayout>
            } />

            {/* Set routes for protected pages */}
            <Route element={<ProtectedLayout />}>
                <Route path="/welcome" element={
                    <RequireAuth>
                        <Welcome />
                    </RequireAuth>
                } />
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
