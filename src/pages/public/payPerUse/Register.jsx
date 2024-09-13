import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Form, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { payPerUseApi } from '../../../api/payPerUse';
import RegistrationForm from './RegistrationForm';
import PayPerUseHeader from './PayPerUseHeader';

export default function Register() {
    const [sortedCourses, setSortedCourses] = useState({});

    const getPpuCourses = async () => {  
        const courses = await payPerUseApi.getPpuCourses();
        const categorizedCourses = {};

        courses.forEach(course => {
            const category = course.category || 'General Courses';
            if (!categorizedCourses[category]) {
                categorizedCourses[category] = [];
            }
            categorizedCourses[category].push(course);
        });

        setSortedCourses(categorizedCourses);
    };

    useEffect(() => {
        getPpuCourses();
    }, []);

    return (
        <PayPerUseHeader>
            <Container fluid className="d-flex flex-column align-items-center  w-100">
                <RegistrationForm sortedCourses={sortedCourses} />
            </Container>
        </PayPerUseHeader>
    );
}
