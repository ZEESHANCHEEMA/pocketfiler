# Stripe Connect Integration - Usage Guide

## ✅ What We've Implemented

### **1. API Endpoints Added**

- ✅ `POST /api/stripe/connect/account` - Create Stripe Connect account
- ✅ `POST /api/stripe/connect/account-link` - Create onboarding link
- ✅ `GET /api/stripe/account/status` - Check account status

### **2. Redux Integration**

- ✅ Middleware functions in `payment.js`
- ✅ State management in `paymentSlice.js`
- ✅ Detailed logging for all API calls

### **3. Withdraw Payment Flow**

Updated `RequestPayment.js` modal with:

- ✅ Auto-check Stripe account status when modal opens
- ✅ Show account status (connected/not connected)
- ✅ Button to set up Stripe account if needed
- ✅ Automatic onboarding link creation
- ✅ Detailed console logs for debugging

---

## 🔍 Testing the Integration

### **Step 1: Open Withdraw Payment Modal**

When a user (contractor) clicks "Withdraw Payment", the modal will:

1. **Auto-check account status** → Calls `GET /api/stripe/account/status`
2. **Show status badge**:
   - 🟡 Yellow warning if not connected
   - 🟢 Green badge if connected

### **Step 2: Console Logs You'll See**

#### **When Modal Opens:**

```javascript
🔍 [STRIPE ACCOUNT STATUS] Checking for userId: "user123"
```

#### **Account Status Response:**

```javascript
📊 [STRIPE ACCOUNT STATUS] Response: {
  status: 200,
  isConnected: false,
  detailsSubmitted: false,
  chargesEnabled: false,
  payoutsEnabled: false,
  fullResponse: { /* full API response */ }
}
```

#### **If User Clicks "Set up Stripe Account":**

```javascript
🔵 [CREATE STRIPE ACCOUNT] Initiating for userId: "user123"

📊 [CREATE STRIPE ACCOUNT] Response: {
  status: 200,
  accountId: "acct_xxx",
  fullResponse: { /* full API response */ }
}

🔵 [CREATE ACCOUNT LINK] Initiating for accountId: "acct_xxx"

📊 [CREATE ACCOUNT LINK] Response: {
  status: 200,
  url: "https://connect.stripe.com/setup/xxx",
  fullResponse: { /* full API response */ }
}

🔗 [ONBOARDING URL]: https://connect.stripe.com/setup/xxx
```

#### **When User Clicks "Withdraw Payment":**

```javascript
💸 [WITHDRAW PAYMENT] Initiating withdrawal: {
  payment_intent_id: "pi_xxx",
  userId: "user123",
  isStripeConnected: true,
  detailsSubmitted: true,
  chargesEnabled: true,
  payoutsEnabled: true
}

📊 [WITHDRAW PAYMENT] Response: {
  status: 200,
  message: "Withdrawal successful",
  fullResponse: { /* full API response */ }
}
```

---

## 📱 UI Flow

### **Scenario 1: Stripe Not Connected**

```
┌─────────────────────────────────────────────┐
│  Document verification                      │
│                                             │
│  Amount in escrow: $10,000.00              │
│                                             │
│  ⚠️ Stripe account not set up.             │
│  Please complete Stripe onboarding         │
│  to receive payments.                       │
│                                             │
│  [Set up Stripe Account] (Yellow button)    │
│                                             │
│  [Withdraw payment] (Disabled)              │
└─────────────────────────────────────────────┘
```

**User clicks "Set up Stripe Account":**

1. Creates Stripe Connect account
2. Creates onboarding link
3. Opens Stripe onboarding in new window
4. User completes Stripe verification

### **Scenario 2: Stripe Connected**

```
┌─────────────────────────────────────────────┐
│  Document verification                      │
│                                             │
│  Amount in escrow: $10,000.00              │
│                                             │
│  ✅ Stripe account connected                │
│  Details: ✓ | Charges: ✓ | Payouts: ✓     │
│                                             │
│  [Withdraw payment] (Enabled)               │
└─────────────────────────────────────────────┘
```

**User clicks "Withdraw payment":**

1. Validates payment_intent_id exists
2. Calls withdraw API
3. Shows success/error message
4. Closes modal

---

## 🔧 API Call Details

### **1. Get Account Status**

**Request:**

```javascript
GET /api/stripe/account/status?userId=user123
```

**Expected Response:**

```json
{
  "status": "active",
  "account_id": "acct_xxx",
  "details_submitted": true,
  "charges_enabled": true,
  "payouts_enabled": true
}
```

### **2. Create Stripe Account**

**Request:**

```javascript
POST /api/stripe/connect/account
{
  "userId": "user123",
  "email": "user@example.com"
}
```

**Expected Response:**

```json
{
  "account_id": "acct_xxx",
  "message": "Stripe account created successfully"
}
```

### **3. Create Account Link**

**Request:**

```javascript
POST /api/stripe/connect/account-link
{
  "account_id": "acct_xxx",
  "refresh_url": "https://yourapp.com/refresh",
  "return_url": "https://yourapp.com/return"
}
```

**Expected Response:**

```json
{
  "url": "https://connect.stripe.com/setup/s/xxx",
  "message": "Account link created successfully"
}
```

### **4. Withdraw Payment**

**Request:**

```javascript
POST /api/stripe/withdraw
{
  "payment_intent_id": "pi_xxx"
}
```

**Expected Response:**

```json
{
  "message": "Funds transferred successfully",
  "transfer_id": "tr_xxx"
}
```

---

## 🐛 How to Debug

### **1. Check Browser Console**

Open Chrome DevTools (F12) → Console tab

Look for logs with emojis:

- 🔍 = Checking status
- 🔵 = API call initiated
- 📊 = Response received
- ✅ = Success
- ❌ = Error
- 💸 = Withdrawal
- 🔗 = URL

### **2. Check Network Tab**

Open Chrome DevTools → Network tab

Filter by:

- `/api/stripe/account/status`
- `/api/stripe/connect/account`
- `/api/stripe/connect/account-link`
- `/api/stripe/withdraw`

### **3. Check Redux State**

Install Redux DevTools extension

Check `state.payment`:

```javascript
{
  isStripeConnected: false,
  stripeAccountId: null,
  stripeAccountLink: null,
  detailsSubmitted: false,
  chargesEnabled: false,
  payoutsEnabled: false,
  loading: false,
  error: null
}
```

---

## 📝 What Logs to Share with Backend

When testing, share these logs:

1. **Account Status Check:**

```
🔍 [STRIPE ACCOUNT STATUS] Checking for userId: "xxx"
📊 [STRIPE ACCOUNT STATUS] Response: { ... }
```

2. **Account Creation:**

```
🔵 [CREATE STRIPE ACCOUNT] Initiating for userId: "xxx"
📊 [CREATE STRIPE ACCOUNT] Response: { ... }
```

3. **Account Link:**

```
🔵 [CREATE ACCOUNT LINK] Initiating for accountId: "xxx"
📊 [CREATE ACCOUNT LINK] Response: { ... }
```

4. **Withdrawal:**

```
💸 [WITHDRAW PAYMENT] Initiating withdrawal: { ... }
📊 [WITHDRAW PAYMENT] Response: { ... }
```

---

## ✅ Success Criteria

### **Account Status Check Works If:**

- ✅ Console shows status check log
- ✅ Modal shows correct badge (connected/not connected)
- ✅ No errors in console

### **Account Creation Works If:**

- ✅ Console shows account creation log
- ✅ Console shows account link log
- ✅ New window opens with Stripe onboarding URL
- ✅ URL starts with `https://connect.stripe.com/`

### **Withdrawal Works If:**

- ✅ Console shows withdrawal log
- ✅ Success toast appears
- ✅ Modal closes
- ✅ Backend confirms transfer

---

## 🚀 Next Steps

1. **Test all three APIs** in the withdraw modal
2. **Share console logs** with backend team
3. **Verify backend responses** match expected format
4. **Test onboarding flow** - complete Stripe verification
5. **Test withdrawal** after Stripe account is verified

---

## 🔑 Key Points

- All API calls have **detailed logging** 📝
- Status is **auto-checked** when modal opens ⚡
- User **can't withdraw** without Stripe account 🔒
- **Onboarding link** opens in new window 🪟
- All responses logged to **console** for debugging 🐛
