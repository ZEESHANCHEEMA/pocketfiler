import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";

export const createNft = createAsyncThunk("creteNft", async (data) => {
  try {
    const res = await api.post(`${API_URL}/api/createnfts`, data);
    // localStorage.setItem("token", res?.data?.token);

    return {
      status: res?.status,
      data: res?.data?.data,
    };
  } catch (error) {
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});
