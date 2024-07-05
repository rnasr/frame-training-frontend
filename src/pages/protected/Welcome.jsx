import React, { useState } from "react";
import { Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import rootStore from "../../stores/rootStore.js";

export default function Welcome() {
    const navigate = useNavigate();
    const clientName = "FBC Industreinforce";
    const [agreed, setAgreed] = useState(false);

    const handleNext = () => {
        navigate('/course-select');
    };

    const handleCheckboxChange = (e) => {
        setAgreed(e.target.checked);
    };

    return (
        <Col>
            <h1>Welcome</h1>
            <hr />
            <p>Welcome to the LMS Training Portal for {clientName}.</p>
            <p>To continue, please check the box below and proceed to course select.</p>
            
            <Form className="">
                <Form.Check 
                    className="mb-3 p-5"
                    type="checkbox"
                    label="I agree to this website's Terms of Use and Privacy Policy."
                    checked={agreed}
                    onChange={handleCheckboxChange}
                />
                <Button className="w-100" onClick={handleNext} disabled={!agreed}>
                    Choose Course
                </Button>
            </Form>
        </Col>
    );
}
