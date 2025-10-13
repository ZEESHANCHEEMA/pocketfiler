import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../apiInterceptor";
import { API_URL } from "../../../client";

// Create payment intent for project
export const createProjectPaymentIntent = createAsyncThunk(
  "createProjectPaymentIntent",
  async (data) => {
    try {
      console.log("🔵 [CREATE PAYMENT INTENT] Request:", {
        endpoint: `${API_URL}/api/stripe/project/payment-intent`,
        payload: data,
      });

      const res = await api.post(
        `${API_URL}/api/stripe/project/payment-intent`,
        data
      );

      console.log("✅ [CREATE PAYMENT INTENT] Success:", {
        status: res?.status,
        clientSecret:
          res?.data?.client_secret || res?.data?.clientSecret
            ? "***PRESENT***"
            : "MISSING",
        payment_intent_id: res?.data?.payment_intent_id,
        fullResponse: res?.data,
      });

      return {
        status: res?.status,
        data: res?.data?.data,
        clientSecret: res?.data?.client_secret || res?.data?.clientSecret,
        payment_intent_id: res?.data?.payment_intent_id,
      };
    } catch (error) {
      console.error("❌ [CREATE PAYMENT INTENT] Error:", {
        message: error?.response?.data?.error || error.message,
        status: error?.response?.status,
        fullError: error?.response?.data,
      });

      return {
        message:
          error?.response?.data?.error || "Failed to create payment intent",
        status: error?.response?.status,
      };
    }
  }
);

// Confirm payment for project
export const confirmProjectPayment = createAsyncThunk(
  "confirmProjectPayment",
  async (data) => {
    try {
      const res = await api.post(
        `${API_URL}/payment/confirm-project-payment`,
        data
      );

      return {
        status: res?.status,
        data: res?.data?.data,
        message: res?.data?.message,
      };
    } catch (error) {
      return {
        message: error?.response?.data?.error || "Failed to confirm payment",
        status: error?.response?.status,
      };
    }
  }
);

// Get payment status
export const getPaymentStatus = createAsyncThunk(
  "getPaymentStatus",
  async (paymentIntentId) => {
    try {
      const res = await api.get(`${API_URL}/payment/status/${paymentIntentId}`);

      return {
        status: res?.status,
        data: res?.data?.data,
      };
    } catch (error) {
      return {
        message: error?.response?.data?.error || "Failed to get payment status",
        status: error?.response?.status,
      };
    }
  }
);

// Get all payments for a project
export const getProjectPayments = createAsyncThunk(
  "getProjectPayments",
  async (projectId) => {
    try {
      const res = await api.get(`${API_URL}/payment/project/${projectId}`);

      return {
        status: res?.status,
        data: res?.data?.data,
      };
    } catch (error) {
      return {
        message:
          error?.response?.data?.error || "Failed to get project payments",
        status: error?.response?.status,
      };
    }
  }
);

// Request payment for project (send notification to client)
export const requestProjectPayment = createAsyncThunk(
  "requestProjectPayment",
  async (data) => {
    try {
      const res = await api.post(
        `${API_URL}/payment/request-project-payment`,
        data
      );

      return {
        status: res?.status,
        data: res?.data?.data,
        message: res?.data?.message,
      };
    } catch (error) {
      return {
        message: error?.response?.data?.error || "Failed to request payment",
        status: error?.response?.status,
      };
    }
  }
);

// Withdraw payment (transfer released funds to contractor Stripe account)
export const withdrawProjectPayment = createAsyncThunk(
  "withdrawProjectPayment",
  async (data) => {
    try {
      console.log("🟡 [WITHDRAW PAYMENT] Request:", {
        endpoint: `${API_URL}/api/stripe/withdraw`,
        payload: data,
      });

      const res = await api.post(`${API_URL}/api/stripe/withdraw`, data);

      console.log("✅ [WITHDRAW PAYMENT] Success:", {
        status: res?.status,
        message: res?.data?.message,
        data: res?.data,
      });

      return {
        status: res?.status,
        data: res?.data?.data,
        message: res?.data?.message,
      };
    } catch (error) {
      console.error("❌ [WITHDRAW PAYMENT] Error:", {
        message: error?.response?.data?.error || error.message,
        status: error?.response?.status,
        fullError: error?.response?.data,
      });

      return {
        message: error?.response?.data?.error || "Failed to withdraw payment",
        status: error?.response?.status,
      };
    }
  }
);

// ============= STRIPE CONNECT APIS =============

// Create Stripe Connect account for user (contractor)
export const createStripeConnectAccount = createAsyncThunk(
  "createStripeConnectAccount",
  async (data) => {
    try {
      console.log("🔵 [CREATE STRIPE ACCOUNT] Request:", {
        endpoint: `${API_URL}/api/stripe/connect/account`,
        payload: data,
      });

      const res = await api.post(`${API_URL}/api/stripe/connect/account`, data);

      const mappedAccountId =
        res?.data?.account?.id || res?.data?.account_id || res?.data?.id;

      console.log("✅ [CREATE STRIPE ACCOUNT] Success:", {
        status: res?.status,
        accountId: mappedAccountId,
        data: res?.data,
      });

      return {
        status: res?.status,
        data: res?.data,
        accountId: mappedAccountId,
        message: res?.data?.message,
      };
    } catch (error) {
      console.error("❌ [CREATE STRIPE ACCOUNT] Error:", {
        message: error?.response?.data?.error || error.message,
        status: error?.response?.status,
        fullError: error?.response?.data,
      });

      return {
        message:
          error?.response?.data?.error || "Failed to create Stripe account",
        status: error?.response?.status,
      };
    }
  }
);

// Create Stripe Connect account onboarding link
export const createStripeAccountLink = createAsyncThunk(
  "createStripeAccountLink",
  async (data) => {
    try {
      console.log("🔵 [CREATE ACCOUNT LINK] Request:", {
        endpoint: `${API_URL}/api/stripe/connect/account-link`,
        payload: data,
      });

      const res = await api.post(
        `${API_URL}/api/stripe/connect/account-link`,
        data
      );

      const onboardingUrl = res?.data?.link?.url || res?.data?.url;

      console.log("✅ [CREATE ACCOUNT LINK] Success:", {
        status: res?.status,
        url: onboardingUrl ? "URL present" : "URL missing",
        data: res?.data,
      });

      return {
        status: res?.status,
        data: res?.data,
        url: onboardingUrl,
        message: res?.data?.message,
      };
    } catch (error) {
      console.error("❌ [CREATE ACCOUNT LINK] Error:", {
        message: error?.response?.data?.error || error.message,
        status: error?.response?.status,
        fullError: error?.response?.data,
      });

      return {
        message:
          error?.response?.data?.error || "Failed to create account link",
        status: error?.response?.status,
      };
    }
  }
);

// Get Stripe Connect account status
export const getStripeAccountStatus = createAsyncThunk(
  "getStripeAccountStatus",
  async (userId) => {
    try {
      console.log("🔵 [GET ACCOUNT STATUS] Request:", {
        endpoint: `${API_URL}/api/stripe/account/status`,
        userId: userId,
      });

      const res = await api.get(`${API_URL}/api/stripe/account/status`, {
        params: { userId },
      });

      const accountStatus = res?.data?.account_status || res?.data?.status;
      const capabilityStatus = res?.data?.capability_status;
      const actionRequired = res?.data?.action_required;
      const stripeAccountId = res?.data?.stripe_account_id;

      // Derive booleans when backend returns compact fields
      const derivedDetailsSubmitted =
        typeof res?.data?.details_submitted === "boolean"
          ? res?.data?.details_submitted
          : accountStatus && accountStatus !== "incomplete";
      const derivedChargesEnabled =
        typeof res?.data?.charges_enabled === "boolean"
          ? res?.data?.charges_enabled
          : capabilityStatus === "active";
      const derivedPayoutsEnabled =
        typeof res?.data?.payouts_enabled === "boolean"
          ? res?.data?.payouts_enabled
          : capabilityStatus === "active";

      console.log("✅ [GET ACCOUNT STATUS] Success:", {
        status: res?.status,
        account_status: accountStatus,
        capability_status: capabilityStatus,
        action_required: actionRequired,
        stripe_account_id: stripeAccountId,
        details_submitted: derivedDetailsSubmitted,
        charges_enabled: derivedChargesEnabled,
        payouts_enabled: derivedPayoutsEnabled,
        data: res?.data,
      });

      return {
        status: res?.status,
        data: res?.data,
        accountStatus,
        capabilityStatus,
        actionRequired,
        stripeAccountId,
        detailsSubmitted: derivedDetailsSubmitted,
        chargesEnabled: derivedChargesEnabled,
        payoutsEnabled: derivedPayoutsEnabled,
      };
    } catch (error) {
      console.error("❌ [GET ACCOUNT STATUS] Error:", {
        message: error?.response?.data?.error || error.message,
        status: error?.response?.status,
        fullError: error?.response?.data,
      });

      return {
        message: error?.response?.data?.error || "Failed to get account status",
        status: error?.response?.status,
      };
    }
  }
);

// ================= NEW: Payments listing APIs =================

// Get my payments available for withdrawal (paginated)
export const getMyStripePayments = createAsyncThunk(
  "getMyStripePayments",
  async ({ status, page = 1, limit = 10 } = {}) => {
    try {
      // request debug removed
      const params = {};
      if (status) params.status = status; // pending | succeeded | released | payout_requested | payout_paid | failed
      params.page = page;
      params.limit = limit;

      const res = await api.get(`${API_URL}/api/stripe/payments/my`, {
        params,
      });

      // success debug removed

      return {
        status: res?.status,
        data: res?.data?.payments, // Changed from res?.data?.data to res?.data?.payments
        pagination: res?.data?.pagination,
      };
    } catch (error) {
      // error debug removed
      return {
        message:
          error?.response?.data?.error || "Failed to fetch my Stripe payments",
        status: error?.response?.status,
      };
    }
  }
);

// Get payment details by payment_intent_id
export const getStripePaymentByIntentId = createAsyncThunk(
  "getStripePaymentByIntentId",
  async (paymentIntentId) => {
    try {
      // request debug removed
      const res = await api.get(
        `${API_URL}/api/stripe/payments/${paymentIntentId}`
      );

      // success debug removed

      return {
        status: res?.status,
        data: res?.data?.data || res?.data, // Support both wrapped and unwrapped responses
      };
    } catch (error) {
      // error debug removed
      return {
        message:
          error?.response?.data?.error ||
          "Failed to fetch payment by payment_intent_id",
        status: error?.response?.status,
      };
    }
  }
);
