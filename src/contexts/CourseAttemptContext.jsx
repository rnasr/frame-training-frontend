import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {authApi} from "../api/auth.js";
import {jwtDecode} from "jwt-decode";
import { courseApi } from '../api/course.js';

const CourseAttemptContext = createContext();

export const CourseAttemptProvider = ({ children }) => {
    const [courseAttempt, setCourseAttempt] = useState(null);
    const navigate = useNavigate();
    const pathsThatRequireCourseAttemptId = [
        "/courseware",
        "/assessment",
        "/results",
        "/feedback",
    ];
    const getCourseAttempt = async () => {
        const courseAttemptId = sessionStorage.getItem('courseAttemptId');
        if (courseAttemptId) {
            try {
                const response = await courseApi.getCourseAttempt(courseAttemptId);
                setCourseAttempt(response);
            } catch (e) {
                console.error(e);
            }
        }
    }
    useEffect(() => {
        getCourseAttempt();
    }, []);

    const activeCourseAttempt = () => courseAttempt !== null;

    const clearCourseAttempt = () => {
        setAuthentication(null);
        localStorage.removeItem('courseAttemptId');
    };

    return (
        <CourseAttemptContext.Provider value={{ courseAttempt, setCourseAttempt, clearCourseAttempt, activeCourseAttempt }}>
            {children}
        </CourseAttemptContext.Provider>
    );
};

export const useCourseAttempt = () => useContext(CourseAttemptContext);