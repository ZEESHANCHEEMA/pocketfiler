import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";

export const dashboardCountApi = createAsyncThunk(
  "dashboardCount",
  async (data) => {
    try {
      console.log("Fetching dashboard count for user:", data);
      const res = await api.get(
        `${API_URL}/association/countUserInProjectaddClientAndcontact/${data}`
      );
      console.log("Dashboard count API response:", res);

      return {
        status: res?.status,
        data: res?.data,
      };
    } catch (error) {
      console.error("Dashboard count API error:", error);
      console.error("Error response:", error?.response?.data);
      return {
        message:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch dashboard count",
        status: error?.response?.status || 500,
      };
    }
  }
);
