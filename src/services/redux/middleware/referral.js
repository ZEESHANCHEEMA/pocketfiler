import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";
import { API_ENDPOINTS } from "../../../config/apiConfig";

// Get referral link for the authenticated user
export const getReferralLink = createAsyncThunk(
  "referral/getLink",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching referral link");
      const res = await api.get(`${API_URL}${API_ENDPOINTS.REFERRAL.GET_LINK}`);
      console.log("Referral link response:", res);
      return {
        status: res?.status,
        data: res?.data?.data,
      };
    } catch (error) {
      console.error("Error fetching referral link:", error);
      return rejectWithValue({
        message:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to fetch referral link",
        status: error?.response?.status,
      });
    }
  }
);

// Get referral rewards and referred users count
export const getReferralRewards = createAsyncThunk(
  "referral/getRewards",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching referral rewards");
      const res = await api.get(
        `${API_URL}${API_ENDPOINTS.REFERRAL.GET_REWARDS}`
      );
      console.log("Referral rewards response:", res);
      return {
        status: res?.status,
        data: res?.data?.data,
      };
    } catch (error) {
      console.error("Error fetching referral rewards:", error);
      return rejectWithValue({
        message:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to fetch referral rewards",
        status: error?.response?.status,
      });
    }
  }
);

// Get all referrals of the authenticated user with name and referred date
export const getReferralList = createAsyncThunk(
  "referral/getList",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching referral list");
      const res = await api.get(`${API_URL}${API_ENDPOINTS.REFERRAL.GET_LIST}`);
      console.log("Referral list response:", res);
      return {
        status: res?.status,
        data: res?.data?.data,
      };
    } catch (error) {
      console.error("Error fetching referral list:", error);
      return rejectWithValue({
        message:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to fetch referral list",
        status: error?.response?.status,
      });
    }
  }
);

// Redeem referral points
export const redeemReferralPoints = createAsyncThunk(
  "referral/redeem",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Redeeming referral points:", data);
      const res = await api.post(
        `${API_URL}${API_ENDPOINTS.REFERRAL.REDEEM}`,
        data
      );
      console.log("Redeem referral response:", res);
      return {
        status: res?.status,
        data: res?.data?.data,
        message: res?.data?.message,
      };
    } catch (error) {
      console.error("Error redeeming referral points:", error);
      return rejectWithValue({
        message:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to redeem referral points",
        status: error?.response?.status,
      });
    }
  }
);
