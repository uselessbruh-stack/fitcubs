import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaHome } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [registrationData, setRegistrationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const registrationId = searchParams.get('registrationId');
    const transactionId = searchParams.get('transactionId');

    useEffect(() => {
        const fetchRegistrationData = async () => {
            if (registrationId) {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/registration/${registrationId}`
                    );
                    if (response.data.success) {
                        setRegistrationData(response.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching registration:', error);
                }
                setLoading(false);
            }
        };
        fetchRegistrationData();
    }, [registrationId]);

    const generatePDFReceipt = () => {
        if (!registrationData) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header with gradient effect (using multiple rectangles)
        doc.setFillColor(53, 174, 191); // #35AEBF
        doc.rect(0, 0, pageWidth, 35, 'F');

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('THE FIT CUBS', pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Kids Mini Marathon 2025', pageWidth / 2, 23, { align: 'center' });
        doc.setFontSize(10);
        doc.text('PAYMENT RECEIPT', pageWidth / 2, 30, { align: 'center' });

        // Reset text color
        doc.setTextColor(0, 0, 0);

        // Success badge
        doc.setFillColor(40, 167, 69); // Green
        doc.roundedRect(pageWidth / 2 - 30, 40, 60, 10, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text('✓ PAYMENT SUCCESSFUL', pageWidth / 2, 47, { align: 'center' });

        // Registration Details Section
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Registration Details', 15, 60);

        // Registration details table
        doc.autoTable({
            startY: 65,
            head: [['Field', 'Details']],
            body: [
                ['Registration ID', registrationData.id || registrationId],
                ['Transaction ID', transactionId || registrationData.transactionId || 'N/A'],
                ['Payment Date', new Date().toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })],
                ['Payment Status', 'SUCCESS']
            ],
            theme: 'grid',
            headStyles: { fillColor: [53, 174, 191], textColor: 255, fontSize: 10 },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 }, 1: { cellWidth: 'auto' } }
        });

        // Participant Details
        let currentY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Participant Details', 15, currentY);

        doc.autoTable({
            startY: currentY + 5,
            head: [['Field', 'Details']],
            body: [
                ['Child Name', registrationData.childName],
                ['Gender', registrationData.gender],
                ['Age', registrationData.age + ' years'],
                ['Date of Birth', registrationData.dateOfBirth],
                ['T-shirt Size', registrationData.tshirtSize],
                ['Category', registrationData.category],
                ['School Name', registrationData.schoolName || 'N/A'],
                ['School Area', registrationData.schoolArea || 'N/A']
            ],
            theme: 'grid',
            headStyles: { fillColor: [53, 174, 191], textColor: 255, fontSize: 10 },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 }, 1: { cellWidth: 'auto' } }
        });

        // Parent/Guardian Details
        currentY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Parent/Guardian Details', 15, currentY);

        doc.autoTable({
            startY: currentY + 5,
            head: [['Field', 'Details']],
            body: [
                ['Parent Name', registrationData.parentName],
                ['Email', registrationData.parentEmail],
                ['Contact', registrationData.parentContact]
            ],
            theme: 'grid',
            headStyles: { fillColor: [53, 174, 191], textColor: 255, fontSize: 10 },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 }, 1: { cellWidth: 'auto' } }
        });

        // Payment Breakdown
        currentY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Payment Breakdown', 15, currentY);

        const baseAmount = registrationData.baseAmount || 0;
        const breakfastAmount = registrationData.breakfastAmount || 0;
        const convenienceFee = registrationData.convenienceFee || 0;
        const totalAmount = registrationData.totalAmount || 0;

        doc.autoTable({
            startY: currentY + 5,
            head: [['Description', 'Amount']],
            body: [
                ['Registration Fee', '₹ ' + baseAmount.toFixed(2)],
                ['Breakfast Addon (' + (registrationData.breakfastCount || 0) + ' x ₹99)', '₹ ' + breakfastAmount.toFixed(2)],
                ['Subtotal', '₹ ' + (baseAmount + breakfastAmount).toFixed(2)],
                ['Convenience Fee', '₹ ' + convenienceFee.toFixed(2)]
            ],
            foot: [['TOTAL PAID', '₹ ' + totalAmount.toFixed(2)]],
            theme: 'grid',
            headStyles: { fillColor: [53, 174, 191], textColor: 255, fontSize: 10 },
            footStyles: { fillColor: [156, 188, 29], textColor: 255, fontSize: 11, fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: { 0: { cellWidth: 120 }, 1: { halign: 'right', fontStyle: 'bold' } }
        });

        // Event Details
        currentY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Event Details', 15, currentY);

        doc.autoTable({
            startY: currentY + 5,
            body: [
                ['Event Name', 'The Fit Cubs Kids Mini Marathon 2025'],
                ['Date', '7th December 2025'],
                ['Venue', 'Attal Bihari Vajpayee, BBMP HSR Ground'],
                ['Location', 'JP Nagar, Bangalore']
            ],
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 }, 1: { cellWidth: 'auto' } }
        });

        // Includes Section
        currentY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('What\'s Included:', 15, currentY);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        const includes = [
            '✓ Marathon T-shirt',
            '✓ Medal for all participants',
            '✓ Participation Certificate',
            '✓ Snack Box',
            '✓ Fresh Juice & Water',
            '✓ Bibs',
            '✓ Cash Prizes for Winners',
            '✓ Trophies for 1st, 2nd, 3rd Place'
        ];

        includes.forEach((item, index) => {
            doc.text(item, 20, currentY + 7 + (index * 5));
        });

        // Footer
        currentY = currentY + 7 + (includes.length * 5) + 10;
        doc.setFillColor(240, 240, 240);
        doc.rect(0, currentY, pageWidth, 20, 'F');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text('For queries: events.thefitcubs@gmail.com | www.thefitcubs.com', pageWidth / 2, currentY + 8, { align: 'center' });
        doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, currentY + 14, { align: 'center' });

        // Save PDF
        doc.save(`FitCubs_Receipt_${registrationId}.pdf`);
    };

    if (loading) {
        return (
            <div className="payment-page">
                <div className="container">
                    <div className="payment-card">
                        <p>Loading registration details...</p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="payment-page">
            <div className="container">
                <div className="payment-card success-card">
                    <div className="success-icon-wrapper">
                        <FaCheckCircle className="success-icon" />
                    </div>

                    <h1>Registration Successful!</h1>
                    <p className="success-message">
                        Congratulations! Your child has been successfully registered for
                        The Fit Cubs Kids Mini Marathon 2025.
                    </p>

                    {registrationData && (
                        <div className="registration-details">
                            <h3>Registration Details</h3>
                            <div className="detail-row">
                                <span className="detail-label">Child Name:</span>
                                <span className="detail-value">{registrationData.childName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Category:</span>
                                <span className="detail-value">{registrationData.category}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Registration ID:</span>
                                <span className="detail-value">{registrationData.id || registrationId}</span>
                            </div>
                            {transactionId && (
                                <div className="detail-row">
                                    <span className="detail-label">Transaction ID:</span>
                                    <span className="detail-value">{transactionId}</span>
                                </div>
                            )}
                            <div className="detail-row">
                                <span className="detail-label">Amount Paid:</span>
                                <span className="detail-value highlight">₹{registrationData.totalAmount?.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div className="info-box">
                        <h3>📧 Confirmation Email Sent</h3>
                        <p>
                            A detailed confirmation email has been sent to your registered email address.
                            Please check your inbox (and spam folder) for complete event details.
                        </p>
                    </div>

                    <div className="next-steps">
                        <h3>What's Next?</h3>
                        <ul>
                            <li>✅ Check your email for registration confirmation</li>
                            <li>✅ Save your registration ID for future reference</li>
                            <li>✅ Event reporting time will be shared via email closer to the date</li>
                            <li>✅ Bring the confirmation email on event day</li>
                        </ul>
                    </div>

                    <div className="event-reminder">
                        <h4>📅 Event Details</h4>
                        <p><strong>Date:</strong> 7th December 2025</p>
                        <p><strong>Venue:</strong> Attal Bihari Vajpayee, BBMP HSR Ground</p>
                        <p><strong>Location:</strong> HSR Layout, Bangalore</p>
                    </div>

                    <div className="included-items">
                        <h4>🎁 Your Registration Includes:</h4>
                        <div className="items-grid">
                            <div className="item">🏃 Marathon T-shirt</div>
                            <div className="item">🏅 Medal</div>
                            <div className="item">📜 Certificate</div>
                            <div className="item">🍱 Snack Box</div>
                            <div className="item">🥤 Fresh Juice & Water</div>
                            <div className="item">🔢 Bibs</div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <Link to="/" className="btn btn-primary">
                            <FaHome /> Back to Home
                        </Link>
                        <button className="btn btn-secondary" onClick={generatePDFReceipt}>
                            <FaDownload /> Download Receipt
                        </button>
                    </div>

                    <div className="support-info">
                        <p>
                            Need help? Contact us at <a href="mailto:thefitcubs@gmail.com">thefitcubs@gmail.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
