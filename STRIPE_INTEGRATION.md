# Stripe Payment Integration for PocketFiler

## Overview

This document provides comprehensive information about the Stripe payment integration for project payments in PocketFiler-V2-web.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Features](#features)
4. [Components](#components)
5. [Redux State Management](#redux-state-management)
6. [API Endpoints](#api-endpoints)
7. [Usage](#usage)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Installation

The following Stripe packages have been installed:

```bash
yarn add stripe @stripe/stripe-js @stripe/react-stripe-js
```

### Package Descriptions:

- **stripe**: Node.js library for Stripe API (backend integration)
- **@stripe/stripe-js**: Stripe.js library for client-side payments
- **@stripe/react-stripe-js**: React components for building Stripe payment forms

---

## Configuration

### 1. Environment Variables

Add the following to your `.env` file:

```bash
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 2. API Configuration

The Stripe configuration is located in `src/config/apiConfig.js`:

```javascript
export const API_CONFIG = {
  // Stripe Configuration
  STRIPE_PUBLISHABLE_KEY:
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_51QUy2J...", // Add your Stripe publishable key here
  ENABLE_STRIPE: true, // Set to false to disable Stripe payments
};
```

### 3. API Endpoints

Payment endpoints are configured in `src/config/apiConfig.js`:

```javascript
PAYMENT: {
  CREATE_PROJECT_PAYMENT_INTENT: "/payment/create-project-payment-intent",
  CONFIRM_PROJECT_PAYMENT: "/payment/confirm-project-payment",
  GET_PAYMENT_STATUS: "/payment/status",
  GET_PROJECT_PAYMENTS: "/payment/project",
}
```

---

## Features

### ✅ Implemented Features:

1. **Project Payment Modal**

   - Stripe Elements integration for secure payment processing
   - Real-time payment validation
   - Custom styling matching PocketFiler's design system
   - Responsive design for mobile and desktop

2. **Payment Request System**

   - Request payment from clients
   - Send payment notifications
   - Direct payment option with Stripe

3. **Redux State Management**

   - Complete payment flow state management
   - Error handling and loading states
   - Payment history tracking

4. **Payment UI/UX**
   - Beautiful gradient-styled payment buttons
   - Smooth animations and transitions
   - Accessibility features (ARIA labels, keyboard navigation)
   - Success/Error feedback with toast notifications

---

## Components

### 1. ProjectPayment Modal

**Location:** `src/Components/Modals/ProjectPayment/ProjectPayment.js`

**Props:**

- `show` (boolean): Controls modal visibility
- `onHide` (function): Callback when modal is closed
- `projectData` (object): Project information
- `paymentAmount` (number): Pre-filled payment amount (optional)

**Features:**

- Stripe Elements integration
- Two-step payment process (amount entry → payment processing)
- Payment summary display
- Real-time error handling

**Usage:**

```jsx
<ProjectPayment
  show={paymentModalShow}
  onHide={() => setPaymentModalShow(false)}
  projectData={ProjectData}
  paymentAmount={100.0}
/>
```

### 2. PaymentForm Component

**Location:** `src/Components/Modals/ProjectPayment/PaymentForm.js`

**Props:**

- `projectData` (object): Project details
- `amount` (string/number): Payment amount
- `description` (string): Payment description
- `onSuccess` (function): Success callback
- `onCancel` (function): Cancel callback

**Features:**

- Stripe PaymentElement integration
- Client-side payment confirmation
- Backend payment verification
- Error handling with user-friendly messages

### 3. RequestPayment Modal (Enhanced)

**Location:** `src/Components/Modals/Organization/RequestPayment/RequestPayment.js`

**Props:**

- `show` (boolean): Modal visibility
- `onHide` (function): Close callback
- `projectData` (object): Project information
- `clientName` (string): Client name for display
- `paymentAmount` (number): Requested payment amount

**Features:**

- Dual functionality: Request payment OR Pay now
- Integration with ProjectPayment modal
- Notification system for payment requests
- Beautiful gradient-styled buttons

**Usage:**

```jsx
<RequestPayment
  show={requestPaymentShow}
  onHide={() => setRequestPaymentShow(false)}
  projectData={ProjectData}
  clientName="John Doe"
  paymentAmount={500.0}
/>
```

---

## Redux State Management

### Payment Slice

**Location:** `src/services/redux/slices/Payment/paymentSlice.js`

**State Structure:**

```javascript
{
  loading: false,
  error: null,
  clientSecret: null,
  paymentIntent: null,
  paymentStatus: null,
  projectPayments: [],
  paymentConfirmation: null,
}
```

**Actions:**

- `clearPaymentState`: Reset all payment state
- `clearPaymentError`: Clear error messages

### Payment Middleware

**Location:** `src/services/redux/middleware/Payment/payment.js`

**Available Actions:**

1. **createProjectPaymentIntent**
   - Creates a Stripe payment intent
   - Returns client secret for payment processing
2. **confirmProjectPayment**

   - Confirms payment on backend after Stripe processing
   - Updates project payment status

3. **getPaymentStatus**

   - Retrieves payment status by payment intent ID

4. **getProjectPayments**

   - Gets all payments for a specific project

5. **requestProjectPayment**
   - Sends payment request notification to client

**Usage Example:**

```javascript
import { createProjectPaymentIntent } from "../../services/redux/middleware/Payment/payment";

const handlePayment = () => {
  const paymentData = {
    projectId: "project123",
    amount: 100.0,
    currency: "usd",
    description: "Project milestone payment",
    userId: "user123",
    clientId: "client456",
  };

  dispatch(createProjectPaymentIntent(paymentData)).then((res) => {
    if (res?.payload?.status === 200) {
      // Payment intent created successfully
    }
  });
};
```

---

## API Endpoints

### Backend Requirements

Your backend should implement the following endpoints:

#### 1. Create Payment Intent

**Endpoint:** `POST /payment/create-project-payment-intent`

**Request Body:**

```json
{
  "projectId": "string",
  "amount": "number",
  "currency": "string",
  "description": "string",
  "userId": "string",
  "clientId": "string"
}
```

**Response:**

```json
{
  "status": 200,
  "clientSecret": "pi_xxx_secret_xxx",
  "data": {
    "paymentIntentId": "pi_xxx",
    "amount": 10000,
    "currency": "usd"
  }
}
```

#### 2. Confirm Payment

**Endpoint:** `POST /payment/confirm-project-payment`

**Request Body:**

```json
{
  "projectId": "string",
  "paymentIntentId": "string",
  "amount": "number",
  "description": "string"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Payment confirmed successfully",
  "data": {
    "paymentId": "pay_xxx",
    "status": "succeeded"
  }
}
```

#### 3. Get Payment Status

**Endpoint:** `GET /payment/status/:paymentIntentId`

**Response:**

```json
{
  "status": 200,
  "data": {
    "paymentIntentId": "pi_xxx",
    "status": "succeeded",
    "amount": 10000
  }
}
```

#### 4. Get Project Payments

**Endpoint:** `GET /payment/project/:projectId`

**Response:**

```json
{
  "status": 200,
  "data": [
    {
      "id": "pay_xxx",
      "amount": 10000,
      "status": "succeeded",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 5. Request Payment

**Endpoint:** `POST /payment/request-project-payment`

**Request Body:**

```json
{
  "projectId": "string",
  "userId": "string",
  "clientId": "string",
  "amount": "number",
  "message": "string"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Payment request sent successfully"
}
```

---

## Usage

### Integration in ProjectActivities Page

**Location:** `src/Pages/Projects/ProjectActivities/ProjectActivities.js`

The payment button has been integrated into the project activities page:

```jsx
<button
  className="ProjectActivities__box-btn"
  style={{
    marginLeft: 24,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    color: "white",
  }}
  onClick={() => {
    setRequestPaymentShow(true);
  }}
  tabIndex="0"
  aria-label="Request or make payment"
>
  Payment
</button>
```

### Payment Flow

1. **User clicks "Payment" button** on project activities page
2. **RequestPayment modal opens** with two options:
   - Request Payment (sends notification to client)
   - Pay Now (opens Stripe payment modal)
3. **If "Pay Now" is clicked:**
   - ProjectPayment modal opens
   - User enters payment amount and description
   - User clicks "Proceed to Payment"
   - Stripe PaymentElement loads
   - User enters card details
   - Payment is processed
   - Backend confirms payment
   - Success message displayed
4. **Payment history** is stored and can be retrieved

---

## Testing

### Test Mode

Use Stripe test cards for testing:

**Successful Payment:**

- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Payment Requires Authentication:**

- Card: `4000 0025 0000 3155`

**Payment Declined:**

- Card: `4000 0000 0000 9995`

### Testing Checklist

- [ ] Create payment intent with valid data
- [ ] Process payment with test card
- [ ] Handle payment errors gracefully
- [ ] Test payment confirmation flow
- [ ] Verify payment status retrieval
- [ ] Test mobile responsive design
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

---

## Troubleshooting

### Common Issues

#### 1. "Stripe is not defined" Error

**Solution:** Ensure Stripe.js is loaded before components mount:

```javascript
const stripePromise = loadStripe(API_CONFIG.STRIPE_PUBLISHABLE_KEY);
```

#### 2. "Invalid API Key" Error

**Solution:**

- Check your `.env` file has correct publishable key
- Ensure key starts with `pk_test_` for test mode
- Verify key in `apiConfig.js`

#### 3. Payment Intent Creation Fails

**Solution:**

- Verify backend endpoint is running
- Check request payload format
- Review backend logs for errors
- Ensure Stripe secret key is configured on backend

#### 4. Payment Element Not Appearing

**Solution:**

- Verify `clientSecret` is received from backend
- Check browser console for Stripe errors
- Ensure Elements provider wraps PaymentElement

#### 5. Redux State Not Updating

**Solution:**

- Verify payment reducer is added to store
- Check Redux DevTools for action dispatches
- Ensure proper action naming in middleware

---

## Security Considerations

1. **Never expose Stripe secret key** in frontend code
2. **Always use HTTPS** in production
3. **Validate payment amounts** on backend
4. **Implement rate limiting** for payment endpoints
5. **Log payment activities** for audit trails
6. **Use Stripe webhooks** for reliable payment confirmation
7. **Implement proper error handling** to prevent payment data leaks

---

## Next Steps

### Recommended Enhancements:

1. **Payment History Page**

   - Display all project payments
   - Filter and search payments
   - Export payment reports

2. **Recurring Payments**

   - Set up subscription-based payments
   - Automatic payment reminders

3. **Multi-Currency Support**

   - Allow payments in different currencies
   - Automatic currency conversion

4. **Payment Analytics**

   - Dashboard for payment metrics
   - Revenue tracking charts

5. **Refund System**

   - Implement refund functionality
   - Partial refund support

6. **Invoice Generation**
   - Automatic invoice creation
   - PDF invoice downloads

---

## Support

For issues or questions:

- Check the [Stripe Documentation](https://stripe.com/docs)
- Review [Stripe React Documentation](https://stripe.com/docs/stripe-js/react)
- Contact the development team

---

## License

This integration is part of the PocketFiler project and follows the project's license terms.

---

**Last Updated:** October 10, 2025
**Version:** 1.0.0
**Author:** PocketFiler Development Team
