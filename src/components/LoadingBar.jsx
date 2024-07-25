import React from "react";
import {Container, Spinner} from "react-bootstrap";

export default function LoadingBar() {

    return (
        <Container fluid className="h-100 d-flex justify-content-center align-items-center">
            <img src="/frame-loading.png" alt="Frame & Associates" />
        </Container>
    )
}