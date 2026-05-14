require('dotenv').config();
const { db } = require('./config/firebase');
const Razorpay = require('razorpay');
const { sendRegistrationConfirmation } = require('./services/emailService');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Registrations to update with their payment IDs
const paymentsToUpdate = [
    {
        registrationId: 'KdGIQ5gnOqufnK9vLcyi',
        paymentId: 'pay_RgpkveitPZYL3u',
        childName: 'Bhavneeth S',
        email: 'saravanakumarsarunja@gmail.com'
    },
    {
        registrationId: 'eU0ejcAwYqqQbK34FBXw',
        paymentId: 'pay_Rg4jpj3WbAH8NX',
        childName: 'Mayank.GP',
        email: 'ashwiniganesh017@gmail.com'
    },
    {
        registrationId: 'hyC1B0j8m8G7iKj7GzkR',
        paymentId: 'pay_RfwAGk3MYW6Jua',
        childName: 'Nurazuddin Hakim',
        email: 'humeranazsayyed1997@gmail.com'
    },
    {
        registrationId: '93YWhG2rNrbzMgLtqqUL',
        paymentId: 'pay_Rc4cJgFrBYmji1',
        childName: 'Krishank Mendon',
        email: 'rameshkundar85@gmail.com'
    }
];

async function updateMissingPayments() {
    try {
        console.log('🔄 Updating registrations with missing payment information...\n');
        console.log('='.repeat(100));

        for (const item of paymentsToUpdate) {
            console.log(`\n📝 Processing: ${item.childName} (${item.email})`);
            console.log(`   Registration ID: ${item.registrationId}`);
            console.log(`   Payment ID: ${item.paymentId}`);

            try {
                // Fetch payment details from Razorpay
                const payment = await razorpay.payments.fetch(item.paymentId);
                console.log(`   ✅ Payment verified in Razorpay`);
                console.log(`   Amount: ₹${payment.amount / 100}`);
                console.log(`   Status: ${payment.status}`);

                if (payment.status !== 'captured') {
                    console.log(`   ⚠️  Payment not captured, skipping...`);
                    continue;
                }

                // Update Firebase
                const regRef = db.collection('registrations').doc(item.registrationId);
                const regDoc = await regRef.get();

                if (!regDoc.exists) {
                    console.log(`   ❌ Registration not found in Firebase`);
                    continue;
                }

                await regRef.update({
                    paymentStatus: 'SUCCESS',
                    transactionId: item.paymentId,
                    paymentResponse: payment,
                    updatedAt: new Date().toISOString()
                });

                console.log(`   ✅ Registration updated to SUCCESS`);

                // Send confirmation email
                const regData = regDoc.data();
                console.log(`   📧 Sending confirmation email...`);

                await sendRegistrationConfirmation(
                    item.registrationId,
                    regData,
                    payment
                );

                console.log(`   ✅ Confirmation email sent!`);

            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
            }

            console.log('-'.repeat(100));
        }

        console.log('\n' + '='.repeat(100));
        console.log('✅ COMPLETED!');
        console.log('='.repeat(100));
        console.log(`Total registrations processed: ${paymentsToUpdate.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
}

updateMissingPayments();
