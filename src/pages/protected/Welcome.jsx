import React, { useState, useEffect } from "react";
import { Col, Button, Form } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';

import { courseApi } from "../../api/course.js";

export default function Welcome() {
    const { Formik } = formik;   
    const navigate = useNavigate();

    const employeeGroup = useOutletContext();
    const [postLoginQuestions, setPostLoginQuestions] = useState([]);
    const [agreed, setAgreed] = useState(false);

    const schema = yup.object().shape({
        agreed: yup.boolean().oneOf([true], 'You must agree to continue').required(),
        ...postLoginQuestions.reduce((acc, question) => {
            acc[question.fieldToPopulate] = yup.string().required('This field is required');
            return acc;
        }, {}),
    });

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
            <Formik
                validationSchema={schema}
                initialValues={{ agreed: false, ...postLoginQuestions.reduce((acc, question) => ({ ...acc, [question.fieldToPopulate]: '' }), {}) }}
                onSubmit={(values, { setSubmitting }) => {
                    console.log("Form submitted with values:", values);
                    setSubmitting(false);
                    handleNext();
                }}
            >
                {({ handleSubmit, handleChange, values, errors, touched }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        {postLoginQuestions.map((question) => (
                            <Form.Group controlId={question.fieldToPopulate} key={question.id}>
                                <Form.Label>{question.question}</Form.Label>
                                {question.type === 'text' && (
                                    <Form.Control
                                        type="text"
                                        name={question.fieldToPopulate}
                                        value={values[question.fieldToPopulate]}
                                        onChange={handleChange}
                                        isInvalid={touched[question.fieldToPopulate] && !!errors[question.fieldToPopulate]}
                                        placeholder={question.description}
                                    />
                                )}
                                {question.type === 'numeric' && (
                                    <Form.Control
                                        type="number"
                                        name={question.fieldToPopulate}
                                        value={values[question.fieldToPopulate]}
                                        onChange={handleChange}
                                        isInvalid={touched[question.fieldToPopulate] && !!errors[question.fieldToPopulate]}
                                        placeholder={question.description}
                                    />
                                )}
                                {question.type === 'yesNo' && (
                                    <div>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name={question.fieldToPopulate}
                                            value="yes"
                                            checked={values[question.fieldToPopulate] === 'yes'}
                                            onChange={handleChange}
                                            isInvalid={touched[question.fieldToPopulate] && !!errors[question.fieldToPopulate]}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name={question.fieldToPopulate}
                                            value="no"
                                            checked={values[question.fieldToPopulate] === 'no'}
                                            onChange={handleChange}
                                            isInvalid={touched[question.fieldToPopulate] && !!errors[question.fieldToPopulate]}
                                        />
                                    </div>
                                )}
                                {question.type === 'options' && (
                                    question.options.map(option => (
                                        <Form.Check
                                            type="radio"
                                            label={option}
                                            name={question.fieldToPopulate}
                                            value={option}
                                            checked={values[question.fieldToPopulate] === option}
                                            onChange={handleChange}
                                            isInvalid={touched[question.fieldToPopulate] && !!errors[question.fieldToPopulate]}
                                            key={option}
                                        />
                                    ))
                                )}
                                <Form.Control.Feedback type="invalid">
                                    {errors[question.fieldToPopulate]}
                                </Form.Control.Feedback>
                            </Form.Group>
                        ))}
                        <Form.Check
                            className="mb-3 p-5"
                            type="checkbox"
                            label="I agree to this website's Terms of Use and Privacy Policy."
                            name="agreed"
                            checked={values.agreed}
                            onChange={handleChange}
                            isInvalid={touched.agreed && !!errors.agreed}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.agreed}
                        </Form.Control.Feedback>
                        <Button className="w-100" type="submit" disabled={!values.agreed}>
                            Continue to Course Selection
                        </Button>
                    </Form>
                )}
            </Formik>
        </Col>
    );
}
