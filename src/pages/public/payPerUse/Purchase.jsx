import React, { useState, useEffect } from 'react';
import { Row, Col, Table, ListGroup, Alert, Button } from 'react-bootstrap';
import { payPerUseApi } from '../../../api/payPerUse';
import PayPerUseHeader from './PayPerUseHeader';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import LoadingBar from '../../../components/LoadingBar';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function Purchase() {
    const [orderDetails, setOrderDetails] = useState(null);
    const [regData, setRegData] = useState(null);
    const navigate = useNavigate();
    const loadPaymentPage = async () => {
        const regDataStr = sessionStorage.getItem('registrationData');
        if (regDataStr) {
            const regData = JSON.parse(regDataStr);
            setRegData(regData);
            const response = await payPerUseApi.getPaymentPageDetails(
                regData.courseQuantities, regData.country
            );
            setOrderDetails(response.result);
        } else {
            navigate('/register');
        }
    };

    useEffect(() => {
        loadPaymentPage();
    }, []);

    const onPaymentCompleted = async () => {
        // Prepare the data to send to complete the order
        const orderCompletionData = {
            firstName: regData.firstName,
            lastName: regData.lastName,
            email: regData.email,
            company: regData.company || null,
            phone: regData.phone || null,
            postalCode: regData.postalCode || null,
            address: regData.address || null,
            city: regData.city || null,
            province: regData.province || null,
            country: regData.country,
            paymentIntentId: orderDetails.paymentIntent.id,
            courseQuantities: regData.courseQuantities                
        };

        // Call the API to complete the order
        await payPerUseApi.completeOrder(orderCompletionData);
        navigate('/register/complete');
        console.log('Order completed successfully');
    };

    return (
        <PayPerUseHeader>
                {orderDetails && regData ? (
            // <Row className="p-5 m-5">
            <Row className="p-5 bg-light border rounded-3 m-5 shadow">
                <h4 className="text-center w-100 border p-2  bg-info text-white">Order Information</h4>
                    <>
                        {/* <h2>Order Items</h2> */}
                        <table className="mb-4 bg-white">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-bottom bg-secondary">Item</th>
                                    <th className="px-4 py-2 text-end border-bottom bg-secondary">Qty</th>
                                    <th className="px-4 py-2 text-end border-bottom bg-secondary">Price</th>
                                    <th className="px-4 py-2 text-start border-bottom bg-secondary">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-4 border-bottom">{item.itemName}</td>
                                        <td className="p-4 text-end border-bottom">{item.quantity}</td>
                                        <td className="p-4 text-end border-bottom">${item.price.toFixed(2)}</td>
                                        <td className="p-4 text-start border-bottom">${item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {orderDetails.taxes?.map((tax, index) => (
                                    <tr>
                                        <td colSpan="3" className="p-4 text-end bg-light"><strong>{tax.taxName}</strong> ({tax.taxPercent * 100}%)</td>
                                        <td className="p-4 text-start bg-light"><strong>${tax.taxAmount.toFixed(2)}</strong></td>
                                    </tr>
                                ))}
                                
                                <tr>
                                    <td colSpan="3" className="px-4 text-end bg-light"><strong>Total</strong></td>
                                    <td className="px-4 text-start bg-light"><strong>${orderDetails.total.toFixed(2)}</strong></td>
                                </tr>
                            </tbody>
                        </table>

                        <h4 className="text-center w-100 border p-2 mt-5 bg-info text-white">Purchaser Information</h4>
                        <ListGroup className="mb-4 bg-light">
                            <ListGroup.Item className="bg-light"><strong>Name:</strong> {`${regData.firstName} ${regData.lastName}`}</ListGroup.Item>
                            <ListGroup.Item><strong>Email:</strong> {regData.email}</ListGroup.Item>
                            <ListGroup.Item><strong>Address:</strong> {`${regData.address}, ${regData.city}, ${regData.province}, ${regData.country}, ${regData.postalCode}`}</ListGroup.Item>
                        </ListGroup>

                        <h4 className="text-center w-100 border p-2 mt-5 bg-info text-white">Payment</h4>
                        <Elements stripe={stripePromise} options={{ clientSecret: orderDetails.paymentIntent.clientSecret }}>
                            <PaymentForm paymentIntent={orderDetails.paymentIntent} onPaymentComplete={onPaymentCompleted} />
                        </Elements>
                    </>
            </Row>
                ) : (
                    <Row className="p-5 bg-white border rounded-3 m-5 shadow text-center">
                        <h5 className="mb-5 fs-6">Creating Order Summary</h5>
                        <LoadingBar/>
                    </Row>
                )}
        </PayPerUseHeader>
    );
}

function PaymentForm({ paymentIntent, onPaymentComplete }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;
        setSubmitting(true);
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message);
            setSuccess(false);
            return;
        }

        const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
        });

        if (error) {
            setError(error.message);
            setSuccess(false);
            setSubmitting(false);
        } else if (confirmedPaymentIntent.status === 'succeeded') {
            setSuccess(true);
            setError(null);
            onPaymentComplete();
        } else {
            setSuccess(false);
            setSubmitting(false);
            setError('Payment failed');
        }
    };

    const paymentElementOptions = {
        layout: 'tabs',
        paymentMethodOrder: ['card']
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {success && <Alert variant="success" className="mt-3">Payment successful!</Alert>}
            <PaymentElement options={paymentElementOptions} />
            <Row className="d-flex justify-content-center mt-3">
            <Button type="submit" className="mt-3 w-50 p-2" variant="primary" disabled={!stripe || submitting}>
                <i class="bi bi-credit-card me-2"></i>
                Pay Now ${paymentIntent.amount / 100}
            </Button>
            </Row>
        </form>
    );
}
