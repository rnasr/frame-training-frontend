import React, { useState, useEffect } from "react";
import { Alert, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as formik from 'formik';

import { courseApi } from "../../api/course.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useCourseAttempt } from "../../contexts/CourseAttemptContext.jsx";

export default function Feedback() {
    const { Formik } = formik;   
    const navigate = useNavigate();
    const authContext = useAuth();
    const caContext = useCourseAttempt();
    const employeeGroup = authContext.employeeGroup;
    const courseId = sessionStorage.getItem('courseId');
    
    const [feedbackQuestions, setFeedbackQuestions] = useState([]);
    
    const getFeedbackQuestions = async () => {
        try {
            const questions = await courseApi.getFeedbackQuestions();
            setFeedbackQuestions(questions);
        } catch (e) {
            console.error(e);
        }
    };

    const submitFeedback = async (values) => {
        const employeeGroupId = employeeGroup.id; 

        const answeredFeedback = Object.keys(values).map(key => ({
            feedbackQuestionId: parseInt(key),
            answer: values[key]
        }));

        const feedback = {
            courseId,
            employeeGroupId,
            answeredFeedback
        };

        try {
            await courseApi.submitFeedback(feedback);
            handleNext();
        } catch (e) {
            console.error(e);
        }
    };
    
    const handleNext = () => {
        navigate("/finish");
    };
    
    useEffect(() => {
        if (caContext.courseAttempt){
            getFeedbackQuestions();
        } else {
            navigate("/course-select");
        }
        
    }, []);

    return (
        <Col>
            <h1>Feedback</h1>
            <hr />
            <Alert variant="info" className="mx-1 my-5">
                <Row className="mx-1 px-2">
                    <Row>Please take a minute and give us your feedback. Your anonymous feedback will be submitted to Human Resources.</Row>
                    <Row className="my-3"><em>Leaving feedback is optional. If you don't wish to leave feedback click "Continue" below.</em></Row>
                </Row>
            </Alert>
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
                                <Row className="p-3 bg-light rounded my-3 border mx-1">
                                    <Form.Label className="mb-3">{question.question}</Form.Label>
                                    
                                    {question.questionType === 'options' && question.options.map(option => (
                                        <Form.Check
                                            type="radio"
                                            label={option}
                                            name={question.id}
                                            value={option}
                                            checked={values[question.id] === option}
                                            onChange={handleChange}
                                            key={option}
                                        />
                                    ))}

                                    {question.questionType === 'rating' && (
                                        <div>
                                            {[1, 2, 3, 4, 5].map(rating => (
                                                <Form.Check
                                                    type="radio"
                                                    label={rating}
                                                    name={question.id}
                                                    value={rating}
                                                    checked={values[question.id] === rating.toString()}
                                                    onChange={handleChange}
                                                    key={rating}
                                                    inline
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {question.questionType === 'text' && (
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name={question.id}
                                            value={values[question.id] || ''}
                                            onChange={handleChange}
                                        />
                                    )}
                                </Row>
                            </Form.Group>
                        ))}
                        <Button className="w-100 mt-5" type="submit">
                            Continue to Course Completion
                        </Button>
                    </Form>
                )}
            </Formik>
        </Col>
    );
}
