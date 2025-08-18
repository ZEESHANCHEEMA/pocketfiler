import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";

export const sharecontract = createAsyncThunk("sharecontract", async (data) => {
  try {
    console.log("Inside Share Contract");
    const res = await api.post(`${API_URL}/contract/shareContract`, data);
    // localStorage.setItem("token", res?.data?.token);
    return {
      status: res?.status,
      data: res?.data?.data,
      token: res?.data?.token,
    };
  } catch (error) {
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});

export const savecontract = createAsyncThunk("savecontract", async (data) => {
  try {
    console.log("Inside Save Contract");
    const res = await api.post(`${API_URL}/contract/createContract`, data);
    // localStorage.setItem("token", res?.data?.token);
    return {
      status: res?.status,
      data: res?.data?.data,
      token: res?.data?.token,
    };
  } catch (error) {
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});


export const viewcontract = createAsyncThunk("viewcontract", async (data) => {
  try {
    console.log("🔍 viewcontract middleware: Fetching contract with ID:", data);
    const res = await api.get(`${API_URL}/contract/viewContract/${data}`);
    console.log("🔍 viewcontract middleware: API response:", res);
    console.log("🔍 viewcontract middleware: Response data:", res?.data);
    console.log("🔍 viewcontract middleware: Contract data:", res?.data?.data);
    console.log("🔍 viewcontract middleware: Full response structure:", {
      status: res?.status,
      data: res?.data?.data,
      hasData: !!res?.data?.data,
      dataKeys: res?.data?.data ? Object.keys(res?.data?.data) : 'No data'
    });
    return {
      status: res?.status,
      data: res?.data?.data,
    };
  } catch (error) {
    console.error("❌ viewcontract middleware: Error:", error);
    console.error("❌ viewcontract middleware: Error response:", error?.response);
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});

export const editcontract = createAsyncThunk("editcontract", async (data) => {
  try {
    console.log("Inside EDIT Contract");
    const res = await api.put(`${API_URL}/contract/updateContract/${data.id}`, data);
    // localStorage.setItem("token", res?.data?.token);
    return {
      status: res?.status,
      data: res?.data?.data,
      token: res?.data?.token,
    };
  } catch (error) {
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});

export const editcontractSignDate = createAsyncThunk("editcontractSignDate", async (data) => {
  try {
    console.log("Inside EDIT Contract SIGN DATE");
    const res = await api.put(`${API_URL}/contract/updatesignatureContract/${data.id}`, data);
    console.log("Inside EDIT Contract SIGN DATE", res);

    // localStorage.setItem("token", res?.data?.token);
    return {
      status: res?.status,
      data: res?.data?.data,
      token: res?.data?.token,
    };
  } catch (error) {
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});