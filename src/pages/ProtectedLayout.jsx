import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Container, Col, Row, Image } from "react-bootstrap";

import LoadingBar from "../components/LoadingBar.jsx";
import rootStore from "../stores/rootStore.js";
import { courseApi } from "../api/course.js";

export default function ProtectedLayout() {
    const authStore = rootStore.authenticationStore;
    const [employeeGroup, setEmployeeGroup] = useState(null);
    const navigate = useNavigate();

    const getEmployeeGroup = async () => {
        try {
            const group = await courseApi.getEmployeeGroup();
            setEmployeeGroup(group);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getEmployeeGroup();
    }, []);

    const handleLogout = () => {
        authStore.logout();
        navigate("/login");
    };

    if (!employeeGroup) {
        return <LoadingBar />;
    }

    return (
        <Container fluid className="d-flex flex-column vh-100 bg-white">
            <Row className="d-flex justify-content-between align-items-center m-3">
                <Col className="d-flex justify-content-start">
                    <Image
                        src={employeeGroup.clientLogoUrl || "/frame-logo.png"}
                        height={80}
                        alt="Client Logo"
                    />
                </Col>
                <Col className="d-flex justify-content-end">
                    <Link to="/login" onClick={handleLogout} className="text-primary">
                        Logout
                    </Link>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center pb-5 flex-grow-1">
                <Col md={8} lg={6} xs={12} className="d-flex justify-content-center align-items-center">
                    <div className="shadow rounded-3 bg-light p-5 border">
                        <Outlet context={employeeGroup} />
                    </div>
                </Col>
            </Row>
            <Row className="bg-white text-center py-2">
                <Col>
                    <small className="text-muted">
                        &copy; 2002-2024{" "}
                        <a href="https://www.frameassociates.com/" target="_blank" rel="noopener noreferrer">
                            Frame and Associates Consulting Inc.
                        </a>
                    </small>
                </Col>
            </Row>
        </Container>
    );
}
