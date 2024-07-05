import React from "react";
import { Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate('/course-select');
    };

    return (
        <Col>
            <h1>Welcome</h1>
            <p>Welcome message, post-login questions, terms, and privacy.</p>
            
            <Button onClick={handleNext}>
                Choose Course
            </Button>
        </Col>
    );
}
