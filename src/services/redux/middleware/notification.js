import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";;


export const getUserNotifications = createAsyncThunk("getUserNotifications", async (data) => {
    try {
      const res = await api.get(`${API_URL}/help/getNotifications/${data}`);
      // localStorage.setItem("token", res?.data?.token);
      console.log("Inside Get User Notifications ", res)
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


  export const NotificationStatus = createAsyncThunk("NotificationStatus", async (data) => {
    try {
      const res = await api.post(`${API_URL}/help/readNotification`,data);
      // localStorage.setItem("token", res?.data?.token);
      console.log("Inside NOTIFICATION STATUS ", res)
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

  export const markAllRead = createAsyncThunk("markAllRead", async (data) => {
    try {
      const res = await api.post(`${API_URL}/help/markAllReadNotification`,data);
      // localStorage.setItem("token", res?.data?.token);
      console.log("Inside mark all as read  ", res)
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
  
 