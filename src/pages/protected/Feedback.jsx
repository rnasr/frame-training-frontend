import React, { useState, useEffect } from "react";
import { Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as formik from 'formik';

import { courseApi } from "../../api/course.js";

export default function Feedback() {
    const { Formik } = formik;   
    const navigate = useNavigate();
    
    const [feedbackQuestions, setFeedbackQuestions] = useState([]);
    
    const getFeedbackQuestions = async () => {
        try {
            const questions = await courseApi.getFeedbackQuestions();
            setFeedbackQuestions(questions);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getFeedbackQuestions();
    }, []);

    const submitFeedback = async (values) => {
        try {
            await courseApi.submitFeedback(values);
            handleNext();
        } catch (e) {
            console.error(e);
        }
    };

    const handleNext = () => {
        navigate("/certificate");
    };

    return (
        <Col>
            <h1>Feedback</h1>
            <hr />
            <Formik
                initialValues={{}}
                onSubmit={(values, { setSubmitting }) => {
                    submitFeedback(values);
                    setSubmitting(false);
                }}
            >
                {({ handleSubmit, handleChange, values }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        {feedbackQuestions.map((question) => (
                            <Form.Group controlId={question.id} key={question.id}>
                                <Form.Label className="mt-3">{question.question}</Form.Label>
                                {question.options.map(option => (
                                    <Form.Check
                                        type="radio"
                                        label={option.text}
                                        name={question.id}
                                        value={option.id}
                                        checked={values[question.id] === String(option.id)}
                                        onChange={handleChange}
                                        key={option.id}
                                    />
                                ))}
                            </Form.Group>
                        ))}
                        <Button className="w-100 mt-5" type="submit">
                            Submit Feedback and Get Certificate
                        </Button>
                    </Form>
                )}
            </Formik>
        </Col>
    );
}
