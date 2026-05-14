require('dotenv').config();
const { db } = require('./config/firebase');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function findMissingPayments() {
    try {
        console.log('🔍 Fetching recent payments from Razorpay...\n');

        // Fetch recent payments from Razorpay (last 100)
        const payments = await razorpay.payments.all({
            count: 100
        });

        console.log(`📋 Found ${payments.items.length} recent payments in Razorpay\n`);

        // Filter for captured/successful payments only
        const successfulPayments = payments.items.filter(p => p.status === 'captured');
        console.log(`✅ ${successfulPayments.length} successful/captured payments\n`);
        console.log('='.repeat(100));

        // Get all SUCCESS registrations from Firebase
        const successSnapshot = await db.collection('registrations')
            .where('paymentStatus', '==', 'SUCCESS')
            .get();

        const firebasePaymentIds = new Set();
        successSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.transactionId) {
                firebasePaymentIds.add(data.transactionId);
            }
        });

        console.log(`💾 ${firebasePaymentIds.size} payment IDs in Firebase (SUCCESS status)\n`);
        console.log('='.repeat(100));

        // Find payments in Razorpay but not in Firebase
        const missingPayments = [];

        for (const payment of successfulPayments) {
            if (!firebasePaymentIds.has(payment.id)) {
                console.log(`\n❗ MISSING IN FIREBASE:`);
                console.log(`   Payment ID: ${payment.id}`);
                console.log(`   Amount: ₹${payment.amount / 100}`);
                console.log(`   Email: ${payment.email}`);
                console.log(`   Contact: ${payment.contact}`);
                console.log(`   Date: ${new Date(payment.created_at * 1000).toLocaleString()}`);
                console.log(`   Method: ${payment.method}`);
                console.log(`   Order ID: ${payment.order_id}`);

                // Check if there's a registration with this email
                const emailSnapshot = await db.collection('registrations')
                    .where('parentEmail', '==', payment.email)
                    .get();

                if (!emailSnapshot.empty) {
                    console.log(`   📧 Found registration(s) with this email:`);
                    emailSnapshot.forEach(doc => {
                        const data = doc.data();
                        console.log(`      - ${data.childName} | Status: ${data.paymentStatus} | Amount: ₹${data.totalAmount}`);
                        console.log(`        Registration ID: ${doc.id}`);
                        console.log(`        Transaction ID: ${data.transactionId || 'NONE'}`);
                    });
                } else {
                    console.log(`   ⚠️  No registration found with email: ${payment.email}`);
                }

                missingPayments.push({
                    paymentId: payment.id,
                    amount: payment.amount / 100,
                    email: payment.email,
                    contact: payment.contact,
                    orderId: payment.order_id,
                    date: new Date(payment.created_at * 1000).toLocaleString(),
                    method: payment.method
                });

                console.log('-'.repeat(100));
            }
        }

        // Summary
        console.log('\n' + '='.repeat(100));
        console.log('📊 SUMMARY');
        console.log('='.repeat(100));
        console.log(`Total Razorpay payments: ${payments.items.length}`);
        console.log(`Captured payments: ${successfulPayments.length}`);
        console.log(`In Firebase: ${firebasePaymentIds.size}`);
        console.log(`Missing in Firebase: ${missingPayments.length}`);

        if (missingPayments.length > 0) {
            console.log('\n' + '='.repeat(100));
            console.log('⚠️  PAYMENTS IN RAZORPAY BUT NOT IN FIREBASE:');
            console.log('='.repeat(100));
            missingPayments.forEach((payment, index) => {
                console.log(`\n${index + 1}. Payment ID: ${payment.paymentId}`);
                console.log(`   Email: ${payment.email}`);
                console.log(`   Contact: ${payment.contact}`);
                console.log(`   Amount: ₹${payment.amount}`);
                console.log(`   Date: ${payment.date}`);
                console.log(`   Method: ${payment.method}`);
            });

            console.log('\n💡 ACTION REQUIRED:');
            console.log('   These payments need to be manually matched with registrations');
            console.log('   or investigated why they\'re missing from Firebase.');
        } else {
            console.log('\n✅ All Razorpay payments are accounted for in Firebase!');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

findMissingPayments();
