import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";

export const dashboardCountApi = createAsyncThunk(
  "dashboardCount",
  async (data) => {
    try {
      const res = await api.get(
        `${API_URL}/association/countUserInProjectaddClientAndcontact/${data}`
      );

      return {
        status: res?.status,
        data: res?.data,
      };
    } catch (error) {
      return {
        message: error?.response?.data?.error,
        status: error?.response?.status,
      };
    }
  }
);
