import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';

import { courseApi } from "../../api/course.js";

export default function Welcome() {
    const { Formik } = formik;
    const navigate = useNavigate();
    const employeeGroup = useOutletContext();
    const [postLoginQuestions, setPostLoginQuestions] = useState([]);
    const [schema, setSchema] = useState(yup.object().shape({
        agreed: yup.boolean().oneOf([true], 'You must agree to continue').required(),
    }));

    const getPostLoginQuestions = async () => {
        try {
            const questions = await courseApi.getPostLoginQuestions();
            let otherIndex = 1;
            const transformedQuestions = questions.map(question => {
                if (question.fieldToPopulate === 'other') {
                    const newFieldToPopulate = `otherField${otherIndex}`;
                    otherIndex++;
                    return { ...question, fieldToPopulate: newFieldToPopulate };
                }
                return question;
            });
            setPostLoginQuestions(transformedQuestions);

            const dynamicSchema = transformedQuestions.reduce((acc, question) => {
                acc[question.fieldToPopulate] = yup.string().required('This field is required');
                return acc;
            }, {
                agreed: yup.boolean().oneOf([true], 'You must agree to continue').required(),
            });
            setSchema(yup.object().shape(dynamicSchema));

        } catch (e) {
            console.error(e);
        }
    };

    const handleNext = () => {
        navigate("/course-select");
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
            <p>Welcome to the LMS Training Portal for <strong>{employeeGroup && employeeGroup.clientName}</strong>.</p>
            {employeeGroup && employeeGroup.askPostLoginQuestions && <p>Please provide the following information:</p>}
            <Formik
                validationSchema={schema}
                initialValues={{ agreed: false }}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async (values, { setSubmitting, setErrors, validateForm }) => {
                    const errors = await validateForm();
                    if (Object.keys(errors).length) {
                        setErrors(errors);
                        setSubmitting(false);
                        return;
                    }

                    const transformedValues = { ...values };

                    postLoginQuestions.forEach(question => {
                        if (question.type === 'numeric') {
                            transformedValues[question.fieldToPopulate] = String(values[question.fieldToPopulate]);
                        }

                        if (question.fieldToPopulate.startsWith('otherField')) {
                            const suffix = question.fieldToPopulate.slice('otherField'.length);
                            transformedValues[`otherFieldName${suffix}`] = question.question;
                        }
                    });

                    sessionStorage.setItem('userInfo', JSON.stringify(transformedValues));
                    setSubmitting(false);
                    handleNext();
                }}
            >
                {({ handleSubmit, handleChange, values, errors, touched, validateForm }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row className="border-bottom">
                            {postLoginQuestions.map((question, index) => (
                                <Col md={6} key={question.id} className="border-bottom py-4">
                                    <Form.Group controlId={question.fieldToPopulate}>
                                        <Form.Label>{question.question}</Form.Label>
                                        {question.type === 'text' && (
                                            <Form.Control
                                                type="text"
                                                name={question.fieldToPopulate}
                                                value={values[question.fieldToPopulate]}
                                                onChange={handleChange}
                                                isInvalid={!!errors[question.fieldToPopulate]}
                                                placeholder={question.description}
                                            />
                                        )}
                                        {question.type === 'numeric' && (
                                            <Form.Control
                                                type="number"
                                                name={question.fieldToPopulate}
                                                value={values[question.fieldToPopulate]}
                                                onChange={handleChange}
                                                isInvalid={!!errors[question.fieldToPopulate]}
                                                placeholder={question.description}
                                            />
                                        )}
                                        {question.type === 'yesno' && (
                                            <>
                                                <Form.Check
                                                    type="radio"
                                                    label="Yes"
                                                    name={question.fieldToPopulate}
                                                    value="yes"
                                                    checked={values[question.fieldToPopulate] === 'yes'}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors[question.fieldToPopulate]}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="No"
                                                    name={question.fieldToPopulate}
                                                    value="no"
                                                    checked={values[question.fieldToPopulate] === 'no'}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors[question.fieldToPopulate]}
                                                />
                                            </>
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
                                                    isInvalid={!!errors[question.fieldToPopulate]}
                                                    key={option}
                                                />
                                            ))
                                        )}
                                        <Form.Control.Feedback type="invalid">
                                            {errors[question.fieldToPopulate]}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                        <Form.Check
                            className="mb-3 p-5"
                            type="checkbox" 
                            label={<span>I agree to this website's <Link to="/terms" target="_blank">Terms of Use</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link>.</span>}
                            name="agreed"
                            checked={values.agreed}
                            onChange={handleChange}
                            isInvalid={!!errors.agreed}
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
