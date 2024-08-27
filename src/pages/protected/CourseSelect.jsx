import React, { useState, useEffect } from "react";
import { Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import LoadingBar from "../../components/LoadingBar.jsx";
import { courseApi } from "../../api/course.js";

export default function CourseSelect() {
    const navigate = useNavigate();
    const [availableCourses, setAvailableCourses] = useState(null);

    const getAvailableCourses = async () => {
        const courses = await courseApi.getAvailableCourses();

        setAvailableCourses(courses);
    };

    const startCourseAttempt = async (id) => {
        console.log("Attempting to start course: " + id);
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

        try {
            const response = await courseApi.startCourseAttempt({
                ...userInfo,
                courseId: id
            });
            if (response) {
                sessionStorage.removeItem('userInfo');
                sessionStorage.setItem('courseAttemptId', response);
                sessionStorage.setItem('courseId', id);
                handleNext();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleNext = () => {
        navigate("/courseware");
    };

    useEffect(() => {
        getAvailableCourses();
    }, []);

    if (!availableCourses) {
        return <LoadingBar />;
    }

    return (
        <Col>
            <h1>Course Selection</h1>
            <hr />
            {availableCourses && availableCourses.length > 0 && (
                <Row className="ms-1 my-4">Please choose a course to proceed:</Row>
            )}
            {availableCourses && availableCourses.length > 0 && (
                <>
                    {availableCourses.map((course) => (
                        <>
                        <Button
                            className="w-100 mb-1 p-4"
                            onClick={() => startCourseAttempt(course.courseId)}
                            key={course.courseId}
                            disabled={course.payPerUse && course.availableCredits <= 0}
                        >
                            {course.courseName}
                        </Button>
                        {/* display status of credits and a warning if credits are depleted */}
                        {course.payPerUse && course.availableCredits <= 0 && (
                            <Alert variant="warning" size="sm" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} className="mb-3">
                              <span style={{ fontWeight: 'bold' }}>Available Credits: {course.availableCredits}.</span> Please purchase more credits to take this course.
                            </Alert>
                        )}
                        {course.payPerUse && course.availableCredits > 0 && (
                            <Alert variant="info" size="sm" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} className="mb-3">
                              <span style={{ fontWeight: 'bold' }}>Available Credits: {course.availableCredits}.</span> 
                            </Alert>
                        )}
                        </>
                    ))}
                </>
            )}
        </Col>
    );
}
