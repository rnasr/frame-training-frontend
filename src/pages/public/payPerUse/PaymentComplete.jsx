import React, { useState, useEffect } from 'react';
import { Row, Col, Table, ListGroup, Alert, Button } from 'react-bootstrap';
import { payPerUseApi } from '../../../api/payPerUse';
import PayPerUseHeader from './PayPerUseHeader';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

export default function PaymentComplete() {
    
    useEffect(() => {
        sessionStorage.removeItem('registrationData');
    }, []);   

    return (
        <PayPerUseHeader>
            <Row  className="p-5 bg-light border rounded-3 m-5 shadow">
                <Col>
                    <h2 className="mb-4">Order Confirmation</h2>
                    
                    <h4 className="mb-3">How to Access Course</h4>
                    <p>
                        Please check your inbox for an email with instructions on how to access the course. 
                        If you have any trouble accessing the course, please contact{' '}
                        <a href="mailto:support@frameassociates.com">support@frameassociates.com</a>.
                    </p>
                    
                    <h4 className="mt-4 mb-3">Participant Completion Results</h4>
                    
                    <p><strong>If You Are Taking the Course</strong></p>
                    <p>
                        When you finish the course, you may be asked to complete a quiz called Assess Your
                        Knowledge. Only some courses have this. For courses with an assessment, you must
                        score 80% or higher to successfully complete the course.
                    </p>
                    <p>
                        For all courses, an email will be sent to you to confirm completion. You will also have
                        the option to print a certificate.
                    </p>

                    <p><strong>If You Purchased Credits for Multiple Participants</strong></p>
                    <p>
                        There are no time limits on the course credits. Course credits do not expire until each
                        participant has completed the course.
                    </p>
                </Col>
            </Row>
        </PayPerUseHeader>
    );
}