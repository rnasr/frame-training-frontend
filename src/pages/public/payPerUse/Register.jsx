import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Form, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { payPerUseApi } from '../../../api/payPerUse';
import RegistrationForm from './RegistrationForm';

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
        <>
            {/* Header */}
            <Row fluid className="w-100 d-flex justify-content-between align-items-center pt-4 px-5">
                <Col className="d-flex justify-content-start">
                    <Image
                        src={"/frame-logo.png"}
                        height={80}
                        alt="Client Logo"
                    />
                </Col>

                <Col className="d-flex justify-content-end">
                    <Link to="/login" className="text-primary">
                        Log In
                    </Link>
                </Col>
            </Row>
            <Container fluid className="d-flex flex-column align-items-center">
                <RegistrationForm sortedCourses={sortedCourses} />
            </Container>
        </>
    );
}
