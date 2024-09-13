import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as formik from 'formik';
import * as yup from 'yup';
import { useRegistration } from '../../../contexts/RegistrationContext';

export default function RegistrationForm({ sortedCourses }) {

    const { Formik } = formik;
    const navigate = useNavigate();
    const registrationContext = useRegistration();

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        province: '',
        country: 'Canada',
        postalCode: '',
        courseQuantities: {},
    };

    const validationSchema = yup.object().shape({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        address: yup.string().required('Address is required'),
        city: yup.string().required('City is required'),
        province: yup.string().required('Province is required'),
        postalCode: yup.string().required('Postal Code is required'),
        country: yup.string().required('Country is required'),
        company: yup.string()
    });

    const handleSubmit = (values) => {
        const selectedCourses = Object.entries(values.courseQuantities)
            .filter(([_, details]) => details.selected)
            .map(([courseId, details]) => ({
                courseId: parseInt(courseId),
                quantity: details.quantity
            }));
        
        const finalValues = {
            ...values,
            courseQuantities: selectedCourses,
        };

        sessionStorage.setItem('registrationData', JSON.stringify(finalValues));
        navigate("/register/purchase"); 
    };
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
                <Form onSubmit={handleSubmit}>
                    <Row className="px-5 py-3 bg-light border rounded-3 shadow w-50 m-auto">
                        <h4 className="mb-3 border-bottom py-3">Course Registration</h4>
                        
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>First Name*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    isInvalid={touched.firstName && !!errors.firstName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.firstName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    isInvalid={touched.lastName && !!errors.lastName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Company</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="company"
                                    value={values.company}
                                    onChange={handleChange}
                                    isInvalid={touched.company && !!errors.company}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.company}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email*</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={touched.email && !!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Address*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={values.address}
                                    onChange={handleChange}
                                    isInvalid={touched.address && !!errors.address}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>City*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    isInvalid={touched.city && !!errors.city}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.city}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Province*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="province"
                                    value={values.province}
                                    onChange={handleChange}
                                    isInvalid={touched.province && !!errors.province}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.province}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Country*</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="country"
                                    value={values.country}
                                    onChange={handleChange}
                                    isInvalid={touched.country && !!errors.country}
                                >
                                    <option value="Canada">Canada</option>
                                    {/* Add other countries as options if needed */}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors.country}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Postal Code*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="postalCode"
                                    value={values.postalCode}
                                    onChange={handleChange}
                                    isInvalid={touched.postalCode && !!errors.postalCode}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.postalCode}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Course List */}
                    <Row className="px-5 py-3 bg-light border rounded-3 shadow w-50 mx-auto mt-5">
                        {Object.entries(sortedCourses).map(([category, courses]) => (
                            <Col key={category} md={12} className="mb-4">
                                <h4 className="mb-3 border-bottom py-3">{category}</h4>
                                <Row className="fw-bold pb-2 mb-3">
                                    <Col md={7}>Name</Col>
                                    <Col>Price</Col>
                                    <Col>Qty</Col>
                                    <Col>Total</Col>
                                </Row>
                                {courses.map((course) => (
                                    <Row key={course.id} className="align-items-center mb-3 p-0">
                                        <Col md={7}>
                                            <Form.Check
                                                type="checkbox"
                                                label={course.displayName}
                                                name={`courseQuantities.${course.id}.selected`}
                                                onChange={handleChange}
                                                checked={values.courseQuantities[course.id]?.selected || false}
                                            />
                                        </Col>
                                        <Col>${course.price}</Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                name={`courseQuantities.${course.id}.quantity`}
                                                value={values.courseQuantities[course.id]?.quantity || 0}
                                                onChange={handleChange}
                                                style={{ width: '60px' }}
                                                disabled={!values.courseQuantities[course.id]?.selected}
                                            />
                                        </Col>
                                        <Col>
                                            ${(course.price * (values.courseQuantities[course.id]?.quantity || 0)).toFixed(2)}
                                        </Col>
                                    </Row>
                                ))}
                            </Col>
                        ))}
                    </Row>
                    <Row className="d-flex justify-content-center mx-auto w-50">
                        <Button type="submit" className="mt-5 mb-5">Continue</Button>
                    </Row>

                </Form>
            )}
        </Formik>
    );
}
