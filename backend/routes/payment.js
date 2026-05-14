const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { updatePaymentStatus, getRegistrationById } = require('../services/databaseService');
const { verifyPaymentSignature, getPaymentDetails, checkPaymentStatus } = require('../services/paymentService');
const { sendRegistrationEmail } = require('../services/emailService');
const qrCodeService = require('../services/qrCodeService');

// Razorpay payment verification handler
router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !registrationId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required payment parameters'
            });
        }

        // Verify payment signature
        const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            console.error('Invalid payment signature');
            await updatePaymentStatus(registrationId, {
                status: 'FAILED',
                transactionId: razorpay_payment_id,
                orderId: razorpay_order_id,
                response: { error: 'Invalid signature' }
            });

            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Get payment details from Razorpay
        const paymentDetails = await getPaymentDetails(razorpay_payment_id);

        // Update payment status in database
        await updatePaymentStatus(registrationId, {
            status: 'SUCCESS',
            transactionId: razorpay_payment_id,
            orderId: razorpay_order_id,
            response: paymentDetails
        });

        // Get complete registration details
        const registration = await getRegistrationById(registrationId);

        if (registration) {
            // Generate QR code for the registration
            let qrCodeBase64 = null;
            try {
                qrCodeBase64 = await qrCodeService.generateQRCodeBase64(
                    registrationId,
                    registration.childName,
                    registration.parentEmail
                );

            } catch (qrError) {
                console.error('QR code generation failed:', qrError);
            }

            // Send email notification with QR code
            try {
                await sendRegistrationEmail({
                    ...registration,
                    registrationId,
                    transactionId: razorpay_payment_id
                }, 'SUCCESS', qrCodeBase64);

                console.log('✅ Email sent to:', registration.parentEmail);
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
        }

        res.json({
            success: true,
            message: 'Payment verified successfully',
            transactionId: razorpay_payment_id
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
});

// Check payment status endpoint
router.get('/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const statusResponse = await checkPaymentStatus(orderId);

        res.json({
            success: true,
            data: statusResponse
        });
    } catch (error) {
        console.error('Payment status check error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check payment status',
            error: error.message
        });
    }
});

// Test endpoint to simulate successful payment (development only)
if (process.env.NODE_ENV === 'development') {
    router.get('/test-success/:registrationId', async (req, res) => {
        try {
            const { registrationId } = req.params;
            const transactionId = `TEST_${Date.now()}`;

            console.log('Test payment success triggered for:', registrationId);

            // Update payment status in database
            await updatePaymentStatus(registrationId, {
                status: 'SUCCESS',
                transactionId: transactionId,
                response: { test: true, code: 'PAYMENT_SUCCESS' }
            });

            // Get complete registration details
            const registration = await getRegistrationById(registrationId);

            if (registration) {
                // Generate QR code for the registration
                let qrCodeBase64 = null;
                try {
                    console.log('Generating QR code for test payment');
                    qrCodeBase64 = await qrCodeService.generateQRCodeBase64(
                        registrationId,
                        registration.childName,
                        registration.parentEmail
                    );
                    console.log('Test QR code generated, length:', qrCodeBase64?.length);
                } catch (qrError) {
                    console.error('Test QR code generation failed:', qrError);
                }

                // Send email notification with QR code
                try {
                    await sendRegistrationEmail({
                        ...registration,
                        transactionId
                    }, 'SUCCESS', qrCodeBase64);
                    console.log('Test email sent successfully with QR code');
                } catch (emailError) {
                    console.error('Test email sending failed:', emailError);
                }
            }

            // Redirect to success page
            res.redirect(`${process.env.FRONTEND_URL}/payment-success?registrationId=${registrationId}&transactionId=${transactionId}`);
        } catch (error) {
            console.error('Test payment error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
}

module.exports = router;
