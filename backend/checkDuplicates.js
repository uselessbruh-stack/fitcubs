require('dotenv').config();
const { db } = require('./config/firebase');

// Names to check for duplicates
const namesToCheck = [
    'Sushruth vemula',
    'Ravipati pranavika Chowdary',
    'G vidhwan',
    'Kousthubh Bharadwaj'
];

async function checkDuplicates() {
    try {
        console.log('🔍 Checking for duplicate registrations...\n');
        console.log('='.repeat(100));

        for (const childName of namesToCheck) {
            console.log(`\n📝 Searching for: ${childName}`);
            console.log('-'.repeat(100));

            // Search for all registrations with this child name
            const snapshot = await db.collection('registrations')
                .where('childName', '==', childName)
                .get();

            if (snapshot.empty) {
                console.log(`   No registrations found`);
                continue;
            }

            console.log(`   Found ${snapshot.size} registration(s):\n`);

            const registrations = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                registrations.push({
                    id: doc.id,
                    childName: data.childName,
                    parentName: data.parentName,
                    parentEmail: data.parentEmail,
                    parentContact: data.parentContact,
                    paymentStatus: data.paymentStatus,
                    transactionId: data.transactionId || 'N/A',
                    totalAmount: data.totalAmount,
                    createdAt: data.createdAt,
                    category: data.category
                });
            });

            // Sort by creation date
            registrations.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
                const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
                return dateB - dateA;
            });

            // Display all registrations
            registrations.forEach((reg, index) => {
                const createdDate = reg.createdAt?.toDate?.() || new Date(reg.createdAt);
                const statusIcon = reg.paymentStatus === 'SUCCESS' ? '✅' : 
                                   reg.paymentStatus === 'pending' ? '⏳' : '❓';
                
                console.log(`   ${index + 1}. ${statusIcon} ${reg.paymentStatus}`);
                console.log(`      Registration ID: ${reg.id}`);
                console.log(`      Parent: ${reg.parentName} (${reg.parentEmail})`);
                console.log(`      Contact: ${reg.parentContact}`);
                console.log(`      Category: ${reg.category}`);
                console.log(`      Amount: ₹${reg.totalAmount}`);
                console.log(`      Transaction ID: ${reg.transactionId}`);
                console.log(`      Created: ${createdDate.toLocaleString()}`);
                console.log('');
            });

            // Identify which ones to keep/delete
            const successRegistrations = registrations.filter(r => r.paymentStatus === 'SUCCESS');
            const pendingRegistrations = registrations.filter(r => r.paymentStatus === 'pending');

            if (successRegistrations.length > 0 && pendingRegistrations.length > 0) {
                console.log(`   ⚠️  RECOMMENDATION:`);
                console.log(`      Keep: SUCCESS registration(s) - ${successRegistrations.length} found`);
                successRegistrations.forEach(r => {
                    console.log(`         - ${r.id} (${r.transactionId})`);
                });
                console.log(`      Delete: pending registration(s) - ${pendingRegistrations.length} found`);
                pendingRegistrations.forEach(r => {
                    console.log(`         - ${r.id}`);
                });
            } else if (successRegistrations.length > 1) {
                console.log(`   ⚠️  WARNING: Multiple SUCCESS registrations found!`);
                console.log(`      Need manual review to determine which to keep.`);
            }
        }

        console.log('\n' + '='.repeat(100));
        console.log('📊 DUPLICATE CHECK SUMMARY');
        console.log('='.repeat(100));

        // Overall summary
        const allSnapshot = await db.collection('registrations').get();
        const allRegistrations = [];
        
        allSnapshot.forEach(doc => {
            const data = doc.data();
            allRegistrations.push({
                id: doc.id,
                childName: data.childName,
                parentEmail: data.parentEmail,
                paymentStatus: data.paymentStatus
            });
        });

        // Find all duplicates by child name
        const nameCount = {};
        allRegistrations.forEach(reg => {
            if (!nameCount[reg.childName]) {
                nameCount[reg.childName] = [];
            }
            nameCount[reg.childName].push(reg);
        });

        const duplicates = Object.entries(nameCount).filter(([name, regs]) => regs.length > 1);
        
        if (duplicates.length > 0) {
            console.log(`\n🔍 Found ${duplicates.length} children with multiple registrations:\n`);
            duplicates.forEach(([name, regs]) => {
                const successCount = regs.filter(r => r.paymentStatus === 'SUCCESS').length;
                const pendingCount = regs.filter(r => r.paymentStatus === 'pending').length;
                console.log(`   ${name} (${regs.length} registrations)`);
                console.log(`      - SUCCESS: ${successCount}, pending: ${pendingCount}`);
            });
        } else {
            console.log('\n✅ No duplicate child names found in database');
        }

        console.log('\n' + '='.repeat(100));

        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
}

checkDuplicates();
