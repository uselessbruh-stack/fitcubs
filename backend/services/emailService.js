const axios = require('axios');

// Get reporting time based on category
const getReportingTime = (category) => {
  // All categories now have unified timing: 8:00 AM reporting, 8:30 AM event start
  return { reportTime: '8:00 AM', flagOff: '8:30 AM' };
};

// Brevo API configuration
const BREVO_API_KEY = process.env.EMAIL_PASSWORD; // Using the same API key
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmailViaBrevo = async (to, subject, htmlContent) => {
  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: 'The Fit Cubs',
          email: process.env.EMAIL_USER
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent
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
  } catch (error) {
    console.error('Brevo API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Send OTP verification email
const sendOTPEmail = async (email, otp, parentName = 'User') => {
  const emailSubject = '🔐 Email Verification - The Fit Cubs Kids Mini Marathon 2025';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #35AEBF, #9CBC1D); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px dashed #35AEBF; }
        .otp-code { font-size: 36px; font-weight: bold; color: #35AEBF; letter-spacing: 8px; margin: 20px 0; }
        .warning { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Email Verification</h1>
          <p>The Fit Cubs Kids Mini Marathon 2025</p>
        </div>
        <div class="content">
          <p>Dear <strong>${parentName}</strong>,</p>
          <p>Thank you for starting your registration for The Fit Cubs Kids Mini Marathon 2025!</p>
          
          <p>To verify your email address and proceed with payment, please use the following One-Time Password (OTP):</p>

          <div class="otp-box">
            <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 0; color: #666; font-size: 14px;">Valid for 5 minutes</p>
          </div>

          <div class="warning">
            <p style="margin: 0;"><strong>⏰ Important:</strong></p>
            <ul style="margin: 10px 0;">
              <li>This OTP is valid for <strong>5 minutes only</strong></li>
              <li>Do not share this OTP with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>

          <p>After verification, you'll be able to complete the payment and registration process.</p>

          <p>For any queries, feel free to reach us:</p>
          <p>
            📧 Email: <a href="mailto:events.thefitcubs@gmail.com">events.thefitcubs@gmail.com</a><br>
            📞 Contact: +91 XXXXXXXXXX
          </p>
        </div>
        <div class="footer">
          <p>© 2025 The Fit Cubs. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
    `;

  try {
    await sendEmailViaBrevo(email, emailSubject, emailHtml);
    console.log(`OTP email sent successfully to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

const sendRegistrationEmail = async (registrationData, paymentStatus, qrCodeBase64 = null) => {
  const { childName, parentName, parentEmail, parentContact, category, tshirtSize, totalAmount, transactionId, registrationId } = registrationData;

  // Get reporting time for the category
  const timing = getReportingTime(category);

  const emailSubject = paymentStatus === 'SUCCESS'
    ? '🎉 Registration Successful - The Fit Cubs Kids Mini Marathon 2025'
    : '❌ Registration Failed - The Fit Cubs Kids Mini Marathon 2025';

  let emailHtml = paymentStatus === 'SUCCESS' ? `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #35AEBF, #9CBC1D); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #35AEBF; }
        .highlight { color: #9CBC1D; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; }
        .includes { background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .includes li { margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Registration Confirmed!</h1>
          <p>The Fit Cubs Kids Mini Marathon 2025</p>
        </div>
        <div class="content">
          <p>Dear <strong>${parentName}</strong>,</p>
          <p>Thank you for registering <strong>${childName}</strong> for The Fit Cubs Kids Mini Marathon 2025! We're excited to see your child participate in this amazing event.</p>
          
          <div class="details">
            <h3 style="color: #35AEBF; margin-top: 0;">Registration Details</h3>
            <div class="detail-row">
              <span class="detail-label">Child's Name:</span>
              <span>${childName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Category:</span>
              <span>${category}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">T-shirt Size:</span>
              <span>${tshirtSize}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Contact:</span>
              <span>${parentContact}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount Paid:</span>
              <span class="highlight">₹${totalAmount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Transaction ID:</span>
              <span>${transactionId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Registration ID:</span>
              <span>${registrationId}</span>
            </div>
          </div>

          ${qrCodeBase64 ? `
          <div style="background: #f0f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px dashed #35AEBF;">
            <h3 style="color: #35AEBF; margin-top: 0;">📱 Your Event QR Code</h3>
            <p style="color: #666; margin-bottom: 20px;">
              <strong>IMPORTANT:</strong> Your QR code is attached to this email as a PNG file
            </p>
            <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
              📎 <strong>Download the attached QR code image</strong> and show it at the event entrance for check-in
            </p>
            <p style="color: #666; font-size: 14px;">
              File name: FitCubs_QR_${childName.replace(/\s+/g, '_')}.png
            </p>
            <p style="color: #999; font-size: 13px; margin-top: 15px; font-style: italic;">
              If you didn't receive the QR code attachment, please email us at <a href="mailto:events.thefitcubs@gmail.com" style="color: #35AEBF;">events.thefitcubs@gmail.com</a>
            </p>
          </div>
          ` : ''}

          <div class="includes">
            <h3 style="color: #9CBC1D; margin-top: 0;">🎁 What's Included:</h3>
            <ul>
              <li>✅ Marathon T-shirt</li>
              <li>✅ Medal for all participants</li>
              <li>✅ Participation Certificate</li>
              <li>✅ Snack Box</li>
              <li>✅ Fresh Juice & Water</li>
              <li>✅ Bibs</li>
            </ul>
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h3 style="margin-top: 0; color: #856404;">📅 Event Details</h3>
            <p><strong>Date:</strong> 7th December 2025</p>
            <p><strong>Venue:</strong> Attal Bihari Vajpayee, BBMP HSR Ground</p>
            <p><strong>Location:</strong> <a href="https://maps.app.goo.gl/KQvpDrQJXhy82WXr8" target="_blank" rel="noopener noreferrer" style="color: #35AEBF;">HSR Layout, Bangalore</a></p>
            <p style="margin-top: 15px; padding: 10px; background: #fff; border-radius: 5px; border-left: 3px solid #dc3545;">
              <strong style="color: #dc3545;">⏰ IMPORTANT - Event Schedule:</strong><br>
              <strong>📍 Reporting Time: 8:00 AM</strong><br>
              <strong>👕 T-Shirt Collection: 8:00 AM onwards</strong><br>
              <strong>🏁 Event Start Time: 8:30 AM</strong><br>
              <span style="color: #666; font-size: 14px;">Please arrive by 8:00 AM for registration check-in and T-shirt collection</span>
            </p>
          </div>

          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50; margin-top: 20px;">
            <h3 style="margin-top: 0; color: #2e7d32;">👔 Dress Code</h3>
            <p><strong>For Kids:</strong></p>
            <ul style="color: #333; margin: 10px 0;">
              <li>✅ Sports Shoes (mandatory)</li>
              <li>✅ Black or Blue Full Track Pants</li>
              <li>✅ Event T-shirt (will be provided at venue at 8 AM)</li>
            </ul>
            <p><strong>For Parents:</strong></p>
            <ul style="color: #333; margin: 10px 0;">
              <li>✅ White T-shirt</li>
              <li>✅ Track Pants or Jeans</li>
              <li>✅ Sports Shoes or Comfortable Footwear</li>
            </ul>
          </div>

          <p style="margin-top: 20px;">
            <strong>📱 Important:</strong> Please save this QR code or bring this email on the event day for entry and to collect your items (T-shirt, Medal, Certificate, Snack Box, etc.)
          </p>

          <p>For any queries, feel free to reach us:</p>
          <p>
            📧 Email: <a href="mailto:thefitcubs@gmail.com">thefitcubs@gmail.com</a><br>
            🌐 Website: <a href="https://www.thefitcubs.com">www.thefitcubs.com</a>
          </p>
        </div>
        <div class="footer">
          <p><strong>The Fit Cubs</strong></p>
          <p>Building Champions, One Step at a Time 🏃‍♂️💪</p>
        </div>
      </div>
    </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F47475, #333); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Registration Failed</h1>
          <p>The Fit Cubs Kids Mini Marathon 2025</p>
        </div>
        <div class="content">
          <p>Dear <strong>${parentName}</strong>,</p>
          <p>We're sorry, but your registration for <strong>${childName}</strong> could not be completed due to a payment issue.</p>
          
          <p><strong>Transaction ID:</strong> ${transactionId || 'N/A'}</p>
          
          <p>Please try registering again. If the payment was deducted from your account, it will be refunded within 5-7 business days.</p>

          <p>For assistance, please contact us:</p>
          <p>
            📧 Email: <a href="mailto:thefitcubs@gmail.com">thefitcubs@gmail.com</a><br>
            🌐 Website: <a href="https://www.thefitcubs.com">www.thefitcubs.com</a>
          </p>
        </div>
        <div class="footer">
          <p><strong>The Fit Cubs</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Prepare QR code attachment for Brevo API
  const attachment = qrCodeBase64 ? [{
    name: `FitCubs_QR_${childName.replace(/\s+/g, '_')}.png`,
    content: qrCodeBase64.split('base64,')[1]
  }] : [];

  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: 'The Fit Cubs',
          email: process.env.EMAIL_USER
        },
        to: [{ email: parentEmail }],
        subject: emailSubject,
        htmlContent: emailHtml,
        attachment: attachment
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
  } catch (error) {
    console.error('Error sending registration email:', error.response?.data || error.message);
    throw error;
  }
};

// Send timing update email to existing registrations
const sendTimingUpdateEmail = async (registrationData, qrCodeBase64 = null) => {
  const {
    childName,
    parentName,
    parentEmail,
    category,
    tshirtSize,
    totalAmount,
    transactionId,
    registrationId,
    parentContact
  } = registrationData;

  const emailSubject = '🔔 Important Update - Event Timing Changed | The Fit Cubs Kids Mini Marathon 2025';

  // Prepare QR code attachment
  const attachment = qrCodeBase64 ? [{
    name: `FitCubs_QR_${childName.replace(/\s+/g, '_')}.png`,
    content: qrCodeBase64.split('base64,')[1]
  }] : [];

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F47475, #35AEBF); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .update-banner { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 5px solid #ffc107; margin: 20px 0; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #35AEBF; }
        .highlight { color: #9CBC1D; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; }
        .new-timing { color: #dc3545; font-weight: bold; font-size: 1.1em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Important Update!</h1>
          <p>The Fit Cubs Kids Mini Marathon 2025</p>
        </div>
        <div class="content">
          <p>Dear <strong>${parentName}</strong>,</p>
          
          <div class="update-banner">
            <h3 style="margin-top: 0; color: #856404;">⚠️ IMPORTANT: Event Timing Updated</h3>
            <p style="font-size: 16px; margin: 15px 0;">
              We have <strong>updated the event timings</strong> to ensure a better experience for all participants. Please note the new schedule below.
            </p>
          </div>

          <p>This is regarding the registration of <strong>${childName}</strong> for The Fit Cubs Kids Mini Marathon 2025.</p>

          <div style="background: #ffebee; padding: 20px; border-radius: 8px; border-left: 5px solid #dc3545; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #c62828;">⏰ Updated Event Schedule</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0;"><strong>📍 Reporting Time:</strong></td>
                <td style="padding: 10px 0; text-align: right;">
                  <span class="new-timing">8:00 AM</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;"><strong>👕 T-Shirt Collection:</strong></td>
                <td style="padding: 10px 0; text-align: right;">
                  <span class="new-timing">8:00 AM onwards</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;"><strong>🏁 Event Start Time:</strong></td>
                <td style="padding: 10px 0; text-align: right;">
                  <span class="new-timing">8:30 AM</span>
                </td>
              </tr>
            </table>
            <p style="margin-top: 15px; color: #666; font-size: 14px;">
              ⚠️ <strong>Please arrive by 8:00 AM</strong> for registration check-in and to collect your child's T-shirt at the venue.
            </p>
          </div>

          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50; margin-top: 20px;">
            <h3 style="margin-top: 0; color: #2e7d32;">👔 Dress Code (Please Follow)</h3>
            <p><strong>For Kids:</strong></p>
            <ul style="color: #333; margin: 10px 0;">
              <li>✅ Sports Shoes (mandatory)</li>
              <li>✅ Black or Blue Full Track Pants</li>
              <li>✅ Event T-shirt (will be provided at venue at 8 AM)</li>
            </ul>
            <p><strong>For Parents:</strong></p>
            <ul style="color: #333; margin: 10px 0;">
              <li>✅ White T-shirt</li>
              <li>✅ Track Pants or Jeans</li>
              <li>✅ Sports Shoes or Comfortable Footwear</li>
            </ul>
          </div>

          <div class="details">
            <h3 style="color: #35AEBF; margin-top: 0;">📋 Your Registration Details</h3>
            <div class="detail-row">
              <span class="detail-label">Child's Name:</span>
              <span>${childName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Category:</span>
              <span>${category}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Registration ID:</span>
              <span>${registrationId}</span>
            </div>
          </div>

          ${qrCodeBase64 ? `
          <div style="background: #f0f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px dashed #35AEBF;">
            <h3 style="color: #35AEBF; margin-top: 0;">📱 Your Event QR Code (Reattached)</h3>
            <p style="color: #666; margin-bottom: 15px;">
              Your QR code is attached to this email for your convenience
            </p>
            <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
              📎 <strong>Download and show this QR code</strong> at the event entrance for check-in
            </p>
            <p style="color: #666; font-size: 14px;">
              File name: FitCubs_QR_${childName.replace(/\s+/g, '_')}.png
            </p>
          </div>
          ` : ''}

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 20px;">
            <h3 style="margin-top: 0; color: #856404;">📅 Event Details (Unchanged)</h3>
            <p><strong>Date:</strong> 7th December 2025 (Saturday)</p>
            <p><strong>Venue:</strong> Attal Bihari Vajpayee, BBMP HSR Ground</p>
            <p><strong>Location:</strong> <a href="https://maps.app.goo.gl/KQvpDrQJXhy82WXr8" target="_blank" rel="noopener noreferrer" style="color: #35AEBF;">HSR Layout, Bangalore</a></p>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #1565c0; margin-top: 0;">📝 Important Reminders</h3>
            <ul style="color: #333;">
              <li>🕗 <strong>Arrive by 8:00 AM</strong> - Gates open for registration and T-shirt collection</li>
              <li>👕 T-shirts will be distributed at the venue (not before)</li>
              <li>📱 Bring your QR code (attached) for quick check-in</li>
              <li>👟 Ensure kids wear proper sports shoes</li>
              <li>💧 Stay hydrated - water will be provided</li>
            </ul>
          </div>

          <p style="margin-top: 30px; padding: 15px; background: #f0f0f0; border-radius: 8px; font-style: italic; color: #555;">
            We apologize for any inconvenience caused by this timing change. This adjustment ensures a smoother event experience for all participants.
          </p>

          <p style="margin-top: 20px;">For any queries, feel free to reach us:</p>
          <p>
            📧 Email: <a href="mailto:thefitcubs@gmail.com" style="color: #35AEBF;">thefitcubs@gmail.com</a><br>
            🌐 Website: <a href="https://www.thefitcubs.com" style="color: #35AEBF;">www.thefitcubs.com</a>
          </p>

          <p style="margin-top: 30px; font-weight: bold; color: #35AEBF;">
            Looking forward to seeing ${childName} at the event! 🏃‍♂️💪
          </p>
        </div>
        <div class="footer">
          <p><strong>The Fit Cubs</strong></p>
          <p>Building Champions, One Step at a Time 🏃‍♂️💪</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: 'The Fit Cubs',
          email: process.env.EMAIL_USER
        },
        to: [{ email: parentEmail }],
        subject: emailSubject,
        htmlContent: emailHtml,
        attachment: attachment
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
  } catch (error) {
    console.error('Error sending timing update email:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { sendRegistrationEmail, sendOTPEmail, sendTimingUpdateEmail };
