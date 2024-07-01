import React from "react";
import {Container, Card, Col, Row, Image} from "react-bootstrap";

export default function ProtectedLayout(props){

    return (
        <Container fluid className="bg-secondary">
            <Row className="vh-100 d-flex justify-content-center align-items-center">
                <Col md={8} lg={6} xs={12}>
                    <Card className="shadow rounded-3 bg-light">
                        <Card.Body>
                            <Row>
                                <Col className="d-flex justify-content-center align-items-center p-6">
                                    <Image src="frame-logo.png" fluid alt="Frame & Associates" className='w-50'/> 
                                </Col>
                                <Col xs={6} className="d-flex justify-content-center align-items-center my-5 me-5">
                                    {props.children}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}