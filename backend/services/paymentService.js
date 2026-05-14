const Razorpay = require('razorpay');
const crypto = require('crypto');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_RaAS1BQLk3UqCi';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'R9Uzr0LVxRZWlhAnozmJWxXM';

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});

// Initiate payment - Create Razorpay order
const initiatePayment = async (registrationId, amount, userDetails) => {
    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${registrationId}`,
            notes: {
                registrationId: registrationId,
                childName: userDetails.childName,
                parentName: userDetails.parentName,
                parentEmail: userDetails.parentEmail,
                parentContact: userDetails.parentContact
            }
        };

        const order = await razorpay.orders.create(options);

        return {
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: RAZORPAY_KEY_ID
        };
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        throw error;
    }
};

// Verify payment signature
const verifyPaymentSignature = (orderId, paymentId, signature) => {
    try {
        const text = orderId + '|' + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');

        return expectedSignature === signature;
    } catch (error) {
        console.error('Payment signature verification error:', error);
        return false;
    }
};

// Fetch payment details
const getPaymentDetails = async (paymentId) => {
    try {
        const payment = await razorpay.payments.fetch(paymentId);
        return payment;
    } catch (error) {
        console.error('Fetch payment details error:', error);
        throw error;
    }
};

// Check payment status
const checkPaymentStatus = async (orderId) => {
    try {
        const order = await razorpay.orders.fetch(orderId);
        return {
            success: true,
            status: order.status,
            amount: order.amount,
            amountPaid: order.amount_paid,
            currency: order.currency
        };
    } catch (error) {
        console.error('Payment status check error:', error);
        throw error;
    }
};

module.exports = {
    initiatePayment,
    verifyPaymentSignature,
    getPaymentDetails,
    checkPaymentStatus
};
