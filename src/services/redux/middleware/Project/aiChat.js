import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../apiInterceptor";
import { API_URL } from "../../../client";

// ─── Async Thunk ───────────────────────────────────────────
export const newChat = createAsyncThunk("newChat", async (data) => {
  try {
    console.log("newChat");
    const res = await api.post(`${API_URL}/ai/chat`, data);
    console.log("res", res);
    return {
      status: res?.status,
      data: res?.data?.data,
      token: res?.data?.token,
    };
  } catch (error) {
    console.log("error newChat", error);
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});
export const aiMessage = createAsyncThunk("aiMessage", async ({ data, chatId }) => {
    try {
      console.log("data", data, chatId);
      const res = await api.post(`${API_URL}/ai/chat/${chatId}/message`, data);
      return {
        status: res?.status,
        data: res?.data?.data,
        token: res?.data?.token,
      };
    } catch (error) {
      console.log("error ai message", error);
      return {
        message: error?.response?.data?.error,
        status: error?.response?.status,
      };
    }
  });
  
// ─── Get Chat History ──────────────────────────────────────
export const getChatHistory = createAsyncThunk(
    "getChatHistory",
    async (chatId) => {
      try {
        const res = await api.get(`${API_URL}/ai/chat/${chatId}/history`);
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
  
  // ─── Delete Chat ───────────────────────────────────────────
  export const deleteChat = createAsyncThunk("deleteChat", async (chatId) => {
    try {
      const res = await api.delete(`${API_URL}/ai/chat/${chatId}`);
      return {
        status: res?.status,
        message: res?.data?.message,
      };
    } catch (error) {
      return {
        message: error?.response?.data?.error,
        status: error?.response?.status,
      };
    }
  });
  
  // ─── Update Chat Title ─────────────────────────────────────
  export const updateChatTitle = createAsyncThunk(
    "updateChatTitle",
    async ({ chatId, title }) => {
      try {
        const res = await api.put(`${API_URL}/ai/chat/${chatId}/title`, {
          title,
        });
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