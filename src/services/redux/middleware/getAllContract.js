import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";

export const getAllContract = createAsyncThunk("getcontract", async (data) => {
  try {
    const params = {
      page: data?.page,
      year: data?.year,
    };
    if (data?.search) {
      params.search = data?.search;
    }
    const res = await api.get(`${API_URL}/contract/getContract/${data?.id}`, {
      params,
    });
    console.log("inside get all contract", res);
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
