const { db } = require('../config/firebase');

// Save registration to Firestore
const saveRegistration = async (registrationData) => {
    try {
        const registrationRef = await db.collection('registrations').add({
            ...registrationData,
            createdAt: new Date().toISOString(),
            status: 'pending',
            // Event attendance tracking
            eventPresence: {
                markedPresent: false,
                markedBy: null,
                markedAt: null
            },
            // Items received tracking
            itemsReceived: {
                participationMedal: false,
                certificate: false,
                snackBox: false,
                tshirt: false,
                extraLunch: false
            },
            itemsReceivedTimestamps: {
                participationMedal: null,
                certificate: null,
                snackBox: null,
                tshirt: null,
                extraLunch: null
            },
            itemsReceivedBy: {
                participationMedal: null,
                certificate: null,
                snackBox: null,
                tshirt: null,
                extraLunch: null
            }
        });

        console.log('✅ Registration saved:', registrationRef.id);
        return registrationRef.id;
    } catch (error) {
        console.error('❌ Error saving registration:', error.message);
        throw error;
    }
};

// Update payment status
const updatePaymentStatus = async (registrationId, paymentData) => {
    try {
        await db.collection('registrations').doc(registrationId).update({
            paymentStatus: paymentData.status,
            transactionId: paymentData.transactionId,
            paymentResponse: paymentData.response,
            updatedAt: new Date().toISOString(),
            status: paymentData.status === 'SUCCESS' ? 'confirmed' : 'failed'
        });

        return true;
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
};

// Get registration by ID
const getRegistrationById = async (registrationId) => {
    try {
        const doc = await db.collection('registrations').doc(registrationId).get();

        if (!doc.exists) {
            return null;
        }

        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error('Error getting registration:', error);
        throw error;
    }
};

// Get all registrations
const getAllRegistrations = async () => {
    try {
        const snapshot = await db.collection('registrations').orderBy('createdAt', 'desc').get();

        const registrations = [];
        snapshot.forEach(doc => {
            registrations.push({ id: doc.id, ...doc.data() });
        });

        return registrations;
    } catch (error) {
        console.error('Error getting all registrations:', error);
        throw error;
    }
};

// Get registrations by status
const getRegistrationsByStatus = async (status) => {
    try {
        const snapshot = await db.collection('registrations')
            .where('status', '==', status)
            .orderBy('createdAt', 'desc')
            .get();

        const registrations = [];
        snapshot.forEach(doc => {
            registrations.push({ id: doc.id, ...doc.data() });
        });

        return registrations;
    } catch (error) {
        console.error('Error getting registrations by status:', error);
        throw error;
    }
};

// Mark event presence
const markEventPresence = async (registrationId, markedBy) => {
    try {
        await db.collection('registrations').doc(registrationId).update({
            'eventPresence.markedPresent': true,
            'eventPresence.markedBy': markedBy,
            'eventPresence.markedAt': new Date().toISOString()
        });

        return true;
    } catch (error) {
        console.error('Error marking event presence:', error);
        throw error;
    }
};

// Mark item as received
const markItemReceived = async (registrationId, itemName, markedBy) => {
    try {
        const updateData = {};
        updateData[`itemsReceived.${itemName}`] = true;
        updateData[`itemsReceivedTimestamps.${itemName}`] = new Date().toISOString();
        updateData[`itemsReceivedBy.${itemName}`] = markedBy;

        await db.collection('registrations').doc(registrationId).update(updateData);

        return true;
    } catch (error) {
        console.error('Error marking item received:', error);
        throw error;
    }
};

// Get attendance statistics
const getAttendanceStats = async () => {
    try {
        const allSnapshot = await db.collection('registrations')
            .where('status', '==', 'confirmed')
            .get();

        const presentSnapshot = await db.collection('registrations')
            .where('status', '==', 'confirmed')
            .where('eventPresence.markedPresent', '==', true)
            .get();

        return {
            totalRegistrations: allSnapshot.size,
            presentCount: presentSnapshot.size,
            absentCount: allSnapshot.size - presentSnapshot.size
        };
    } catch (error) {
        console.error('Error getting attendance stats:', error);
        throw error;
    }
};

module.exports = {
    saveRegistration,
    updatePaymentStatus,
    getRegistrationById,
    getAllRegistrations,
    getRegistrationsByStatus,
    markEventPresence,
    markItemReceived,
    getAttendanceStats
};
