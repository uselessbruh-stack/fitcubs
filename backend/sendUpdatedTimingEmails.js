require('dotenv').config();
const { db } = require('./config/firebase');
const { sendTimingUpdateEmail } = require('./services/emailService');
const qrCodeService = require('./services/qrCodeService');

async function sendUpdatedTimingEmails() {
    try {
        console.log('📧 Sending TIMING UPDATE emails to all registered participants...\n');
        console.log('='.repeat(100));

        // Get all SUCCESS registrations
        const snapshot = await db.collection('registrations')
            .where('paymentStatus', '==', 'SUCCESS')
            .get();

        if (snapshot.empty) {
            console.log('❌ No successful registrations found.');
            process.exit(0);
        }

        console.log(`📋 Found ${snapshot.size} successful registrations\n`);

        let successCount = 0;
        let errorCount = 0;

        for (const doc of snapshot.docs) {
            const regData = doc.data();

            try {
                console.log(`\n📝 Processing: ${regData.childName} (${regData.parentEmail})`);

                // Generate QR code
                let qrCodeBase64 = null;
                try {
                    qrCodeBase64 = await qrCodeService.generateQRCodeBase64(
                        doc.id,
                        regData.childName,
                        regData.parentEmail
                    );
                    console.log(`   ✅ QR code generated`);
                } catch (qrError) {
                    console.log(`   ⚠️  QR code generation failed:`, qrError.message);
                }

                // Send timing update email
                await sendTimingUpdateEmail({
                    ...regData,
                    registrationId: doc.id,
                    transactionId: regData.transactionId
                }, qrCodeBase64);

                console.log(`   ✅ Timing update email sent!`);

                // Also send a copy to admin
                await sendTimingUpdateEmail({
                    ...regData,
                    parentEmail: 'sottetale@gmail.com',
                    registrationId: doc.id,
                    transactionId: regData.transactionId
                }, qrCodeBase64);

                console.log(`   ✅ Copy sent to admin`);

                successCount++;

            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
                errorCount++;
            }

            console.log('-'.repeat(100));

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('\n' + '='.repeat(100));
        console.log('📊 SUMMARY');
        console.log('='.repeat(100));
        console.log(`✅ Successfully sent: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📋 Total: ${snapshot.size}`);
        console.log('\n✅ COMPLETED!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
}

sendUpdatedTimingEmails();
