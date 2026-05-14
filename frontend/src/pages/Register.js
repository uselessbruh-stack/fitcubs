import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import OTPModal from '../components/OTPModal';
import './Register.css';

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [verifyingPayment, setVerifyingPayment] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpSessionId, setOtpSessionId] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [formData, setFormData] = useState({
        childName: '',
        gender: '',
        age: '',
        dateOfBirth: '',
        parentName: '',
        parentContact: '',
        parentEmail: '',
        schoolName: '',
        schoolArea: '',
        medicalConditions: '',
        category: '',
        tshirtSize: '',
        breakfastCount: 0
    });

    const categories = [
        '1.5 - 2 Years (With Parents) - 60 MTR (Walk)',
        '2 - 3 Years (With Parents) - 100 MTR (Walk/Run)',
        '3 - 5 Years (With Parents) - 100 MTR (Walk/Run)',
        '5 - 7 Years (Solo) - 200 MTR (Run)',
        '7 - 10 Years (Solo) - 400 MTR (Run)',
        '10 - 13 Years (Open Run) - 800 MTR',
        '13 - 15 Years (Open Run) - 1 KM'
    ];

    // Sold out categories
    const soldOutCategories = [
        '1.5 - 2 Years (With Parents) - 60 MTR (Walk)',
        '10 - 13 Years (Open Run) - 800 MTR',
        '13 - 15 Years (Open Run) - 1 KM'
    ];

    const categoryPricing = {
        '1.5 - 2 Years (With Parents) - 60 MTR (Walk)': 599,
        '2 - 3 Years (With Parents) - 100 MTR (Walk/Run)': 599,
        '3 - 5 Years (With Parents) - 100 MTR (Walk/Run)': 699,
        '5 - 7 Years (Solo) - 200 MTR (Run)': 699,
        '7 - 10 Years (Solo) - 400 MTR (Run)': 699,
        '10 - 13 Years (Open Run) - 800 MTR': 699,
        '13 - 15 Years (Open Run) - 1 KM': 799
    };

    // Calculate convenience fee to cover Razorpay's 2.5% charges
    // Formula: totalWithFee = subtotal / 0.975
    const calculateConvenienceFee = (subtotal) => {
        const totalWithFee = subtotal / 0.975;
        const convenienceFee = totalWithFee - subtotal;
        return parseFloat(convenienceFee.toFixed(2));
    };

    const BREAKFAST_ADDON = 99;

    const categoryTimings = {
        '1.5 - 2 Years (With Parents) - 60 MTR (Walk)': { report: '8:00 AM', flagOff: '8:30 AM' },
        '2 - 3 Years (With Parents) - 100 MTR (Walk/Run)': { report: '8:00 AM', flagOff: '8:30 AM' },
        '3 - 5 Years (With Parents) - 100 MTR (Walk/Run)': { report: '8:00 AM', flagOff: '8:30 AM' },
        '5 - 7 Years (Solo) - 200 MTR (Run)': { report: '8:00 AM', flagOff: '8:30 AM' },
        '7 - 10 Years (Solo) - 400 MTR (Run)': { report: '8:00 AM', flagOff: '8:30 AM' },
        '10 - 13 Years (Open Run) - 800 MTR': { report: '8:00 AM', flagOff: '8:30 AM' },
        '13 - 15 Years (Open Run) - 1 KM': { report: '8:00 AM', flagOff: '8:30 AM' }
    };

    const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL'];

    // Pre-select category from URL parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');

        if (categoryParam) {
            // Normalize the category parameter by removing extra spaces
            const normalized = categoryParam.replace(/\s*-\s*/g, '-').trim();

            // Find matching category in the list
            const matchingCategory = categories.find(cat => {
                const catNormalized = cat.replace(/\s*-\s*/g, '-').trim();
                return catNormalized.startsWith(normalized) || cat.includes(categoryParam);
            });

            if (matchingCategory) {
                setFormData(prev => ({
                    ...prev,
                    category: matchingCategory
                }));
            }
        }
    }, [location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Calculate age automatically when date of birth changes
        if (name === 'dateOfBirth') {
            const birthDate = new Date(value);
            const today = new Date();

            // Calculate age in years with decimal precision
            let ageYears = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            // Adjust age if birthday hasn't occurred this year
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                ageYears--;
            }

            // Calculate months for more precise age
            const ageMonths = monthDiff < 0 ? 12 + monthDiff : monthDiff;
            const ageDecimal = ageYears + (ageMonths / 12);

            // Check if age is below 1.48 years (approximately 1 year 6 months)
            if (ageDecimal < 1.48) {
                toast.error('Child must be at least 1.5 years old to participate in the marathon.', {
                    position: "top-center",
                    autoClose: 4000
                });
                setFormData(prev => ({
                    ...prev,
                    dateOfBirth: '',
                    age: ''
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                [name]: value,
                age: ageYears.toString()
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle phone number input - only allow digits and max 10 characters
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length <= 10) {
            setFormData(prev => ({
                ...prev,
                parentContact: value
            }));
        }
    };

    const calculateTotal = () => {
        const baseAmount = formData.category ? categoryPricing[formData.category] : 0;
        const breakfastAmount = formData.breakfastCount * 99;
        const subtotal = baseAmount + breakfastAmount;

        // Add convenience fee calculated dynamically on subtotal
        const convenienceFee = subtotal > 0 ? calculateConvenienceFee(subtotal) : 0;

        return subtotal + convenienceFee;
    };

    const getConvenienceFee = () => {
        const baseAmount = formData.category ? categoryPricing[formData.category] : 0;
        const breakfastAmount = formData.breakfastCount * 99;
        const subtotal = baseAmount + breakfastAmount;
        return subtotal > 0 ? calculateConvenienceFee(subtotal) : 0;
    };

    const getSubtotal = () => {
        const baseAmount = formData.category ? categoryPricing[formData.category] : 0;
        const breakfastAmount = formData.breakfastCount * 99;
        return baseAmount + breakfastAmount;
    };

    const handleOTPVerified = (sessionId) => {
        setOtpSessionId(sessionId);
        setEmailVerified(true);
        setShowOTPModal(false);
        toast.success('Email verified successfully!', {
            position: "top-center"
        });
    };

    const handleChangeEmail = async () => {
        // Clear email verification
        setEmailVerified(false);
        setShowOTPModal(false);

        if (otpSessionId) {
            // Clear old session on backend
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/otp/change-email`, {
                    oldSessionId: otpSessionId,
                    newEmail: formData.parentEmail,
                    parentName: formData.parentName
                });
            } catch (error) {
                console.error('Error clearing old session:', error);
            }
        }

        setOtpSessionId(null);
        toast.info('Please enter new email and verify again', {
            position: "top-center"
        });
    };

    const handleEmailChange = (e) => {
        // Reset email verification if email changes
        if (emailVerified && e.target.value !== formData.parentEmail) {
            setEmailVerified(false);
            setOtpSessionId(null);
        }
        handleChange(e);
    };

    const initiateEmailVerification = () => {
        if (!formData.parentEmail) {
            toast.error('Please enter your email address', {
                position: "top-center"
            });
            return;
        }

        if (!formData.parentName) {
            toast.error('Please enter parent name first', {
                position: "top-center"
            });
            return;
        }

        setShowOTPModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Comprehensive form validation with specific toast messages
        if (!formData.childName || formData.childName.trim() === '') {
            toast.error('Please enter child\'s name', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        if (!formData.gender) {
            toast.error('Please select child\'s gender', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        if (!formData.age) {
            toast.error('Please enter child\'s age', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        if (!formData.dateOfBirth) {
            toast.error('Please enter child\'s date of birth', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        if (!formData.parentName || formData.parentName.trim() === '') {
            toast.error('Please enter parent/guardian name', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        if (!formData.parentContact || formData.parentContact.trim() === '') {
            toast.error('Please enter parent contact number', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        // Validate phone number - must be exactly 10 digits
        if (formData.parentContact.length !== 10 || !/^\d{10}$/.test(formData.parentContact)) {
            toast.error('Contact number must be exactly 10 digits', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        if (!formData.parentEmail || formData.parentEmail.trim() === '') {
            toast.error('Please enter parent email address', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        if (!formData.schoolName || formData.schoolName.trim() === '') {
            toast.error('Please enter school name', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        if (!formData.schoolArea || formData.schoolArea.trim() === '') {
            toast.error('Please enter school area/locality', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        if (!formData.category) {
            toast.error('Please select a race category', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        if (!formData.tshirtSize) {
            toast.error('Please select kid\'s t-shirt size', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        // Check if email is verified
        if (!emailVerified || !otpSessionId) {
            toast.error('Please verify your email before proceeding to payment', {
                position: "top-center",
                autoClose: 4000
            });
            initiateEmailVerification();
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/registration/register`,
                {
                    ...formData,
                    otpSessionId
                }
            );

            if (response.data.success) {
                const { orderId, amount, currency, keyId, registrationId } = response.data;

                // Initialize Razorpay checkout
                const options = {
                    key: keyId,
                    amount: amount,
                    currency: currency,
                    name: 'The Fit Cubs',
                    description: 'Kids Mini Marathon 2025 Registration',
                    order_id: orderId,
                    handler: async function (response) {
                        try {
                            // Show verifying state
                            setVerifyingPayment(true);

                            // Verify payment on backend
                            const verifyResponse = await axios.post(
                                `${process.env.REACT_APP_API_URL}/payment/verify`,
                                {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    registrationId: registrationId
                                }
                            );

                            if (verifyResponse.data.success) {
                                // Use React Router navigate instead of window.location
                                navigate(`/payment-success?registrationId=${registrationId}&transactionId=${response.razorpay_payment_id}`, { replace: true });
                            }
                        } catch (error) {
                            console.error('Payment verification error:', error);
                            setVerifyingPayment(false);
                            toast.error('Payment verification failed. Please contact support.', {
                                position: "top-center"
                            });
                            navigate(`/payment-failed?registrationId=${registrationId}`, { replace: true });
                        }
                    },
                    prefill: {
                        name: formData.parentName,
                        email: formData.parentEmail,
                        contact: formData.parentContact
                    },
                    theme: {
                        color: '#35AEBF'
                    },
                    modal: {
                        ondismiss: function () {
                            setLoading(false);
                            toast.warning('Payment cancelled. Please try again.', {
                                position: "top-center"
                            });
                        }
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
                setLoading(false);
            } else {
                toast.error('Registration failed. Please try again.', {
                    position: "top-center"
                });
                setLoading(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.', {
                position: "top-center"
            });
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            {showOTPModal && (
                <OTPModal
                    email={formData.parentEmail}
                    parentName={formData.parentName}
                    onVerified={handleOTPVerified}
                    onClose={() => setShowOTPModal(false)}
                    onChangeEmail={handleChangeEmail}
                />
            )}

            {verifyingPayment && (
                <div className="verification-overlay">
                    <div className="verification-content">
                        <div className="spinner"></div>
                        <h3>Verifying Payment...</h3>
                        <p>Please wait while we confirm your payment</p>
                    </div>
                </div>
            )}

            <div className="container">
                <div className="register-header">
                    <h1>Register for Kids Mini Marathon 2025</h1>
                    <p>Fill in the details below to register your child</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    {/* Child Details */}
                    <div className="form-section">
                        <h2>Child Details</h2>

                        <div className="form-group">
                            <label htmlFor="childName">Child's Full Name *</label>
                            <input
                                type="text"
                                id="childName"
                                name="childName"
                                value={formData.childName}
                                onChange={handleChange}

                                placeholder="Enter child's full name"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="gender">Gender *</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}

                                >
                                    <option value="">Select Gender</option>
                                    <option value="Boy">Boy</option>
                                    <option value="Girl">Girl</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Date of Birth *</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}

                                />
                            </div>
                        </div>

                        {formData.age && (
                            <div className="form-group">
                                <label>Age</label>
                                <div className="age-display">{formData.age} years old</div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="schoolName">School Name *</label>
                            <input
                                type="text"
                                id="schoolName"
                                name="schoolName"
                                value={formData.schoolName}
                                onChange={handleChange}

                                placeholder="Enter school name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="schoolArea">School Area/Locality *</label>
                            <input
                                type="text"
                                id="schoolArea"
                                name="schoolArea"
                                value={formData.schoolArea}
                                onChange={handleChange}

                                placeholder="e.g., JP Nagar, Koramangala, Indiranagar"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="medicalConditions">Medical Conditions (if any)</label>
                            <textarea
                                id="medicalConditions"
                                name="medicalConditions"
                                value={formData.medicalConditions}
                                onChange={handleChange}
                                placeholder="Please mention any medical conditions or allergies"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Parent Details */}
                    <div className="form-section">
                        <h2>Parent/Guardian Details</h2>

                        <div className="form-group">
                            <label htmlFor="parentName">Parent's Name *</label>
                            <input
                                type="text"
                                id="parentName"
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleChange}

                                placeholder="Enter parent's full name"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="parentContact">Contact Number *</label>
                                <input
                                    type="tel"
                                    id="parentContact"
                                    name="parentContact"
                                    value={formData.parentContact}
                                    onChange={handlePhoneChange}
                                    placeholder="10-digit mobile number"
                                    maxLength="10"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="parentEmail">Email Address *</label>
                                <div className="email-verification-group">
                                    <input
                                        type="email"
                                        id="parentEmail"
                                        name="parentEmail"
                                        value={formData.parentEmail}
                                        onChange={handleEmailChange}

                                        placeholder="your.email@example.com"
                                        disabled={emailVerified}
                                    />
                                    {emailVerified ? (
                                        <button
                                            type="button"
                                            className="btn-email-status verified"
                                            onClick={handleChangeEmail}
                                        >
                                            ✓ Verified
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn-email-verify"
                                            onClick={initiateEmailVerification}
                                            disabled={!formData.parentEmail || !formData.parentName}
                                        >
                                            Verify Email
                                        </button>
                                    )}
                                </div>
                                {emailVerified && (
                                    <small className="email-verified-note">
                                        ✓ Email verified. Click "Verified" button to change email.
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="form-section">
                        <h2>Event Details</h2>

                        <div className="form-group">
                            <label htmlFor="category">Select Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}

                            >
                                <option value="">Select Category</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat} disabled={soldOutCategories.includes(cat)}>
                                        {cat} - ₹{categoryPricing[cat]} | Flag-off: {categoryTimings[cat].flagOff}
                                        {soldOutCategories.includes(cat) ? ' - SOLD OUT' : ''}
                                    </option>
                                ))}
                            </select>
                            {formData.category && (
                                <div style={{
                                    marginTop: '10px',
                                    padding: '12px',
                                    background: '#fff3cd',
                                    borderLeft: '4px solid #ffc107',
                                    borderRadius: '4px'
                                }}>
                                    <strong style={{ color: '#856404' }}>⏰ Your Race Timing:</strong><br />
                                    <span style={{ fontSize: '14px', color: '#666' }}>
                                        <strong>Reporting Time:</strong> {categoryTimings[formData.category].report} |
                                        <strong> Flag-off:</strong> {categoryTimings[formData.category].flagOff}
                                        <br />
                                        <small>Please arrive 30 minutes before flag-off for registration check-in</small>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="tshirtSize">Kid's T-shirt Size *</label>
                            <select
                                id="tshirtSize"
                                name="tshirtSize"
                                value={formData.tshirtSize}
                                onChange={handleChange}

                            >
                                <option value="">Select Size</option>
                                {tshirtSizes.map((size, index) => (
                                    <option key={index} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="breakfastCount">Add-on: Breakfast (₹99 per person)</label>
                            <input
                                type="number"
                                id="breakfastCount"
                                name="breakfastCount"
                                value={formData.breakfastCount}
                                onChange={handleChange}
                                min="0"
                                max="10"
                                placeholder="Number of breakfast meals"
                            />
                            <small>For parents and siblings attending the event</small>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    {formData.category && (
                        <div className="payment-summary">
                            <h3>Payment Summary</h3>
                            <div className="summary-row">
                                <span>Registration Fee:</span>
                                <span>₹{categoryPricing[formData.category]}</span>
                            </div>
                            {formData.breakfastCount > 0 && (
                                <div className="summary-row">
                                    <span>Breakfast ({formData.breakfastCount} × ₹99):</span>
                                    <span>₹{formData.breakfastCount * 99}</span>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>₹{getSubtotal()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Convenience Fee:</span>
                                <span>₹{getConvenienceFee().toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total Amount:</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    {/* Includes Info */}
                    <div className="includes-box">
                        <h4>What's Included:</h4>
                        <ul>
                            <li>✅ Marathon T-shirt</li>
                            <li>✅ Medal for all participants</li>
                            <li>✅ Participation Certificate</li>
                            <li>✅ Snack Box</li>
                            <li>✅ Fresh Juice & Water</li>
                            <li>✅ Bibs</li>
                            <li>💰 Cash Prizes for Winners</li>
                            <li>🏆 Trophies for 1st, 2nd, 3rd Place</li>
                        </ul>
                    </div>

                    <button type="submit" className="btn btn-primary btn-large submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
