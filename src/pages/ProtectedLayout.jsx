import React, { useState, useEffect } from "react";
import { Container, Col, Row, Image } from "react-bootstrap";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import LoadingBar from "../components/LoadingBar.jsx";
import { courseApi } from "../api/course.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProtectedLayout() {
    const authContext = useAuth();
    const [employeeGroup, setEmployeeGroup] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

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
        authContext.logout();
        navigate("/login");
    };

    if (!employeeGroup) {
        return <LoadingBar />;
    }

    const steps = [
        { name: "Welcome", path: "/welcome" },
        { name: "Choose Course", path: "/course-select" },
        { name: "Courseware", path: "/courseware" },
        { name: "Assessment", path: "/assessment" },
        { name: "Review", path: "/results" },
        { name: "Feedback", path: "/feedback" },
        { name: "Finish", path: "/finish" },
    ];

    return (
        <Container fluid className="d-flex flex-column vh-100 bg-white">
            {/* Header */}
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

            {/* Course Step Tracker */}
            <Row className="d-flex justify-content-center pb-5 flex-grow-1">
                <Col lg={2} className="d-none d-lg-block mt-5 me-5">
                    <div className="nav-assistant">
                        <ul className="list-unstyled">
                            {steps.map((step, index) => (
                                <li
                                    key={index}
                                    className={
                                        location.pathname === step.path
                                            ? "p-2 fs-5 fw-bold text-primary border-bottom"
                                            : location.pathname === "/finish" || steps.findIndex(s => s.path === location.pathname) > index
                                            ? "p-2 fs-6 text-primary border-bottom"
                                            : "p-2 fs-6 text-info border-bottom"
                                    }
                                >
                                    <i className={
                                        location.pathname === step.path
                                            ? ""
                                            : location.pathname === "/finish" || steps.findIndex(s => s.path === location.pathname) > index
                                            ? "bi-record-circle me-2"
                                            : "bi-circle me-2"
                                    }></i>
                                    {step.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Col>

                {/* Course Main Outlet */}
                <Col md={8} lg={6} xs={12} className="d-flex justify-content-center">
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
