import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {authApi} from "../api/auth.js";
import {jwtDecode} from "jwt-decode";
import { courseApi } from '../api/course.js';

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
    const [purchaserInfo, setPurchaserInfo] = useState(null);
    const [registeredCourses, setRegisteredCourses] = useState([]);


    return (
        <RegistrationContext.Provider value={{ purchaserInfo, registeredCourses }}>
            {children}
        </RegistrationContext.Provider>
    );
};

export const useRegistration = () => useContext(RegistrationProvider);