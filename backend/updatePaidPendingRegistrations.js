require('dotenv').config();
const { db } = require('./config/firebase');
const { sendRegistrationEmail } = require('./services/emailService');
const qrCodeService = require('./services/qrCodeService');

// List of paid registrations that need to be updated
const paidRegistrations = [
    { id: '0xRP9TYS8uo6Gld5Sw6b', name: 'Gahan Aditiya R', email: 'rahul.lokesha@gmail.com', paymentId: 'pay_RjeB7MrEcKQNAm' },
    { id: '5PVkT6grfy3jvq3uNgCQ', name: 'Aradhy mishra', email: 'prashantm745@gmail.com', paymentId: 'pay_RlCx840dJXsQeb' },
    { id: 'CPHlKWnnexCy1qeU9Wlk', name: 'Aadhya das', email: 'db439710@gmail.com', paymentId: 'pay_RlFyiPw6qfpBhg' },
    { id: 'D4Zzt6GhbQqckPA3MmPe', name: 'Sushruth vemula', email: 'suman.vemula22@gmail.com', paymentId: 'pay_Rh77EgDkHyrxLB' },
    { id: 'IolZIGW8BeWoPL1GQ5dh', name: 'R.B Binesh Dhuruva', email: 'ramana.winning@gmail.com', paymentId: 'pay_RlyYTzRTilyU1K' },
    { id: 'JZY042XtQhlC6fU4DROC', name: 'Ravipati pranavika Chowdary', email: 'bapujiravipati@gmail.com', paymentId: 'pay_RlWX0QZGFugpcH' },
    { id: 'TvSBDE5gnaof3tPCILI6', name: 'G vidhwan', email: 'shankarappa342@gmail.com', paymentId: 'pay_Rcg7dz7HPl6iz0' },
    { id: 'b3fJ5LzD9xMEKegkYYBZ', name: 'Kousthubh Bharadwaj', email: 'kpushpa147@gmail.com', paymentId: 'pay_RiNgLDdkniBW3W' },
    { id: 'cpuuG5W8ECv4rVG1E9zV', name: 'Jisha Mishra', email: 'jitesh921@gmail.com', paymentId: 'pay_Rjz638txVTHqyb' },
    { id: 'lH7Fy1A2QQHNBILorHU7', name: 'Ravipati pranavika Chowdary', email: 'bapujiravipati@gmail.com', paymentId: 'pay_RlWX0QZGFugpcH' },
    { id: 'rLSwU7piYZF2Irxr054A', name: 'Kousthubh Bharadwaj', email: 'kpushpa147@gmail.com', paymentId: 'pay_RiNgLDdkniBW3W' },
    { id: 'y2X15e62w8RjpbMzulRf', name: 'G vidhwan', email: 'shankarappa342@gmail.com', paymentId: 'pay_Rcg7dz7HPl6iz0' }
];

async function updatePaidRegistrations() {
    try {
        console.log('🔄 Updating paid registrations from pending to SUCCESS...\n');
        console.log('='.repeat(100));

        let successCount = 0;
        let errorCount = 0;

        for (const reg of paidRegistrations) {
            console.log(`\n📝 Processing: ${reg.name} (${reg.email})`);
            console.log(`   Registration ID: ${reg.id}`);
            console.log(`   Payment ID: ${reg.paymentId}`);

            try {
                // Get registration document
                const docRef = db.collection('registrations').doc(reg.id);
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
                    transactionId: reg.paymentId,
                    updatedAt: new Date().toISOString()
                });

                console.log(`   ✅ Updated to SUCCESS status`);

                // Generate QR code
                let qrCodeBase64 = null;
                try {
                    qrCodeBase64 = await qrCodeService.generateQRCodeBase64(
                        reg.id,
                        regData.childName,
                        regData.parentEmail
                    );
                    console.log(`   ✅ QR code generated`);
                } catch (qrError) {
                    console.log(`   ⚠️  QR code generation failed: ${qrError.message}`);
                }

                // Send confirmation email
                await sendRegistrationEmail({
                    ...regData,
                    registrationId: reg.id,
                    transactionId: reg.paymentId
                }, 'SUCCESS', qrCodeBase64);

                console.log(`   ✅ Confirmation email sent to ${regData.parentEmail}`);

                // Send copy to admin
                await sendRegistrationEmail({
                    ...regData,
                    parentEmail: 'sottetale@gmail.com',
                    registrationId: reg.id,
                    transactionId: reg.paymentId
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
        console.log(`✅ Successfully updated: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📋 Total: ${paidRegistrations.length}`);
        console.log('\n✅ COMPLETED!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
}

updatePaidRegistrations();
