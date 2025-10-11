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
