import React, { useState, useEffect } from "react";
import { Col, Button, Form } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { courseApi } from "../../api/course.js";

export default function Welcome() {
    const navigate = useNavigate();
    const employeeGroup = useOutletContext();
    const [postLoginQuestions, setPostLoginQuestions] = useState(null);
    const [agreed, setAgreed] = useState(false);

    const getPostLoginQuestions = async () => {
        try {
            const questions = await courseApi.getPostLoginQuestions();
            setPostLoginQuestions(questions);
        } catch (e) {
            console.error(e);
        }
    };

    const handleNext = () => {
        navigate("/course-select");
    };

    const handleCheckboxChange = (e) => {
        setAgreed(e.target.checked);
    };

    useEffect(() => {
        if (employeeGroup && employeeGroup.askPostLoginQuestions) {
            getPostLoginQuestions();
        }
    }, [employeeGroup]);

    return (
        <Col>
            <h1>Welcome</h1>
            <hr />
            <p>Welcome to the LMS Training Portal for {employeeGroup && employeeGroup.clientName}.</p>
            {employeeGroup && employeeGroup.askPostLoginQuestions && <p>Please answer the following questions.</p>}
            {postLoginQuestions && postLoginQuestions.map((question) => (
                <p key={question.id}>{question.question}</p>
            ))}
            <p>To continue, please check the box below and proceed to course select.</p>
            <Form>
                <Form.Check
                    className="mb-3 p-5"
                    type="checkbox"
                    label="I agree to this website's Terms of Use and Privacy Policy."
                    checked={agreed}
                    onChange={handleCheckboxChange}
                />
                <Button className="w-100" onClick={handleNext} disabled={!agreed}>
                    Continue to Course Selection
                </Button>
            </Form>
        </Col>
    );
}
