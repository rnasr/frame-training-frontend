import React, {useState} from 'react';
import {useLocation, useNavigate, Link} from "react-router-dom";
import {Alert, Form, Button} from 'react-bootstrap';

import * as formik from 'formik';
import * as yup from 'yup';

import rootStore from "../../stores/rootStore.js";

export default function Login() {
    const { Formik } = formik;
    const schema = yup.object().shape({
        username: yup.string().required(),
        passkey: yup.string().required(),
    });

    const [pageState, setPageState] = useState({pageError: null});
    let navigate = useNavigate();
    let location = useLocation();
    let authStore = rootStore.authenticationStore;
    let from = location.state?.from?.pathname || "/";
    console.log(from); 

    return (                                
        <>
            <Formik                                        
                validationSchema={schema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        try {
                            await authStore.signIn(values.username, values.passkey) 
                            // navigate(from, { replace: true });
                            navigate("/welcome", { replace: true }); 
                            // window.location.href = "/welcome";
                        } catch (e){
                            setPageState(prevState => {return {...prevState, pageError: "Invalid username / passkey" }})
                            console.error("Invalid username / passkey" + e);
                        }
                    } finally {
                        setSubmitting(false);
                    }
                }}
                initialValues={{
                    username: '',
                    passkey: '',
                }}
            >
                {({ handleSubmit, handleChange,touched, values, isSubmitting, errors }) => (
                    <Form noValidate onSubmit={handleSubmit} className='w-100'>

                        <Form.Label className="mb-5 h4">Frame & Associates LMS Sign In</Form.Label>

                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                name="username"
                                onChange={handleChange}
                                value={values.username}
                                type="text" placeholder="Enter username"
                                isInvalid={touched.username && !!errors.username}
                            />
                            {touched.username && (<Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>)}
                        </Form.Group>

                        <Form.Group
                            className="mb-5"
                            controlId="passkey"
                        >
                            <Form.Label>Passkey</Form.Label>
                            <Form.Control
                                name="passkey"
                                onChange={handleChange}
                                value={values.passkey}
                                type="password" 
                                placeholder="Enter passkey"
                                isInvalid={touched.passkey && !!errors.passkey}
                            />
                            {touched.passkey && (<Form.Control.Feedback type="invalid">
                                {errors.passkey}
                            </Form.Control.Feedback>)}
                        </Form.Group>

                        <Button className="btn-primary w-100 mt-5" type="submit" disabled={isSubmitting}>Login</Button>
                        {pageState.pageError && (
                            <Alert key="pageError" variant="danger mt-3">
                                {pageState.pageError}
                            </Alert>
                        )}
                    </Form> 
                )}

            </Formik>
        </>
    );
}