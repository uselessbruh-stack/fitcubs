const express = require('express');
const router = express.Router();
const { getRegistrationById, markEventPresence, markItemReceived, getAttendanceStats, getAllRegistrations } = require('../services/databaseService');
const qrCodeService = require('../services/qrCodeService');

// Verify QR code and get registration details
router.post('/verify-qr', async (req, res) => {
    try {
        const { qrData } = req.body;

        if (!qrData) {
            return res.status(400).json({
                success: false,
                message: 'QR data is required'
            });
        }

        // Verify QR code
        const verification = qrCodeService.verifyQRData(qrData);

        if (!verification.valid) {
            return res.status(400).json({
                success: false,
                message: verification.message
            });
        }

        // Get registration details
        const registration = await getRegistrationById(verification.registrationId);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        // Check if payment is confirmed
        if (registration.status !== 'confirmed') {
            return res.status(400).json({
                success: false,
                message: 'Registration payment not confirmed',
                status: registration.status
            });
        }

        res.json({
            success: true,
            message: 'QR code verified successfully',
            registration: {
                id: verification.registrationId,
                childName: registration.childName,
                parentName: registration.parentName,
                parentEmail: registration.parentEmail,
                parentContact: registration.parentContact,
                category: registration.category,
                tshirtSize: registration.tshirtSize,
                age: registration.age,
                eventPresence: registration.eventPresence,
                itemsReceived: registration.itemsReceived,
                breakfastCount: registration.breakfastCount
            }
        });

    } catch (error) {
        console.error('QR verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify QR code'
        });
    }
});

// Mark participant as present at event
router.post('/mark-presence', async (req, res) => {
    try {
        const { registrationId, markedBy } = req.body;

        if (!registrationId || !markedBy) {
            return res.status(400).json({
                success: false,
                message: 'Registration ID and admin name are required'
            });
        }

        // Get registration to check status
        const registration = await getRegistrationById(registrationId);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        if (registration.status !== 'confirmed') {
            return res.status(400).json({
                success: false,
                message: 'Registration payment not confirmed'
            });
        }

        if (registration.eventPresence.markedPresent) {
            return res.json({
                success: true,
                message: 'Participant already marked present',
                alreadyMarked: true,
                markedAt: registration.eventPresence.markedAt
            });
        }

        await markEventPresence(registrationId, markedBy);

        res.json({
            success: true,
            message: 'Participant marked present successfully'
        });

    } catch (error) {
        console.error('Mark presence error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark presence'
        });
    }
});

// Mark item as received by participant
router.post('/mark-item-received', async (req, res) => {
    try {
        const { registrationId, itemName, markedBy } = req.body;

        if (!registrationId || !itemName || !markedBy) {
            return res.status(400).json({
                success: false,
                message: 'Registration ID, item name, and admin name are required'
            });
        }

        // Validate item name
        const validItems = ['participationMedal', 'certificate', 'snackBox', 'tshirt', 'extraLunch'];
        if (!validItems.includes(itemName)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid item name',
                validItems
            });
        }

        // Get registration to check status
        const registration = await getRegistrationById(registrationId);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        if (registration.itemsReceived[itemName]) {
            return res.json({
                success: true,
                message: 'Item already marked as received',
                alreadyMarked: true,
                markedAt: registration.itemsReceivedTimestamps[itemName]
            });
        }

        await markItemReceived(registrationId, itemName, markedBy);

        res.json({
            success: true,
            message: `${itemName} marked as received successfully`
        });

    } catch (error) {
        console.error('Mark item received error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark item as received'
        });
    }
});

// Get attendance statistics
router.get('/attendance-stats', async (req, res) => {
    try {
        const stats = await getAttendanceStats();

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('Get attendance stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get attendance statistics'
        });
    }
});

// Get all registrations for admin panel
router.get('/registrations', async (req, res) => {
    try {
        const registrations = await getAllRegistrations();

        // Don't send sensitive payment details
        const sanitizedRegistrations = registrations.map(reg => ({
            id: reg.id,
            childName: reg.childName,
            parentName: reg.parentName,
            parentEmail: reg.parentEmail,
            parentContact: reg.parentContact,
            category: reg.category,
            tshirtSize: reg.tshirtSize,
            age: reg.age,
            status: reg.status,
            paymentStatus: reg.paymentStatus,
            totalAmount: reg.totalAmount,
            createdAt: reg.createdAt,
            eventPresence: reg.eventPresence,
            itemsReceived: reg.itemsReceived,
            itemsReceivedTimestamps: reg.itemsReceivedTimestamps,
            breakfastCount: reg.breakfastCount
        }));

        res.json({
            success: true,
            registrations: sanitizedRegistrations,
            total: sanitizedRegistrations.length
        });

    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get registrations'
        });
    }
});

// Get single registration details
router.get('/registration/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const registration = await getRegistrationById(id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        // Don't send payment signature details
        const sanitizedRegistration = {
            id: registration.id,
            childName: registration.childName,
            parentName: registration.parentName,
            parentEmail: registration.parentEmail,
            parentContact: registration.parentContact,
            category: registration.category,
            tshirtSize: registration.tshirtSize,
            age: registration.age,
            dateOfBirth: registration.dateOfBirth,
            schoolName: registration.schoolName,
            medicalConditions: registration.medicalConditions,
            status: registration.status,
            paymentStatus: registration.paymentStatus,
            transactionId: registration.transactionId,
            totalAmount: registration.totalAmount,
            createdAt: registration.createdAt,
            eventPresence: registration.eventPresence,
            itemsReceived: registration.itemsReceived,
            itemsReceivedTimestamps: registration.itemsReceivedTimestamps,
            itemsReceivedBy: registration.itemsReceivedBy,
            breakfastCount: registration.breakfastCount
        };

        res.json({
            success: true,
            registration: sanitizedRegistration
        });

    } catch (error) {
        console.error('Get registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get registration details'
        });
    }
});

// Get all successful registrations for admin portal CSV download
router.get('/export-registrations', async (req, res) => {
    try {
        const { db } = require('../config/firebase');
        
        const snapshot = await db.collection('registrations')
            .where('paymentStatus', '==', 'SUCCESS')
            .get();

        const registrations = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            registrations.push({
                id: doc.id,
                childName: data.childName,
                gender: data.gender,
                age: data.age,
                dateOfBirth: data.dateOfBirth,
                parentName: data.parentName,
                parentContact: data.parentContact,
                parentEmail: data.parentEmail,
                schoolName: data.schoolName,
                schoolArea: data.schoolArea,
                category: data.category,
                tshirtSize: data.tshirtSize,
                breakfastCount: data.breakfastCount,
                totalAmount: data.totalAmount,
                transactionId: data.transactionId,
                createdAt: data.createdAt
            });
        });

        res.json({
            success: true,
            count: registrations.length,
            data: registrations
        });
    } catch (error) {
        console.error('Error exporting registrations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export registrations',
            error: error.message
        });
    }
});

module.exports = router;
