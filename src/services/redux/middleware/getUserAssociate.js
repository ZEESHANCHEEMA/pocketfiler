import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";

export const getUserAssociate = createAsyncThunk("getuserassociate", async (data) => {
    try {
      const res = await api.get(`${API_URL}/association/getAssociates/${data}`);
      // localStorage.setItem("token", res?.data?.token);
      console.log("inside get user Associates", res)
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