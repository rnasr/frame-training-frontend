import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {authApi} from "../api/auth.js";
import {jwtDecode} from "jwt-decode";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authentication, setAuthentication] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authStr = localStorage.getItem('authentication');
        if (authStr) {
            const auth = JSON.parse(authStr);
            setAuthentication( new Authentication(
                auth.username, auth.firstName, auth.lastName, auth.clientName, auth.clientId,
                auth.role, auth.jwtToken, auth.refreshToken
            ));
        }
    }, []);

    const signIn = async (username, password) => {
        let result = await authApi.login(username, password);
        let claims = jwtDecode(result.jwtToken);
        const newAuth =new Authentication(
            claims.username, claims.firstName, claims.lastName, claims.clientName, parseInt(claims.clientId),
            claims.role, result.jwtToken, result.refreshToken
        );
        setAuthentication(newAuth);
        localStorage.setItem('authentication', JSON.stringify(newAuth));
    };

    const refreshToken = async () => {
        console.log("refreshToken called", authentication);
        if (authentication) {
            try {
                console.log("about to send request to refresh token");
                let result = await authApi.refreshToken(authentication.jwtToken, authentication.refreshToken);
                let claims = jwtDecode(result.jwtToken);
                const newAuth = new Authentication(
                    claims.username, claims.firstName, claims.lastName, claims.clientName, parseInt(claims.clientId),
                    claims.role, result.jwtToken, result.refreshToken
                );
                setAuthentication(newAuth);
                localStorage.setItem('authentication', JSON.stringify(newAuth));
                return result.jwtToken;
            } catch (e) {
                console.warn('Could not refresh token. Logging out.', e);
                logout();
            }
        } else {
            logout();
        }
    };

    const signedIn = () => authentication !== null;

    const logout = () => {
        setAuthentication(null);
        localStorage.removeItem('authentication');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ authentication, signIn, signedIn, refreshToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export class Authentication {
    constructor(username, firstName, lastName, clientName, clientId, role, jwtToken, refreshToken) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.clientName = clientName;
        this.clientId = clientId;
        this.role = role;
        this.jwtToken = jwtToken;
        this.refreshToken = refreshToken;
    }
}
