const crypto = require('crypto');

// In-memory storage for OTP sessions
// In production, consider using Redis for better scalability
const otpSessions = new Map();

class OTPService {
    // Generate a 6-digit OTP
    generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }

    // Create OTP session
    createSession(email, otp) {
        const sessionId = crypto.randomUUID();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
        const canResendAt = Date.now() + 30 * 1000; // 30 seconds

        // Clear any existing session for this email
        console.log(`Creating new session for ${email}, clearing old sessions...`);
        this.clearSessionByEmail(email);

        const session = {
            sessionId,
            email,
            otp,
            expiresAt,
            canResendAt,
            verified: false,
            attempts: 0,
            createdAt: Date.now()
        };

        otpSessions.set(sessionId, session);
        console.log(`Session created: ${sessionId} for ${email}, OTP: ${otp}`);
        console.log(`Total active sessions: ${otpSessions.size}`);

        // Set timeout to auto-delete expired session
        const timeout = setTimeout(() => {
            this.clearSession(sessionId);
        }, 5 * 60 * 1000);

        session.timeout = timeout;

        return sessionId;
    }

    // Get session by ID
    getSession(sessionId) {
        return otpSessions.get(sessionId);
    }

    // Find session by email
    findSessionByEmail(email) {
        for (const [sessionId, session] of otpSessions.entries()) {
            if (session.email === email && !session.verified) {
                return { sessionId, ...session };
            }
        }
        return null;
    }

    // Verify OTP
    verifyOTP(sessionId, otp) {
        console.log(`Verifying OTP for session: ${sessionId}, OTP: ${otp}`);
        console.log(`Total active sessions: ${otpSessions.size}`);
        
        const session = otpSessions.get(sessionId);

        if (!session) {
            console.log(`Session not found: ${sessionId}`);
            console.log('Active sessions:', Array.from(otpSessions.keys()));
            return { success: false, message: 'Session not found or expired' };
        }

        console.log(`Session found. Stored OTP: ${session.otp}, Verified: ${session.verified}`);

        if (session.verified) {
            return { success: false, message: 'OTP already verified' };
        }

        if (Date.now() > session.expiresAt) {
            console.log('Session expired');
            this.clearSession(sessionId);
            return { success: false, message: 'OTP expired. Please request a new one' };
        }

        if (session.attempts >= 5) {
            console.log('Too many attempts');
            this.clearSession(sessionId);
            return { success: false, message: 'Too many attempts. Please request a new OTP' };
        }

        session.attempts++;

        if (session.otp !== otp) {
            console.log(`OTP mismatch. Expected: ${session.otp}, Got: ${otp}`);
            return { 
                success: false, 
                message: `Invalid OTP. ${5 - session.attempts} attempts remaining`,
                attemptsLeft: 5 - session.attempts
            };
        }

        session.verified = true;
        console.log('OTP verified successfully');
        return { success: true, message: 'Email verified successfully' };
    }

    // Check if can resend OTP
    canResend(sessionId) {
        const session = otpSessions.get(sessionId);
        
        if (!session) {
            return { canResend: false, message: 'Session not found' };
        }

        if (session.verified) {
            return { canResend: false, message: 'Email already verified' };
        }

        const now = Date.now();
        
        if (now < session.canResendAt) {
            const waitTime = Math.ceil((session.canResendAt - now) / 1000);
            return { 
                canResend: false, 
                message: `Please wait ${waitTime} seconds before requesting a new OTP`,
                waitTime 
            };
        }

        return { canResend: true };
    }

    // Resend OTP - updates existing session
    resendOTP(sessionId) {
        const session = otpSessions.get(sessionId);

        if (!session) {
            return null;
        }

        // Clear old timeout
        if (session.timeout) {
            clearTimeout(session.timeout);
        }

        // Generate new OTP
        const newOTP = this.generateOTP();
        
        // Reset timer - restart expiry
        session.otp = newOTP;
        session.expiresAt = Date.now() + 5 * 60 * 1000;
        session.canResendAt = Date.now() + 30 * 1000;
        session.attempts = 0;

        // Set new timeout
        const timeout = setTimeout(() => {
            this.clearSession(sessionId);
        }, 5 * 60 * 1000);

        session.timeout = timeout;

        return { otp: newOTP, session };
    }

    // Clear session by ID (garbage disposal)
    clearSession(sessionId) {
        const session = otpSessions.get(sessionId);
        if (session && session.timeout) {
            clearTimeout(session.timeout);
        }
        otpSessions.delete(sessionId);
    }

    // Clear session by email (when changing email)
    clearSessionByEmail(email) {
        for (const [sessionId, session] of otpSessions.entries()) {
            if (session.email === email) {
                if (session.timeout) {
                    clearTimeout(session.timeout);
                }
                otpSessions.delete(sessionId);
            }
        }
    }

    // Check if email is verified
    isEmailVerified(sessionId) {
        const session = otpSessions.get(sessionId);
        return session && session.verified && Date.now() <= session.expiresAt;
    }

    // Get session info (without OTP)
    getSessionInfo(sessionId) {
        const session = otpSessions.get(sessionId);
        
        if (!session) {
            return null;
        }

        const now = Date.now();
        const timeLeft = Math.max(0, Math.ceil((session.expiresAt - now) / 1000));
        const canResendIn = Math.max(0, Math.ceil((session.canResendAt - now) / 1000));

        return {
            email: session.email,
            verified: session.verified,
            expiresIn: timeLeft,
            canResendIn: canResendIn,
            attempts: session.attempts
        };
    }

    // Cleanup expired sessions (run periodically)
    cleanupExpiredSessions() {
        const now = Date.now();
        for (const [sessionId, session] of otpSessions.entries()) {
            if (now > session.expiresAt) {
                this.clearSession(sessionId);
            }
        }
    }
}

// Create singleton instance
const otpService = new OTPService();

// Cleanup expired sessions every minute
setInterval(() => {
    otpService.cleanupExpiredSessions();
}, 60 * 1000);

module.exports = otpService;
