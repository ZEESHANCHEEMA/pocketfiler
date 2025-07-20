import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";

export const getNftData = createAsyncThunk("nftData", async (data) => {
  try {
    const res = await api.get(`${API_URL}/api/getNftValue/${data}`);
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
});

export const getNftTableData = createAsyncThunk(
  "nftTableData",
  async (data) => {
    try {
      const res = await api.get(
        `${API_URL}/api/getNftTableData/${data?.id}?page=${data?.page}`
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

export const getReferalData = createAsyncThunk(
  "getReferalData",
  async (data) => {
    try {
      const res = await api.get(`${API_URL}/api/getReferalData/${data?.id}`);
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

export const getUserHistory = createAsyncThunk("getHistory", async (data) => {
  try {
    const res = await api.get(
      `${API_URL}/api/getUserHistory/${data?.id}?page=${data?.page}`
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
});

export const getBarChartGraph = createAsyncThunk(
  "getBarChartGraph",
  async (data) => {
    try {
      const res = await api.get(`${API_URL}/api/getGraphData/${data}`);
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

export const getListNft = createAsyncThunk("getListNft", async (data) => {
  try {
    const res = await api.get(`${API_URL}/api/getListNft/${data}`);
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
});
