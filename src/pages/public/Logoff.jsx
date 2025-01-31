import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';


function Logoff() {
    const navigate = useNavigate();
    const authContext = useAuth();

    useEffect(() => {
        const performLogoff = async () => {
            try {
                await authContext.logout();
                navigate("/login", { replace: true });
            } catch (error) {
                console.error("Error during sign out:", error);
                navigate("/login", { replace: true });
            }
        };

        performLogoff();
    }, [navigate, authContext]);

    return (
        <div className="text-center">
            <p>Logging out...</p>
        </div>
    );
}

export default Logoff;
