import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";


export const helpCenter = createAsyncThunk("helpCenter ", async (data) => {
  try {
    console.log("Inside Help Center Modal");
    
    const res = await api.post(`${API_URL}/help/helpCenter`, data);
    console.log("Inside Help Center modal res",res);

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

export const createDispute = createAsyncThunk("createDispute ", async (data) => {
    try {
      console.log("Inside  Create Dispute Modal  ");
      
      const res = await api.post(`${API_URL}/help/createDispute`, data);
      console.log("Inside  Create Dispute Modal res",res);
  
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