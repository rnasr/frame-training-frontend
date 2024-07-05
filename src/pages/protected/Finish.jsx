import React from "react";
import { Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import rootStore from "../../stores/rootStore.js";

export default function Finish() {
    const authStore = rootStore.authenticationStore;
    const navigate = useNavigate();

    const handleLogout = () => {
        authStore.logout();
        navigate("/login");
    };
    
    return (
        <Col>
            <h1>Congratulations!</h1>
            <p>Placeholder content for the course completion message.</p>
            <Button onClick={handleLogout}>Logout</Button>
        </Col>
    );
}
