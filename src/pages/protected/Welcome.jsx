import React, { useState, useEffect } from "react";
import { Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import rootStore from "../../stores/rootStore.js";
import { courseApi } from "../../api/course.js";

export default function Welcome() {
    const navigate = useNavigate();
    const clientName = "FBC Industreinforce";
    const [agreed, setAgreed] = useState(false);
    const [employeeGroup, setEmployeeGroup] = useState(null);

    const getEmployeeGroup = async () => {
        try {
            const group = await courseApi.getEmployeeGroup();
            setEmployeeGroup(group);
            console.log(group);
        } catch (error) {
            console.log(error);
        }
    }

    const handleNext = () => {
        navigate('/course-select');
    };

    const handleCheckboxChange = (e) => {
        setAgreed(e.target.checked);
    };

    useEffect(() => {
        getEmployeeGroup();
    }, []);


    return (
        <Col>
            <h1>Welcome</h1>
            <hr />
            <p>Welcome to the LMS Training Portal for {employeeGroup && employeeGroup.clientName}.</p>
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
