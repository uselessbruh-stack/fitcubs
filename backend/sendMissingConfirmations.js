require('dotenv').config();
const { db } = require('./config/firebase');
const axios = require('axios');

const BREVO_API_KEY = process.env.EMAIL_PASSWORD;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Email addresses to send confirmations to
const emailsToSend = [
    {
        email: 'saravanakumarsarunja@gmail.com',
        childName: 'Bhavneeth S'
    },
    {
        email: 'ashwiniganesh017@gmail.com',
        childName: 'Mayank.GP'
    },
    {
        email: 'humeranazsayyed1997@gmail.com',
        childName: 'Nurazuddin Hakim'
    },
    {
        email: 'rameshkundar85@gmail.com',
        childName: 'Krishank Mendon'
    }
];

// Helper function to send email with CC
const sendEmailWithCC = async (to, ccEmail, subject, htmlContent, attachments = []) => {
    const recipients = [{ email: to }];
    if (ccEmail) {
        recipients.push({ email: ccEmail });
    }

    const response = await axios.post(
        BREVO_API_URL,
        {
            sender: {
                name: 'The Fit Cubs',
                email: process.env.EMAIL_USER
            },
            to: recipients,
            subject: subject,
            htmlContent: htmlContent,
            attachment: attachments
        },
        {
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        }
    );
    return response.data;
};

async function sendConfirmationEmails() {
    try {
        const qrCodeService = require('./services/qrCodeService');
        const { sendRegistrationEmail } = require('./services/emailService');

        console.log('📧 Sending confirmation emails to updated registrations...\n');
        console.log('   CC: sottetale@gmail.com will receive all emails\n');
        console.log('='.repeat(100));

        for (const item of emailsToSend) {
            console.log(`\n📝 Processing: ${item.childName} (${item.email})`);

            try {
                // Find the registration
                const snapshot = await db.collection('registrations')
                    .where('parentEmail', '==', item.email)
                    .where('paymentStatus', '==', 'SUCCESS')
                    .get();

                if (snapshot.empty) {
                    console.log(`   ❌ No SUCCESS registration found`);
                    continue;
                }

                // Get the first SUCCESS registration (should only be one)
                const doc = snapshot.docs[0];
                const regData = doc.data();

                console.log(`   ✅ Found registration ID: ${doc.id}`);
                console.log(`   Child: ${regData.childName}`);
                console.log(`   Transaction ID: ${regData.transactionId}`);

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

                // Send email to parent and CC to sottetale@gmail.com
                await sendRegistrationEmail({
                    ...regData,
                    registrationId: doc.id,
                    transactionId: regData.transactionId
                }, 'SUCCESS', qrCodeBase64);

                console.log(`   ✅ Email sent to: ${item.email}`);

                // Also send a copy directly to sottetale@gmail.com
                await sendRegistrationEmail({
                    ...regData,
                    parentEmail: 'sottetale@gmail.com',  // Override to send to you
                    registrationId: doc.id,
                    transactionId: regData.transactionId
                }, 'SUCCESS', qrCodeBase64);

                console.log(`   ✅ Copy sent to: sottetale@gmail.com`);

            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
            }

            console.log('-'.repeat(100));
        }

        console.log('\n' + '='.repeat(100));
        console.log('✅ COMPLETED!');
        console.log('='.repeat(100));

        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
}

sendConfirmationEmails();
