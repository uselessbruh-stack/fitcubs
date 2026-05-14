const QRCode = require('qrcode');
const crypto = require('crypto');

class QRCodeService {
    // Generate unique QR code data for registration
    generateQRData(registrationId, childName, parentEmail) {
        const timestamp = Date.now();
        const hash = crypto
            .createHash('sha256')
            .update(`${registrationId}-${timestamp}-${process.env.QR_SECRET || 'fitcubs2025'}`)
            .digest('hex')
            .substring(0, 16);

        const qrData = {
            id: registrationId,
            hash: hash,
            timestamp: timestamp,
            event: 'Kids Mini Marathon 2025',
            name: childName,
            email: parentEmail
        };

        return JSON.stringify(qrData);
    }

    // Generate QR code as base64 image
    async generateQRCodeBase64(registrationId, childName, parentEmail) {
        try {
            const qrData = this.generateQRData(registrationId, childName, parentEmail);
            
            const qrCodeImage = await QRCode.toDataURL(qrData, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            return qrCodeImage;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    }

    // Verify QR code data
    verifyQRData(qrDataString) {
        try {
            const qrData = JSON.parse(qrDataString);
            
            // Check if QR code is for the correct event
            if (qrData.event !== 'Kids Mini Marathon 2025') {
                return { valid: false, message: 'Invalid event QR code' };
            }

            // Check if QR code is not too old (optional - for security)
            const qrAge = Date.now() - qrData.timestamp;
            const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
            if (qrAge > maxAge) {
                return { valid: false, message: 'QR code expired' };
            }

            return {
                valid: true,
                registrationId: qrData.id,
                childName: qrData.name,
                email: qrData.email,
                hash: qrData.hash
            };
        } catch (error) {
            return { valid: false, message: 'Invalid QR code format' };
        }
    }
}

const qrCodeService = new QRCodeService();
module.exports = qrCodeService;
