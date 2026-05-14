import React, { useState, useEffect, useRef } from 'react';
import { FaEnvelope, FaEdit, FaTimes } from 'react-icons/fa';
import './OTPModal.css';

const OTPModal = ({
    email,
    parentName,
    onVerified,
    onClose,
    onChangeEmail
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [canResend, setCanResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(30); // 30 seconds
    const [otpSent, setOtpSent] = useState(false);
    const hasSentOTP = useRef(false); // Use ref to persist across renders

    // Send OTP on mount - only once using ref
    useEffect(() => {
        if (!hasSentOTP.current) {
            hasSentOTP.current = true;
            sendOTP();
        }
    }, []);

    // Timer for OTP expiry
    useEffect(() => {
        if (timeLeft > 0 && sessionId) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setError('OTP expired. Please request a new one.');
        }
    }, [timeLeft, sessionId]);

    // Timer for resend button
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const sendOTP = async () => {
        // Prevent duplicate calls
        if (loading || (sessionId && timeLeft > 0)) {
            console.log('OTP already being sent or session active');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            console.log('Sending OTP to:', email);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/otp/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, parentName })
            });

            const data = await response.json();
            console.log('OTP Response:', data);

            if (data.success) {
                setSessionId(data.sessionId);
                setTimeLeft(300);
                setOtpSent(true);
                setSuccess('OTP sent to your email!');
                console.log('Session ID set:', data.sessionId);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('OTP Send Error:', err);
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take last digit
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-input-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`)?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('');
        while (newOtp.length < 6) newOtp.push('');
        setOtp(newOtp);

        // Focus last input
        document.getElementById(`otp-input-5`)?.focus();
    };

    const verifyOTP = async () => {
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter complete OTP');
            return;
        }

        if (!sessionId) {
            setError('Session not found. Please request a new OTP.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Verifying OTP with session:', sessionId);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/otp/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, otp: otpValue })
            });

            const data = await response.json();
            console.log('Verify Response:', data);

            if (data.success) {
                setSuccess('Email verified successfully!');
                setTimeout(() => {
                    onVerified(sessionId);
                }, 1000);
            } else {
                setError(data.message);
                setOtp(['', '', '', '', '', '']);
                document.getElementById('otp-input-0')?.focus();
            }
        } catch (err) {
            console.error('Verify Error:', err);
            setError('Failed to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/otp/resend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, parentName })
            });

            const data = await response.json();

            if (data.success) {
                setTimeLeft(300);
                setCanResend(false);
                setResendTimer(30);
                setSuccess('New OTP sent to your email!');
                setOtp(['', '', '', '', '', '']);
                document.getElementById('otp-input-0')?.focus();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message);
                if (data.waitTime) {
                    setResendTimer(data.waitTime);
                    setCanResend(false);
                }
            }
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="otp-modal-overlay">
            <div className="otp-modal">
                <button className="otp-modal-close" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="otp-modal-header">
                    <div className="otp-icon">
                        <FaEnvelope />
                    </div>
                    <h2>Verify Your Email</h2>
                    <p>We've sent a 6-digit OTP to</p>
                    <div className="email-display">
                        <strong>{email}</strong>
                        <button
                            className="change-email-btn"
                            onClick={onChangeEmail}
                            title="Change Email"
                        >
                            <FaEdit />
                        </button>
                    </div>
                </div>

                <div className="otp-modal-body">
                    <div className="otp-inputs" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-input-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                disabled={loading || !sessionId}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    {error && <div className="otp-error">{error}</div>}
                    {success && <div className="otp-success">{success}</div>}

                    <div className="otp-timer">
                        {timeLeft > 0 ? (
                            <span>Time remaining: <strong>{formatTime(timeLeft)}</strong></span>
                        ) : (
                            <span className="expired">OTP Expired</span>
                        )}
                    </div>

                    <button
                        className="btn btn-primary otp-verify-btn"
                        onClick={verifyOTP}
                        disabled={loading || otp.join('').length !== 6 || timeLeft === 0}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <div className="otp-resend">
                        <p>Didn't receive the code?</p>
                        <button
                            className="resend-btn"
                            onClick={handleResend}
                            disabled={!canResend || loading}
                        >
                            {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPModal;
