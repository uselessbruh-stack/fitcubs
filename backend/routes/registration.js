const express = require('express');
const router = express.Router();
const { saveRegistration, getRegistrationById } = require('../services/databaseService');
const { initiatePayment } = require('../services/paymentService');
const otpService = require('../services/otpService');

// Category pricing
const categoryPricing = {
    '1.5 - 2 Years (With Parents) - 60 MTR (Walk)': 599,
    '2 - 3 Years (With Parents) - 100 MTR (Walk/Run)': 599,
    '3 - 5 Years (With Parents) - 100 MTR (Walk/Run)': 699,
    '5 - 7 Years (Solo) - 200 MTR (Run)': 699,
    '7 - 10 Years (Solo) - 400 MTR (Run)': 699,
    '10 - 13 Years (Open Run) - 800 MTR': 699,
    '13 - 15 Years (Open Run) - 1 KM': 799
};

const BREAKFAST_ADDON = 99;

// Calculate convenience fee to cover Razorpay's 2.5% charges
// Formula: We want to receive exactly 'subtotal' after Razorpay deducts 2.5%
// If we charge 'totalAmount' and Razorpay takes 2.5%, we receive totalAmount * 0.975
// So: subtotal = totalAmount * 0.975
// Therefore: totalAmount = subtotal / 0.975
// And: convenienceFee = totalAmount - subtotal
const calculateConvenienceFee = (subtotal) => {
    const totalWithFee = subtotal / 0.975; // Amount to charge so we receive 'subtotal' after 2.5% deduction
    const convenienceFee = totalWithFee - subtotal;
    return parseFloat(convenienceFee.toFixed(2)); // Round to 2 decimal places
};

// Register participant
router.post('/register', async (req, res) => {
    try {
        const {
            childName,
            gender,
            age,
            dateOfBirth,
            parentName,
            parentContact,
            parentEmail,
            schoolName,
            schoolArea,
            medicalConditions,
            category,
            tshirtSize,
            breakfastCount,
            otpSessionId // Add OTP session ID
        } = req.body;

        // Validate required fields
        if (!childName || !gender || !parentName || !parentContact || !parentEmail || !category || !tshirtSize) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Verify OTP session
        if (!otpSessionId) {
            return res.status(400).json({
                success: false,
                message: 'Email verification required. Please verify your email first.'
            });
        }

        // Check if email is verified
        if (!otpService.isEmailVerified(otpSessionId)) {
            return res.status(400).json({
                success: false,
                message: 'Email not verified. Please verify your email before proceeding.'
            });
        }

        // Verify email matches the session
        const session = otpService.getSession(otpSessionId);
        if (!session || session.email !== parentEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email verification mismatch. Please verify the correct email.'
            });
        }

        // Calculate total amount
        const baseAmount = categoryPricing[category];
        if (!baseAmount) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category selected'
            });
        }

        const breakfastAmount = (breakfastCount || 0) * BREAKFAST_ADDON;
        const subtotal = baseAmount + breakfastAmount; // This is what we want to receive
        const convenienceFee = calculateConvenienceFee(subtotal); // Fee to cover Razorpay's 2.5%
        const totalAmount = subtotal + convenienceFee; // Total amount to charge customer

        console.log('Payment calculation:', {
            baseAmount,
            breakfastAmount,
            subtotal,
            convenienceFee,
            totalAmount,
            expectedAfterRazorpay: (totalAmount * 0.975).toFixed(2)
        });

        // Prepare registration data
        const registrationData = {
            childName,
            gender,
            age,
            dateOfBirth,
            parentName,
            parentContact,
            parentEmail,
            schoolName,
            schoolArea: schoolArea || '',
            medicalConditions: medicalConditions || 'None',
            category,
            tshirtSize,
            breakfastCount: breakfastCount || 0,
            baseAmount,
            breakfastAmount,
            convenienceFee,
            totalAmount,
            paymentStatus: 'pending'
        };

        // Save to database
        const registrationId = await saveRegistration(registrationData);

        // Initiate payment - Create Razorpay order
        const paymentResponse = await initiatePayment(registrationId, totalAmount, {
            parentContact,
            parentEmail,
            parentName,
            childName
        });

        res.json({
            success: true,
            message: 'Registration initiated successfully',
            registrationId,
            orderId: paymentResponse.orderId,
            amount: paymentResponse.amount,
            currency: paymentResponse.currency,
            keyId: paymentResponse.keyId
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: error.message
        });
    }
});

// Get registration details
router.get('/:id', async (req, res) => {
    try {
        const registration = await getRegistrationById(req.params.id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.json({
            success: true,
            data: registration
        });
    } catch (error) {
        console.error('Error fetching registration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registration',
            error: error.message
        });
    }
});

module.exports = router;
