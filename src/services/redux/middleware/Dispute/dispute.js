import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../apiInterceptor";
import { API_URL } from "../../../client";

export const getAllProjectDispute = createAsyncThunk(
  "getAllProjectDispute",
  async (data) => {
    try {
      const res = await api.get(
        `${API_URL}/project/getProjectsWithOutPagination/${data}`
      );
      console.log("INSIDE GET All PRoject of USER ", res);

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
  }
);

export const chatSendMsgDispute = createAsyncThunk(
  "chatSendMsgDispute",
  async (data) => {
    try {
      console.log("Inside CHatbox Dispute Modal");

      const res = await api.post(
        `${API_URL}/project/createMessengerHistoryy`,
        data
      );
      console.log("Inside CHATbox Dispute Modal", res);

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
  }
);
export const MessageSandDispute = createAsyncThunk(
  "MessageSandDispute",
  async (data) => {
    try {
      const res = await api.post(
        `${API_URL}/help/createMessageOndispute`,
        data
      );

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
  }
);

export const getChatHistoryDispute = createAsyncThunk(
  "getChatHistoryDispute",
  async (data) => {
    try {
      const res = await api.get(
        `${API_URL}/project/getMessengerHistoryByProjectIdd/${data}`
      );
      // localStorage.setItem("token", res?.data?.token);
      console.log("Inside Get CHAT HISTORY Dispute ", res);
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
  }
);

export const WithDrawDispute = createAsyncThunk(
  "WithDrawDispute",
  async (data) => {
    try {
      const res = await api.get(
        `${API_URL}/project/getProjectsWithDisputes/${data?.id}`
      );
      // localStorage.setItem("token", res?.data?.token);
      console.log("Inside get Withdraw Dispute ", res);
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
  }
);

export const DisputeData = createAsyncThunk("DisputeData", async (data) => {
  try {
    let url = `${API_URL}/project/getDisputesByUserId/${data?.id}`;

    const queryParams = new URLSearchParams();

    if (data?.page) {
      queryParams.append("page", data.page);
    }
    if (data?.year) {
      queryParams.append("year", data.year);
    }
    if (data?.search) {
      queryParams.append("search", data.search);
    }

    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const res = await api.get(url);

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

export const getDisputeMessages = createAsyncThunk(
  "getDisputeMessages",
  async (data) => {
    try {
      const res = await api.get(
        `${API_URL}/help/listUserMessages?disputeId=${data?.id}`
      );
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
  }
);
