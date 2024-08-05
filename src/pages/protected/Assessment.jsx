import React, { useState, useEffect } from "react";
import { Alert, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';

import { courseApi } from "../../api/course.js";

export default function Assessment() {
    const { Formik } = formik;
    const navigate = useNavigate();

    const [assessmentQuestions, setAssessmentQuestions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [initialSelections, setInitialSelections] = useState({});
    const courseAttemptId = sessionStorage.getItem('courseAttemptId');

    const getAssessmentQuestions = async () => {
        try {
            const questions = await courseApi.getAssessmentQuestions(courseAttemptId);
            setAssessmentQuestions(questions);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getAssessmentQuestions();
    }, []);

    const validationSchema = yup.object().shape(
        assessmentQuestions.reduce((schema, question) => {
            schema[question.id] = yup.string().required('This question is required');
            return schema;
        }, {})
    );

    const handleOptionChange = (questionId, optionId) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [questionId]: optionId
        }));

        if (!initialSelections[questionId]) {
            setInitialSelections(prevState => ({
                ...prevState,
                [questionId]: optionId
            }));
        }
    };

    const submitAnswers = async (values) => {
        const answers = assessmentQuestions.map(question => ({
            assessmentQuestionId: question.id,
            chosenOptionId: initialSelections[question.id],
            courseAttemptId: courseAttemptId
        }));

        try {
            await courseApi.recordAssessmentAnswers({
                courseAttemptId: courseAttemptId,
                answers: answers
            });
            console.log(JSON.stringify(answers));
            handleNext();
        } catch (e) {
            console.error(e);
        }
    };

    const handleNext = () => {
        navigate("/results");
    };

    return (
        <Col>
            <h1>Assess Your Knowledge</h1>
            <hr />
            <Alert variant="info" className="mx-1 my-5">
                <Row className="mx-1 px-2">
                    <Row>Please click on the best answer.</Row>
                    <Row className="my-3">The first answer that you select will be the answer that is recorded so please choose carefully!</Row>
                    <Row>Please answer all of the questions before clicking on “Calculate Score”.</Row>
                </Row>
            </Alert>
            <Formik
                initialValues={{}}
                validationSchema={validationSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={(values, { setSubmitting }) => {
                    submitAnswers(values);
                    setSubmitting(false);
                }}
            >
                {({ handleSubmit, handleChange, values, dirty, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>

                        {/* Map each question to a Form.Group */}
                        {assessmentQuestions.map((question, index) => (
                            <Form.Group key={index}>
                                <Row className="p-3 bg-light rounded my-3 border mx-1">
                                    <Form.Label className="mb-3">{index + 1}) {question.question}</Form.Label>

                                    {/* Map each option to a Form.Check */}
                                    {question.options.map(option => (
                                        <Row key={option.id} className="ms-2">
                                            <Form.Check
                                                type="radio"
                                                label={option.text}
                                                name={question.id}
                                                value={option.id}
                                                checked={values[question.id] === String(option.id)}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    handleOptionChange(question.id, option.id);
                                                }}
                                                isInvalid={!!errors[question.id]}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors[question.id]}
                                            </Form.Control.Feedback>
                                        </Row>
                                    ))}
                                </Row>

                                {/* Display response text if an option is selected */}
                                {selectedOptions[question.id] && (
                                    <Row className="p-2 ms-5">
                                        <p className="d-flex align-items-center">
                                            {question.options.find(option => option.id === selectedOptions[question.id]).correct ? (
                                                <i className="bi-check-circle-fill text-success fs-4 me-2"> </i>
                                            ) : (
                                                <i className="bi-x-circle-fill text-danger fs-4 me-2"> </i>
                                            )}
                                            {question.options.find(option => option.id === selectedOptions[question.id]).responseText}
                                        </p>
                                    </Row>
                                )}

                                <Form.Control.Feedback type="invalid">
                                    {errors[question.id]}
                                </Form.Control.Feedback>
                            </Form.Group>
                        ))}
                        <Button className="w-100 mt-5" type="submit" disabled={!dirty}>
                            Submit Answers and Calculate Score
                        </Button>
                    </Form>
                )}
            </Formik>
        </Col>
    );
}
