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
    const res = await api.get(`${API_URL}/contract/viewContract/${data}`);
    // localStorage.setItem("token", res?.data?.token);
    console.log("inside view contract api", res)
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