require('dotenv').config();
const { db } = require('./config/firebase');
const { sendRegistrationEmail } = require('./services/emailService');
const qrCodeService = require('./services/qrCodeService');

// Only the 3 NEW paid users (not duplicates)
const newPaidUsers = [
    { id: 'CPHlKWnnexCy1qeU9Wlk', name: 'Aadhya das', email: 'db439710@gmail.com', paymentId: 'pay_RlFyiPw6qfpBhg' },
    { id: 'JZY042XtQhlC6fU4DROC', name: 'Ravipati pranavika Chowdary', email: 'bapujiravipati@gmail.com', paymentId: 'pay_RlWX0QZGFugpcH' },
    { id: 'cpuuG5W8ECv4rVG1E9zV', name: 'Jisha Mishra', email: 'jitesh921@gmail.com', paymentId: 'pay_Rjz638txVTHqyb' }
];

async function sendConfirmationToNewUsers() {
    try {
        console.log('📧 Sending confirmation emails to 3 NEW paid users...\n');
        console.log('='.repeat(100));

        let successCount = 0;
        let errorCount = 0;

        for (const user of newPaidUsers) {
            console.log(`\n📝 Processing: ${user.name} (${user.email})`);
            console.log(`   Registration ID: ${user.id}`);
            console.log(`   Payment ID: ${user.paymentId}`);

            try {
                // Get registration document
                const docRef = db.collection('registrations').doc(user.id);
                const doc = await docRef.get();

                if (!doc.exists) {
                    console.log(`   ❌ Registration not found in database`);
                    errorCount++;
                    continue;
                }

                const regData = doc.data();

                // Update to SUCCESS status
                await docRef.update({
                    paymentStatus: 'SUCCESS',
                    transactionId: user.paymentId,
                    updatedAt: new Date().toISOString()
                });

                console.log(`   ✅ Updated to SUCCESS status`);

                // Generate QR code
                let qrCodeBase64 = null;
                try {
                    qrCodeBase64 = await qrCodeService.generateQRCodeBase64(
                        user.id,
                        regData.childName,
                        regData.parentEmail
                    );
                    console.log(`   ✅ QR code generated`);
                } catch (qrError) {
                    console.log(`   ⚠️  QR code generation failed: ${qrError.message}`);
                }

                // Send confirmation email to parent
                await sendRegistrationEmail({
                    ...regData,
                    registrationId: user.id,
                    transactionId: user.paymentId
                }, 'SUCCESS', qrCodeBase64);

                console.log(`   ✅ Confirmation email sent to ${regData.parentEmail}`);

                // Send copy to admin
                await sendRegistrationEmail({
                    ...regData,
                    parentEmail: 'sottetale@gmail.com',
                    registrationId: user.id,
                    transactionId: user.paymentId
                }, 'SUCCESS', qrCodeBase64);

                console.log(`   ✅ Copy sent to admin`);

                successCount++;

            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
                errorCount++;
            }

            console.log('-'.repeat(100));

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('\n' + '='.repeat(100));
        console.log('📊 SUMMARY');
        console.log('='.repeat(100));
        console.log(`✅ Successfully sent: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📋 Total: ${newPaidUsers.length}`);
        console.log('\n✅ COMPLETED!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
}

sendConfirmationToNewUsers();
