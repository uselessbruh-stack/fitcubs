# The Fit Cubs Backend

Express.js backend for The Fit Cubs Kids Mini Marathon 2025 registration system.

## Features

- RESTful API endpoints
- Firebase Firestore integration
- PhonePe payment gateway integration
- Automated email notifications
- Error handling and logging

## API Endpoints

### Registration

#### POST `/api/registration/register`
Register a participant and initiate payment.

**Request Body:**
```json
{
  "childName": "string",
  "gender": "string",
  "age": "number",
  "dateOfBirth": "string",
  "parentName": "string",
  "parentContact": "string",
  "parentEmail": "string",
  "schoolName": "string",
  "medicalConditions": "string",
  "category": "string",
  "tshirtSize": "string",
  "breakfastCount": "number"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration initiated successfully",
  "registrationId": "string",
  "paymentUrl": "string",
  "merchantTransactionId": "string"
}
```

#### GET `/api/registration/:id`
Get registration details by ID.

### Payment

#### POST `/api/payment/callback`
PhonePe payment callback endpoint (handled automatically).

#### GET `/api/payment/status/:merchantTransactionId`
Check payment status.

### Health Check

#### GET `/health`
Check if server is running.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`

3. Start the server:
```bash
npm start
```

## Environment Variables

See main README.md for complete list of environment variables.

## Services

### Database Service
- `saveRegistration()` - Save registration to Firestore
- `updatePaymentStatus()` - Update payment status
- `getRegistrationById()` - Retrieve registration
- `getAllRegistrations()` - Get all registrations
- `getRegistrationsByStatus()` - Filter by status

### Payment Service
- `initiatePayment()` - Start PhonePe payment
- `checkPaymentStatus()` - Verify payment status
- `verifyChecksum()` - Validate callback signature

### Email Service
- `sendRegistrationEmail()` - Send confirmation/failure emails

## Security

- CORS configured for frontend URL
- PhonePe checksum verification
- Environment variables for sensitive data
- Input validation on all endpoints

## Error Handling

All endpoints include comprehensive error handling with appropriate HTTP status codes and error messages.
