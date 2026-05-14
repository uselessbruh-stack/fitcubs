const express = require('express');
const router = express.Router();
const otpService = require('../services/otpService');
const { sendOTPEmail } = require('../services/emailService');

// Send OTP to email
router.post('/send', async (req, res) => {
    try {
        const { email, parentName } = req.body;
        
        console.log('=== OTP SEND REQUEST ===');
        console.log('Email:', email);
        console.log('Parent Name:', parentName);

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Generate OTP
        const otp = otpService.generateOTP();
        console.log('Generated OTP:', otp);

        // Create session
        const sessionId = otpService.createSession(email, otp);
        console.log('Session created:', sessionId);

        // Send OTP email
        try {
            await sendOTPEmail(email, otp, parentName);
            console.log('OTP email sent successfully');
        } catch (emailError) {
            // Clear session if email fails
            otpService.clearSession(sessionId);
            console.error('Failed to send OTP email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
            });
        }

        console.log('=== OTP SEND SUCCESS ===');
        res.json({
            success: true,
            message: 'OTP sent successfully to your email',
            sessionId,
            expiresIn: 300 // 5 minutes in seconds
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please try again.'
        });
    }
});

// Verify OTP
router.post('/verify', async (req, res) => {
    try {
        const { sessionId, otp } = req.body;
        
        console.log('=== OTP VERIFY REQUEST ===');
        console.log('Session ID:', sessionId);
        console.log('OTP:', otp);

        if (!sessionId || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Session ID and OTP are required'
            });
        }

        const result = otpService.verifyOTP(sessionId, otp);
        console.log('Verify result:', result);

        if (result.success) {
            console.log('=== OTP VERIFY SUCCESS ===');
            res.json({
                success: true,
                message: result.message
            });
        } else {
            console.log('=== OTP VERIFY FAILED ===');
            res.status(400).json({
                success: false,
                message: result.message,
                attemptsLeft: result.attemptsLeft
            });
        }

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP. Please try again.'
        });
    }
});

// Resend OTP
router.post('/resend', async (req, res) => {
    try {
        const { sessionId, parentName } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        // Check if can resend
        const canResendCheck = otpService.canResend(sessionId);
        
        if (!canResendCheck.canResend) {
            return res.status(400).json({
                success: false,
                message: canResendCheck.message,
                waitTime: canResendCheck.waitTime
            });
        }

        // Resend OTP
        const result = otpService.resendOTP(sessionId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Session not found or expired'
            });
        }

        // Send new OTP email
        try {
            await sendOTPEmail(result.session.email, result.otp, parentName);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
            });
        }

        res.json({
            success: true,
            message: 'New OTP sent successfully',
            expiresIn: 300 // 5 minutes in seconds
        });

    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend OTP. Please try again.'
        });
    }
});

// Change email - clears old session and sends new OTP
router.post('/change-email', async (req, res) => {
    try {
        const { oldSessionId, newEmail, parentName } = req.body;

        if (!oldSessionId || !newEmail) {
            return res.status(400).json({
                success: false,
                message: 'Session ID and new email are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Clear old session (garbage disposal)
        otpService.clearSession(oldSessionId);

        // Clear any existing sessions for the new email
        otpService.clearSessionByEmail(newEmail);

        // Generate new OTP
        const otp = otpService.generateOTP();

        // Create new session
        const newSessionId = otpService.createSession(newEmail, otp);

        // Send OTP to new email
        try {
            await sendOTPEmail(newEmail, otp, parentName);
        } catch (emailError) {
            // Clear session if email fails
            otpService.clearSession(newSessionId);
            console.error('Failed to send OTP email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
            });
        }

        res.json({
            success: true,
            message: 'OTP sent to new email address',
            sessionId: newSessionId,
            expiresIn: 300
        });

    } catch (error) {
        console.error('Error changing email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change email. Please try again.'
        });
    }
});

// Get session info
router.get('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        const sessionInfo = otpService.getSessionInfo(sessionId);

        if (!sessionInfo) {
            return res.status(404).json({
                success: false,
                message: 'Session not found or expired'
            });
        }

        res.json({
            success: true,
            session: sessionInfo
        });

    } catch (error) {
        console.error('Error getting session info:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get session info'
        });
    }
});

module.exports = router;
