require('dotenv').config();
const { db } = require('./config/firebase');

async function checkAllRegistrations() {
    try {
        console.log('🔍 Checking all registrations in Firebase...\n');

        // Get ALL registrations
        const allSnapshot = await db.collection('registrations').get();

        if (allSnapshot.empty) {
            console.log('❌ No registrations found in Firebase.');
            process.exit(0);
        }

        console.log(`📋 Found ${allSnapshot.size} total registrations\n`);
        console.log('='.repeat(100));

        const statusCount = {
            SUCCESS: 0,
            PENDING: 0,
            FAILED: 0,
            OTHER: 0
        };

        const registrations = [];
        allSnapshot.forEach(doc => {
            const data = doc.data();
            const status = data.paymentStatus || 'UNKNOWN';

            registrations.push({
                id: doc.id,
                childName: data.childName,
                parentName: data.parentName,
                parentEmail: data.parentEmail,
                parentContact: data.parentContact,
                totalAmount: data.totalAmount,
                paymentStatus: status,
                orderId: data.orderId,
                transactionId: data.transactionId || null,
                createdAt: data.createdAt
            });

            if (status === 'SUCCESS') statusCount.SUCCESS++;
            else if (status === 'PENDING') statusCount.PENDING++;
            else if (status === 'FAILED') statusCount.FAILED++;
            else statusCount.OTHER++;
        });

        // Sort by creation date (most recent first)
        registrations.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
        });

        // Display all registrations
        registrations.forEach((reg, index) => {
            const statusEmoji = reg.paymentStatus === 'SUCCESS' ? '✅' :
                reg.paymentStatus === 'PENDING' ? '⏳' :
                    reg.paymentStatus === 'FAILED' ? '❌' : '❓';

            console.log(`\n${index + 1}. ${statusEmoji} ${reg.paymentStatus}`);
            console.log(`   ID: ${reg.id}`);
            console.log(`   Child: ${reg.childName}`);
            console.log(`   Parent: ${reg.parentName}`);
            console.log(`   Email: ${reg.parentEmail}`);
            console.log(`   Contact: ${reg.parentContact}`);
            console.log(`   Amount: ₹${reg.totalAmount}`);
            console.log(`   Order ID: ${reg.orderId || 'N/A'}`);
            console.log(`   Transaction ID: ${reg.transactionId || 'N/A'}`);
            console.log(`   Created: ${reg.createdAt}`);
            console.log('-'.repeat(100));
        });

        // Summary
        console.log('\n' + '='.repeat(100));
        console.log('📊 SUMMARY BY PAYMENT STATUS');
        console.log('='.repeat(100));
        console.log(`✅ SUCCESS: ${statusCount.SUCCESS}`);
        console.log(`⏳ PENDING: ${statusCount.PENDING}`);
        console.log(`❌ FAILED: ${statusCount.FAILED}`);
        console.log(`❓ OTHER/UNKNOWN: ${statusCount.OTHER}`);
        console.log(`📋 TOTAL: ${allSnapshot.size}`);

        // Show pending registrations separately
        const pending = registrations.filter(r => r.paymentStatus === 'PENDING');
        if (pending.length > 0) {
            console.log('\n' + '='.repeat(100));
            console.log('⏳ PENDING REGISTRATIONS DETAILS');
            console.log('='.repeat(100));
            pending.forEach((reg, index) => {
                console.log(`\n${index + 1}. ${reg.childName} - ${reg.parentEmail}`);
                console.log(`   Registration ID: ${reg.id}`);
                console.log(`   Order ID: ${reg.orderId || 'N/A'}`);
                console.log(`   Amount: ₹${reg.totalAmount}`);
                console.log(`   Created: ${reg.createdAt}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkAllRegistrations();
