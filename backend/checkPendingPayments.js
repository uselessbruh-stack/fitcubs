require('dotenv').config();
const { db } = require('./config/firebase');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function checkPendingRegistrations() {
    try {
        console.log('🔍 Checking pending registrations against Razorpay...\n');
        console.log('='.repeat(100));

        // Get all pending registrations (lowercase)
        const pendingSnapshot = await db.collection('registrations')
            .where('paymentStatus', '==', 'pending')
            .get();

        console.log(`📋 Found ${pendingSnapshot.size} pending registrations\n`);

        const paidButPending = [];
        const trulyPending = [];

        for (const doc of pendingSnapshot.docs) {
            const regData = doc.data();
            const email = regData.parentEmail;
            const amount = Math.round(regData.totalAmount * 100); // Convert to paise

            console.log(`\n📝 Checking: ${regData.childName} (${email})`);
            console.log(`   Amount: ₹${regData.totalAmount}`);
            console.log(`   Registration ID: ${doc.id}`);

            try {
                // Search for payments by email (last 100 payments)
                const payments = await razorpay.payments.all({
                    count: 100,
                    skip: 0
                });

                // Find matching payment by email and amount
                const matchingPayment = payments.items.find(payment => {
                    const paymentEmail = payment.email?.toLowerCase();
                    const regEmail = email?.toLowerCase();
                    const amountMatch = payment.amount === amount;
                    const statusCaptured = payment.status === 'captured';
                    
                    return paymentEmail === regEmail && amountMatch && statusCaptured;
                });

                if (matchingPayment) {
                    console.log(`   ✅ FOUND PAID: ${matchingPayment.id}`);
                    console.log(`   Payment Status: ${matchingPayment.status}`);
                    console.log(`   Payment Amount: ₹${matchingPayment.amount / 100}`);
                    console.log(`   Payment Date: ${new Date(matchingPayment.created_at * 1000).toLocaleString()}`);
                    
                    paidButPending.push({
                        registrationId: doc.id,
                        childName: regData.childName,
                        parentEmail: email,
                        amount: regData.totalAmount,
                        razorpayPaymentId: matchingPayment.id,
                        paymentDate: new Date(matchingPayment.created_at * 1000)
                    });
                } else {
                    console.log(`   ⏳ No matching payment found - Truly pending`);
                    trulyPending.push({
                        registrationId: doc.id,
                        childName: regData.childName,
                        parentEmail: email,
                        amount: regData.totalAmount
                    });
                }

            } catch (error) {
                console.log(`   ❌ Error checking Razorpay: ${error.message}`);
                trulyPending.push({
                    registrationId: doc.id,
                    childName: regData.childName,
                    parentEmail: email,
                    amount: regData.totalAmount,
                    error: error.message
                });
            }

            console.log('-'.repeat(100));
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('\n' + '='.repeat(100));
        console.log('📊 FINAL SUMMARY');
        console.log('='.repeat(100));
        
        if (paidButPending.length > 0) {
            console.log(`\n✅ PAID BUT MARKED PENDING (${paidButPending.length}):`);
            console.log('These need to be updated to SUCCESS status:\n');
            paidButPending.forEach((item, index) => {
                console.log(`${index + 1}. ${item.childName}`);
                console.log(`   Email: ${item.parentEmail}`);
                console.log(`   Amount: ₹${item.amount}`);
                console.log(`   Payment ID: ${item.razorpayPaymentId}`);
                console.log(`   Registration ID: ${item.registrationId}`);
                console.log('');
            });
        } else {
            console.log('\n✅ No paid registrations found in pending status');
        }

        if (trulyPending.length > 0) {
            console.log(`\n⏳ TRULY PENDING (${trulyPending.length}):`);
            console.log('These are incomplete registrations:\n');
            trulyPending.forEach((item, index) => {
                console.log(`${index + 1}. ${item.childName} - ${item.parentEmail} - ₹${item.amount}`);
            });
        }

        console.log('\n' + '='.repeat(100));
        
        // Save results to file
        const fs = require('fs');
        const results = {
            checkedAt: new Date().toISOString(),
            totalPending: pendingSnapshot.size,
            paidButPending: paidButPending,
            trulyPending: trulyPending
        };
        
        fs.writeFileSync('pending-registrations-check.json', JSON.stringify(results, null, 2));
        console.log('\n✅ Results saved to: pending-registrations-check.json');

        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
}

checkPendingRegistrations();
