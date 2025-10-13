# 🚨 Stripe Connect Backend Issues

## Critical Issues Found

### ❌ Issue 1: 401 Unauthorized on Stripe Account Status Check

**Endpoint:** `GET /api/stripe/account/status?userId={userId}`

**Problem:**

- Frontend is sending valid JWT token in Authorization header
- Backend is returning `401 Unauthorized` with error: `"User not authenticated"`
- Other authenticated endpoints (like `/auth/getuserByid`) work fine with the same token

**Request Details:**

```javascript
GET http://13.57.230.64:4000/api/stripe/account/status?userId=68db84eb1ccfbdb27cef9958

Headers:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Response:**

```javascript
Status: 401 Unauthorized
{
  "error": "User not authenticated"
}
```

**Expected Behavior:**
Should validate the JWT token and return Stripe account status.

**Evidence Token Works:**
The same token successfully authenticates these requests immediately after:

- ✅ `GET /auth/getuserByid/68db84eb1ccfbdb27cef9958` → 200 OK
- ✅ `GET /help/getNotifications/68db84eb1ccfbdb27cef9958` → 200 OK

---

### ❌ Issue 2: 400 Bad Request on Create Stripe Account

**Endpoint:** `POST /api/stripe/connect/account`

**Problem:**
Backend Stripe account configuration is not signed up for Stripe Connect.

**Request Details:**

```javascript
POST http://13.57.230.64:4000/api/stripe/connect/account

Payload:
{
  "userId": "68db84eb1ccfbdb27cef9958",
  "email": "testemail113@example.com"
}
```

**Response:**

```javascript
Status: 400 Bad Request
{
  "error": "You can only create new accounts if you've signed the Stripe Services Agreement. Learn how to do at https://stripe.com/docs/connect."
}
```

**Root Cause:**
The Stripe API key being used on the backend hasn't been approved for Connect.

**Required Backend Action:**

1. Go to Stripe Dashboard → Connect → Get Started
2. Sign the Stripe Connect Services Agreement
3. Enable Connect for your Stripe account
4. Update backend to use Connect-enabled API keys

---

## Frontend Status

### ✅ What's Working:

1. **Token Storage:** Token is now correctly stored in localStorage during login
2. **Email Storage:** Email is now stored for Stripe account creation
3. **User Data Storage:** Complete user object is stored
4. **Token Transmission:** Token is being sent with `Bearer` prefix in Authorization header
5. **Other Auth Endpoints:** All other authenticated endpoints work correctly

### 🔧 What Frontend Did:

```javascript
// Login.js - Now stores all required data
localStorage.setItem("token", res?.payload?.token);
localStorage.setItem("email", res?.payload?.data?.email || email);
localStorage.setItem("user", JSON.stringify(res?.payload?.data));
localStorage.setItem("_id", res?.payload?.data?._id);
localStorage.setItem("role", res?.payload?.data?.role);
localStorage.setItem("name", res?.payload?.data?.fullname);
```

### 🔍 Debug Information Added:

Enhanced logging in `apiInterceptor.js` now shows:

- Token preview (first 20 chars)
- Full request headers
- Complete request/response cycle

---

## Backend TODO

### 1. Fix Authentication Middleware for Stripe Endpoints

**Likely Issue:**

```javascript
// ❌ Current (likely)
router.get("/api/stripe/account/status", stripeAuth, getAccountStatus);

// Should be:
// ✅ Use same auth middleware as other working endpoints
router.get("/api/stripe/account/status", authMiddleware, getAccountStatus);
```

**Check:**

- Is `/api/stripe/*` using a different authentication middleware?
- Is the middleware correctly parsing `Bearer {token}`?
- Is the middleware checking the correct JWT secret?

### 2. Enable Stripe Connect

**Steps:**

1. Login to Stripe Dashboard (https://dashboard.stripe.com)
2. Navigate to **Connect** section
3. Click **Get Started**
4. Review and sign the **Stripe Connect Services Agreement**
5. Complete onboarding process
6. Verify API keys have Connect permissions

**Test in Stripe Dashboard:**

```bash
# Use Stripe CLI to test
stripe accounts create \
  --type=express \
  --country=US \
  --email=test@example.com \
  --capabilities[card_payments][requested]=true \
  --capabilities[transfers][requested]=true
```

If this returns an error, your account isn't set up for Connect.

---

## API Endpoint Summary

### Current Stripe Connect Endpoints:

1. **Get Account Status**

   - `GET /api/stripe/account/status?userId={userId}`
   - ❌ Returns 401 Unauthorized (Auth issue)

2. **Create Connect Account**

   - `POST /api/stripe/connect/account`
   - Body: `{ userId, email }`
   - ❌ Returns 400 Bad Request (Stripe not configured)

3. **Get Account Link**
   - `POST /api/stripe/connect/account-link`
   - Body: `{ userId }`
   - ⚠️ Not tested yet (depends on account creation)

---

## Test After Fixes

### 1. Test Authentication:

```bash
# Should return 200 OK
curl -X GET "http://13.57.230.64:4000/api/stripe/account/status?userId=68db84eb1ccfbdb27cef9958" \
  -H "Authorization: Bearer {valid_token}" \
  -H "Content-Type: application/json"
```

### 2. Test Account Creation:

```bash
# Should return 200 OK with accountId
curl -X POST "http://13.57.230.64:4000/api/stripe/connect/account" \
  -H "Authorization: Bearer {valid_token}" \
  -H "Content-Type: application/json" \
  -d '{"userId": "68db84eb1ccfbdb27cef9958", "email": "test@example.com"}'
```

---

## Questions for Backend Team

1. **Authentication:**

   - What authentication middleware is being used for `/api/stripe/*` endpoints?
   - Is it different from the middleware used for `/auth/*` endpoints?
   - Can you verify the JWT secret is the same?

2. **Stripe Configuration:**

   - Has the Stripe account been set up for Connect?
   - Are you using Test mode or Live mode API keys?
   - Have you signed the Connect Services Agreement?

3. **Environment:**
   - What Stripe API version are you using?
   - Are the Stripe secret keys properly set in environment variables?

---

## Contact

**Frontend Developer:** ✅ Token storage and transmission verified
**Backend Team:** Please fix:

1. Authentication middleware for Stripe endpoints
2. Enable Stripe Connect on your Stripe account

**Status:** Blocked on backend fixes
