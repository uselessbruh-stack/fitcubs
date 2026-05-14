require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const registrationRoutes = require('./routes/registration');
const paymentRoutes = require('./routes/payment');
const otpRoutes = require('./routes/otp');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            process.env.FRONTEND_URL?.replace(/\/$/, ''), // without trailing slash
            'http://localhost:3000',
            'http://localhost:3000/',
            'https://events-fitcubs.vercel.app',
            'https://events-fitcubs.vercel.app/',
            'https://admin-fit.vercel.app',
            'https://admin-fit.vercel.app/'
        ].filter(Boolean);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/registration', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Fit Cubs Backend Server is running',
        timestamp: new Date().toISOString(),
        env: {
            nodeEnv: process.env.NODE_ENV,
            port: process.env.PORT,
            frontendUrl: process.env.FRONTEND_URL ? 'configured' : 'MISSING',
            razorpayKey: process.env.RAZORPAY_KEY_ID ? 'configured' : 'MISSING',
            emailHost: process.env.EMAIL_HOST ? 'configured' : 'MISSING',
            firebaseProject: process.env.FIREBASE_PROJECT_ID ? 'configured' : 'MISSING'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;
