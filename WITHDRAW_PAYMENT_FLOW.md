# Withdraw Payment Flow Implementation

## Overview

This document explains how to implement the new withdraw payment flow with Stripe Connect integration.

## Flow Diagram

```
User clicks "Withdraw" button
         ↓
Check Stripe Connect Status
         ↓
    Is Connected?
    /           \
  YES            NO
   ↓              ↓
Show            Show
"Withdraw      "Stripe not
Payment"       connected"
Modal          Modal
   ↓              ↓
Process        Click
Withdrawal     "Connect Stripe"
               ↓
            Create Account
            & Get Link
               ↓
            Redirect to
            Stripe Onboarding
```

## Components Created

### 1. `StripeConnectModal.js`

Shows when user is NOT connected to Stripe.

- Displays Stripe logo
- "Connect Stripe" button
- Creates Stripe Connect account
- Redirects to Stripe onboarding

### 2. `WithdrawPaymentModal.js`

Shows when user IS connected to Stripe.

- Shows withdrawal amount
- "Withdraw payment" button
- Processes the withdrawal

## Usage Example

```javascript
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStripeAccountStatus } from "../services/redux/middleware/Payment/payment";
import StripeConnectModal from "../Components/Modals/ProjectPayment/StripeConnectModal";
import WithdrawPaymentModal from "../Components/Modals/ProjectPayment/WithdrawPaymentModal";

const ProjectDetails = ({ projectData }) => {
  const dispatch = useDispatch();
  const [showStripeConnect, setShowStripeConnect] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [checkingStripe, setCheckingStripe] = useState(false);

  const userId = localStorage.getItem("_id");

  // Get Stripe status from Redux
  const { isStripeConnected } = useSelector((state) => state.payment);

  const handleWithdrawClick = async () => {
    setCheckingStripe(true);

    try {
      // Check Stripe account status
      const result = await dispatch(getStripeAccountStatus(userId));

      if (result?.payload?.isStripeConnected) {
        // User is connected - show withdraw modal
        setShowWithdraw(true);
      } else {
        // User is NOT connected - show connect modal
        setShowStripeConnect(true);
      }
    } catch (error) {
      console.error("Error checking Stripe status:", error);
      // Default to showing connect modal on error
      setShowStripeConnect(true);
    } finally {
      setCheckingStripe(false);
    }
  };

  return (
    <div>
      {/* Your project details UI */}

      <button onClick={handleWithdrawClick} disabled={checkingStripe}>
        {checkingStripe ? "Checking..." : "Withdraw"}
      </button>

      {/* Stripe Connect Modal */}
      <StripeConnectModal
        show={showStripeConnect}
        onHide={() => setShowStripeConnect(false)}
      />

      {/* Withdraw Payment Modal */}
      <WithdrawPaymentModal
        show={showWithdraw}
        onHide={() => setShowWithdraw(false)}
        projectData={projectData}
        amount={projectData?.amount || projectData?.escrowAmount}
      />
    </div>
  );
};

export default ProjectDetails;
```

## Step-by-Step Integration

### Step 1: Import the Components

```javascript
import StripeConnectModal from "../Components/Modals/ProjectPayment/StripeConnectModal";
import WithdrawPaymentModal from "../Components/Modals/ProjectPayment/WithdrawPaymentModal";
import { getStripeAccountStatus } from "../services/redux/middleware/Payment/payment";
```

### Step 2: Add State Variables

```javascript
const [showStripeConnect, setShowStripeConnect] = useState(false);
const [showWithdraw, setShowWithdraw] = useState(false);
const [checkingStripe, setCheckingStripe] = useState(false);
```

### Step 3: Get Redux State

```javascript
const { isStripeConnected } = useSelector((state) => state.payment);
const userId = localStorage.getItem("_id");
```

### Step 4: Create Withdraw Handler

```javascript
const handleWithdrawClick = async () => {
  setCheckingStripe(true);

  try {
    const result = await dispatch(getStripeAccountStatus(userId));

    if (result?.payload?.isStripeConnected) {
      setShowWithdraw(true); // Connected - show withdraw modal
    } else {
      setShowStripeConnect(true); // Not connected - show connect modal
    }
  } catch (error) {
    console.error("Error:", error);
    setShowStripeConnect(true); // Default to connect modal
  } finally {
    setCheckingStripe(false);
  }
};
```

### Step 5: Add Modals to JSX

```javascript
<>
  {/* Your withdraw button */}
  <button onClick={handleWithdrawClick} disabled={checkingStripe}>
    {checkingStripe ? "Checking..." : "Withdraw"}
  </button>

  {/* Modals */}
  <StripeConnectModal
    show={showStripeConnect}
    onHide={() => setShowStripeConnect(false)}
  />

  <WithdrawPaymentModal
    show={showWithdraw}
    onHide={() => setShowWithdraw(false)}
    projectData={projectData}
    amount={projectData?.amount}
  />
</>
```

## Props Reference

### StripeConnectModal

| Prop     | Type     | Required | Description                    |
| -------- | -------- | -------- | ------------------------------ |
| `show`   | boolean  | Yes      | Controls modal visibility      |
| `onHide` | function | Yes      | Called when modal should close |

### WithdrawPaymentModal

| Prop          | Type     | Required | Description                        |
| ------------- | -------- | -------- | ---------------------------------- |
| `show`        | boolean  | Yes      | Controls modal visibility          |
| `onHide`      | function | Yes      | Called when modal should close     |
| `projectData` | object   | Yes      | Project data containing project ID |
| `amount`      | number   | Yes      | Amount to withdraw                 |

## Redux State

The components use the following Redux state:

```javascript
{
  payment: {
    isStripeConnected: boolean,
    detailsSubmitted: boolean,
    chargesEnabled: boolean,
    payoutsEnabled: boolean,
    loading: boolean,
    error: string | null
  }
}
```

## API Endpoints Used

1. **Get Account Status**

   - `GET /api/stripe/account/status?userId={userId}`
   - Checks if user has Stripe Connect account

2. **Create Connect Account**

   - `POST /api/stripe/connect/account`
   - Body: `{ userId, email }`
   - Creates new Stripe Connect account

3. **Get Account Link**

   - `POST /api/stripe/connect/account-link`
   - Body: `{ userId, accountId }`
   - Gets onboarding URL

4. **Withdraw Payment**
   - `POST /api/payment/withdraw`
   - Body: `{ userId, projectId, amount }`
   - Processes payment withdrawal

## Styling

Both modals use Bootstrap Modal and custom styles from `ProjectPayment.css`.

### Custom Classes:

- `.stripe-connect-modal` - For Stripe connect modal
- `.withdraw-payment-modal` - For withdraw payment modal

You can customize these in your CSS file:

```css
.stripe-connect-modal .modal-content {
  border-radius: 16px;
  border: none;
}

.withdraw-payment-modal .modal-content {
  border-radius: 16px;
  border: none;
}
```

## Error Handling

Both components include comprehensive error handling:

- Network errors
- Backend API errors
- Missing data (email, userId, projectId)
- Toast notifications for user feedback

## Success Flow

### Stripe Connect:

1. User clicks "Connect Stripe"
2. Creates Stripe account
3. Gets onboarding link
4. Redirects to Stripe
5. User completes onboarding
6. Returns to app (configured in Stripe Dashboard)

### Withdraw Payment:

1. User clicks "Withdraw payment"
2. API processes withdrawal
3. Success toast shown
4. Modal closes
5. Project data refreshes (if configured)

## Testing

### Test Stripe Connect Flow:

1. Click withdraw button
2. Should see "Stripe not connected" modal
3. Click "Connect Stripe"
4. Should redirect to Stripe onboarding

### Test Withdraw Flow:

1. Complete Stripe onboarding first
2. Click withdraw button
3. Should see "Document verification" modal
4. Click "Withdraw payment"
5. Should process successfully

## Troubleshooting

### Modal doesn't show:

- Check `show` prop is being set correctly
- Check console for errors
- Verify Redux state is populated

### Stripe Connect fails:

- Check email is stored in localStorage
- Verify backend Stripe Connect is enabled
- Check network tab for 401/400 errors

### Withdraw fails:

- Verify projectId is correct
- Check amount is valid number
- Ensure Stripe account is fully onboarded

## Next Steps

After backend fixes both issues:

1. Auth middleware for Stripe endpoints
2. Enable Stripe Connect

Then test the complete flow:

1. Login
2. Navigate to project
3. Click withdraw
4. Complete Stripe onboarding
5. Click withdraw again
6. Process payment successfully

---

**Files Created:**

- `/src/Components/Modals/ProjectPayment/StripeConnectModal.js`
- `/src/Components/Modals/ProjectPayment/WithdrawPaymentModal.js`

**Ready to use!** 🚀
