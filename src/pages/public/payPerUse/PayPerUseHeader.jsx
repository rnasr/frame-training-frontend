import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Form, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PayPerUseHeader({children}) {

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
            <Container fluid className="d-flex flex-column align-items-center w-100">
                {children}
            </Container>
        </>
    );
}
