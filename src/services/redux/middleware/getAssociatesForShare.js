import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";

// GET /association/getAssociatesForShare/{userId}
export const getAssociatesForShare = createAsyncThunk(
  "associates/getForShare",
  async (userId) => {
    try {
      const res = await api.get(
        `${API_URL}/association/getAssociatesForShare/${userId}`
      );
      return {
        status: res?.status,
        data: res?.data?.data || res?.data,
      };
    } catch (error) {
      return {
        status: error?.response?.status || 500,
        data: error?.response?.data,
      };
    }
  }
);
