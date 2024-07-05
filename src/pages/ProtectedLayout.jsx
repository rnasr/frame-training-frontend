import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Container, Col, Row, Image } from "react-bootstrap";
import rootStore from "../stores/rootStore.js";

export default function ProtectedLayout() {
    const authStore = rootStore.authenticationStore;
    const navigate = useNavigate();

    const handleLogout = () => {
        authStore.logout();
        navigate("/login");
    };

    return (
        <Container fluid className="d-flex flex-column vh-100 bg-white">
            <Row className="d-flex justify-content-between align-items-center m-3">
                <Col className="d-flex justify-content-start">
                    <Image src="/frame-logo.png" height={60} alt="Client Logo" />
                </Col>
                <Col className="d-flex justify-content-end">
                    <Link to="/login" onClick={handleLogout} className="text-primary">
                        Logout
                    </Link>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center pb-5 flex-grow-1">
                <Col md={8} lg={6} xs={12} className="d-flex justify-content-center align-items-center">
                    <div className="shadow rounded-3 bg-light p-5">
                        <Outlet />
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
