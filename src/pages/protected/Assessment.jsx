import React, { useState, useEffect } from "react";
import { Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as formik from 'formik';

import { courseApi } from "../../api/course.js";

export default function Assessment() {
    const { Formik } = formik;   
    const navigate = useNavigate();
    
    const [assessmentQuestions, setAssessmentQuestions] = useState([]);
    const courseAttemptId = sessionStorage.getItem('courseAttemptId');

    const getAssessmentQuestions = async () => {
        try {
            const questions = await courseApi.getAssessmentQuestions(courseAttemptId);
            setAssessmentQuestions(questions);
        } catch (e) {
            console.error(e);
        }
    };

    const submitAnswers = async (values) => {
        const answers = assessmentQuestions.map(question => ({
            assessmentQuestionId: question.id,
            chosenOptionId: values[question.id],
            courseAttemptId: courseAttemptId
        }));

        try {
            await courseApi.recordAssessmentAnswers({
                courseAttemptId: courseAttemptId,
                answers: answers
            });
            handleNext();
        } catch (e) {
            console.error(e);
        }
    };

    const handleNext = () => {
        navigate("/results");
    };

    useEffect(() => {
        getAssessmentQuestions();
    }, []);

    return (
        <Col>
            <h1>Assessment</h1>
            <hr />
            <Formik
                initialValues={{}}
                onSubmit={(values, { setSubmitting }) => {
                    submitAnswers(values);
                    setSubmitting(false);
                }}
            >
                {({ handleSubmit, handleChange, values }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        {assessmentQuestions.map((question) => (
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
                        <Button className="w-100" type="submit">
                            Submit Answers
                        </Button>
                    </Form>
                )}
            </Formik>
        </Col>
    );
}
