import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaTimesCircle, FaHome, FaRedo } from 'react-icons/fa';
import './PaymentSuccess.css';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const registrationId = searchParams.get('registrationId');
    const error = searchParams.get('error');

    return (
        <div className="payment-page">
            <div className="container">
                <div className="payment-card failed-card">
                    <div className="success-icon-wrapper">
                        <FaTimesCircle className="failed-icon" />
                    </div>

                    <h1>Payment Failed</h1>
                    <p className="error-message">
                        We're sorry, but your payment could not be processed.
                        Your registration was not completed.
                    </p>

                    <div className="error-box">
                        <h3>What Happened?</h3>
                        <p>
                            The payment transaction failed or was cancelled. This could be due to:
                        </p>
                        <ul style={{ textAlign: 'left', marginTop: '15px', paddingLeft: '20px' }}>
                            <li>Payment was cancelled by you</li>
                            <li>Insufficient funds in your account</li>
                            <li>Bank declined the transaction</li>
                            <li>Technical issue with the payment gateway</li>
                        </ul>
                    </div>

                    {registrationId && (
                        <div className="registration-details">
                            <h3>Reference Details</h3>
                            <div className="detail-row">
                                <span className="detail-label">Registration ID:</span>
                                <span className="detail-value">{registrationId}</span>
                            </div>
                        </div>
                    )}

                    <div className="info-box">
                        <h3>💳 About Your Payment</h3>
                        <p>
                            If any amount was deducted from your account, it will be automatically
                            refunded within 5-7 business days. Please contact your bank if you don't
                            receive the refund within this period.
                        </p>
                    </div>

                    <div className="next-steps">
                        <h3>What Should You Do?</h3>
                        <ul>
                            <li>✓ Try registering again with a different payment method</li>
                            <li>✓ Check your account balance before attempting payment</li>
                            <li>✓ Contact your bank if the issue persists</li>
                            <li>✓ Reach out to us if you need assistance</li>
                        </ul>
                    </div>

                    <div className="action-buttons">
                        <Link to="/register" className="btn btn-primary">
                            <FaRedo /> Try Again
                        </Link>
                        <Link to="/" className="btn btn-secondary">
                            <FaHome /> Back to Home
                        </Link>
                    </div>

                    <div className="support-info">
                        <p>
                            Need help? Contact us at <a href="mailto:thefitcubs@gmail.com">thefitcubs@gmail.com</a>
                        </p>
                        <p style={{ marginTop: '10px' }}>
                            We're here to assist you with any registration or payment issues.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
