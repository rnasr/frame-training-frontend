import React, { useState, useEffect } from 'react';


import { payPerUseApi } from '../../api/payPerUse';

export default function Register() {

    const [ppuCourses, setPpuCourses] = useState([]);

    const getPpuCourses = async () => { 
        const courses = await payPerUseApi.getPpuCourses();
        setPpuCourses(courses);
    };

    useEffect(() => {
        getPpuCourses();
    }, []);

    return (
        <div className="p-5 bg-light border rounded-3 m-5 shadow">
            <h1>Register</h1>
            <p>{ppuCourses}</p>
        </div>
    );
}