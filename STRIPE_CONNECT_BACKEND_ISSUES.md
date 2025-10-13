# Stripe Connect Backend Issues - 401 Unauthorized

## 🔴 Current Issue

All Stripe Connect endpoints are returning **401 Unauthorized** error, even though the authentication token is being sent correctly.

---

## 📊 Test Results

### ✅ What's Working:

- Frontend has valid authentication token
- Token is stored in localStorage
- Token is being sent in request headers as `Bearer <token>`
- API interceptor is adding token to all requests

### ❌ What's Not Working:

- `GET /api/stripe/account/status` → **401 Unauthorized**
- Backend returns: `"User not authenticated"`

---

## 🔍 Console Logs from Frontend

### Auth Check (Token is Present):

```javascript
🔑 [AUTH CHECK]: {
  hasToken: true ✅
  hasUserId: true ✅
  hasEmail: false
  tokenPreview: "eyJhbGciOiJIUzI1NiIs..."
}
```

### API Request:

```javascript
🔵 [GET ACCOUNT STATUS] Request: {
  endpoint: "http://13.57.230.64:4000/api/stripe/account/status"
  userId: "68d0b84eb1ccfbdb27cef9958"
}

API Request to: http://13.57.230.64:4000/api/stripe/account/status
Request method: get
Token added to request ✅
```

### API Response (Error):

```javascript
❌ GET http://13.57.230.64:4000/api/stripe/account/status?userId=68d0b84eb1ccfbdb27cef9958
Status: 401 (Unauthorized)

❌ API Error Response:
URL: http://13.57.230.64:4000/api/stripe/account/status
Status: 401
Status Text: Unauthorized
Error Data: {
  error: "User not authenticated"
}

📊 [STRIPE ACCOUNT STATUS] Response: {
  status: 401
  isConnected: undefined
  detailsSubmitted: undefined
  chargesEnabled: undefined
  payoutsEnabled: undefined
  fullResponse: {
    message: "User not authenticated"
    status: 401
  }
}
```

---

## 🔧 Backend Endpoints That Need Fixing

### 1. GET /api/stripe/account/status

**Current Status:** ❌ Returns 401 even with valid token

**Request:**

```http
GET /api/stripe/account/status?userId=68d0b84eb1ccfbdb27cef9958
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  Content-Type: application/json
```

**Expected Response (200):**

```json
{
  "status": "active",
  "account_id": "acct_xxx",
  "details_submitted": true,
  "charges_enabled": true,
  "payouts_enabled": true
}
```

**Current Response (401):**

```json
{
  "error": "User not authenticated"
}
```

---

### 2. POST /api/stripe/connect/account

**Current Status:** ⚠️ Not tested yet (assuming same 401 issue)

**Request:**

```http
POST /api/stripe/connect/account
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "userId": "68d0b84eb1ccfbdb27cef9958",
  "email": "user@example.com"
}
```

**Expected Response (200/201):**

```json
{
  "account_id": "acct_xxx",
  "message": "Stripe account created successfully"
}
```

---

### 3. POST /api/stripe/connect/account-link

**Current Status:** ⚠️ Not tested yet (assuming same 401 issue)

**Request:**

```http
POST /api/stripe/connect/account-link
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "account_id": "acct_xxx",
  "refresh_url": "http://localhost:3000/projects",
  "return_url": "http://localhost:3000/projects"
}
```

**Expected Response (200/201):**

```json
{
  "url": "https://connect.stripe.com/setup/s/xxx",
  "message": "Account link created successfully"
}
```

---

## 🐛 Possible Backend Issues

### 1. **Authentication Middleware Not Applied**

```javascript
// Backend might be missing auth middleware
// ❌ BAD:
router.get("/api/stripe/account/status", getAccountStatus);

// ✅ GOOD:
router.get("/api/stripe/account/status", authenticateToken, getAccountStatus);
```

### 2. **Token Verification Failing**

```javascript
// Backend might not be verifying token correctly
// Check if token secret matches
// Check if token is expired
```

### 3. **Wrong Auth Header Format Expected**

```javascript
// Frontend sends: "Bearer <token>"
// Backend might expect: just "<token>" without "Bearer"
// Or vice versa
```

### 4. **Endpoint Not Implemented Yet**

```javascript
// Endpoint exists but returns 401 for all requests
// Need to implement actual Stripe Connect logic
```

---

## ✅ What Backend Needs to Do

### Step 1: Verify Authentication Middleware

1. Check if `/api/stripe/account/status` has auth middleware
2. Verify token is being extracted from `Authorization` header
3. Check token validation logic
4. Ensure user is attached to request after validation

### Step 2: Test Token Manually

```bash
# Get token from frontend localStorage
# Test with curl or Postman:

curl -X GET "http://13.57.230.64:4000/api/stripe/account/status?userId=68d0b84eb1ccfbdb27cef9958" \
  -H "Authorization: Bearer <actual-token-here>" \
  -H "Content-Type: application/json"
```

### Step 3: Implement Stripe Connect Endpoints

```javascript
// Example backend code:

// 1. Get Account Status
router.get(
  "/api/stripe/account/status",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.query.userId || req.user.id;

      // Get user's Stripe account ID from database
      const user = await User.findById(userId);

      if (!user.stripeAccountId) {
        return res.json({
          status: "not_connected",
          details_submitted: false,
          charges_enabled: false,
          payouts_enabled: false,
        });
      }

      // Check status with Stripe
      const account = await stripe.accounts.retrieve(user.stripeAccountId);

      res.json({
        status: "active",
        account_id: account.id,
        details_submitted: account.details_submitted,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 2. Create Stripe Account
router.post(
  "/api/stripe/connect/account",
  authenticateToken,
  async (req, res) => {
    try {
      const { userId, email } = req.body;

      // Create Stripe Connect account
      const account = await stripe.accounts.create({
        type: "express",
        email: email,
        capabilities: {
          transfers: { requested: true },
        },
      });

      // Save account ID to user
      await User.findByIdAndUpdate(userId, {
        stripeAccountId: account.id,
      });

      res.json({
        account_id: account.id,
        message: "Stripe account created successfully",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 3. Create Account Link
router.post(
  "/api/stripe/connect/account-link",
  authenticateToken,
  async (req, res) => {
    try {
      const { account_id, refresh_url, return_url } = req.body;

      const accountLink = await stripe.accountLinks.create({
        account: account_id,
        refresh_url: refresh_url,
        return_url: return_url,
        type: "account_onboarding",
      });

      res.json({
        url: accountLink.url,
        message: "Account link created successfully",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
```

---

## 🔄 Frontend Workaround Applied

**Temporarily disabled Stripe Connect check** to allow testing withdrawal flow:

```javascript
// Frontend now skips isStripeConnected validation
// This allows testing /api/stripe/withdraw endpoint
// Re-enable when Stripe Connect endpoints are fixed
```

---

## 📝 Action Items for Backend Team

- [ ] Fix authentication for `/api/stripe/account/status`
- [ ] Implement `/api/stripe/connect/account` endpoint
- [ ] Implement `/api/stripe/connect/account-link` endpoint
- [ ] Test all three endpoints return 200 with valid token
- [ ] Notify frontend team when fixed
- [ ] Frontend will re-enable Stripe Connect check

---

## 🧪 How to Test When Fixed

1. Frontend will open withdraw modal
2. Check console for: `🔍 [STRIPE ACCOUNT STATUS] Checking...`
3. Should see: `📊 Response: { status: 200, ... }`
4. Modal should show green badge: "✅ Stripe account connected"
5. Or show "Set up Stripe Account" button if not connected

---

## 📞 Contact

If you need more details or have questions, check the frontend console logs or ask for screenshots of the Network tab in Chrome DevTools.
