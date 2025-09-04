import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../apiInterceptor";
import { API_URL } from "../../../client";

// ─── Async Thunk ───────────────────────────────────────────
export const newChat = createAsyncThunk("newChat", async (data) => {
  try {
    console.log("🚀 newChat API called with data:", data);
    console.log("📡 Making POST request to:", `${API_URL}/ai/chat`);
    const res = await api.post(`${API_URL}/ai/chat`, data);
    console.log("✅ newChat API response:", res);
    return {
      status: res?.status,
      data: res?.data?.data,
      token: res?.data?.token,
    };
  } catch (error) {
    console.log("❌ newChat API error:", error);
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});

export const aiMessage = createAsyncThunk("aiMessage", async ({ data, chatId }) => {
    try {
      console.log("🚀 aiMessage API called with data:", data, "chatId:", chatId);
      console.log("📡 Making POST request to:", `${API_URL}/ai/chat/${chatId}/message`);
      
      // Create a custom axios instance with longer timeout for AI requests
      const aiApi = axios.create({
        baseURL: API_URL,
        timeout: 30000, // 30 seconds timeout for AI requests
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Add auth token if available
      const token = localStorage.getItem('token');
      if (token) {
        aiApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const res = await aiApi.post(`/ai/chat/${chatId}/message`, data);
      console.log("✅ aiMessage API response:", res);
      return {
        status: res?.status,
        data: res?.data?.data,
        token: res?.data?.token,
      };
    } catch (error) {
      console.log("❌ aiMessage API error:", error);
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        return {
          message: 'Request timeout. The AI is taking longer than expected to respond. Please try again.',
          status: 'TIMEOUT',
        };
      } else if (error.response) {
        return {
          message: error.response.data?.error || error.response.data?.message || 'Server error occurred',
          status: error.response.status,
        };
      } else if (error.request) {
        return {
          message: 'Network error. Please check your connection and try again.',
          status: 'NETWORK_ERROR',
        };
      } else {
        return {
          message: error.message || 'An unexpected error occurred',
          status: 'UNKNOWN_ERROR',
        };
      }
    }
  });
  
// ─── Get All Chat History ──────────────────────────────────
export const getChatHistory = createAsyncThunk(
    "getChatHistory",
    async () => {
      try {
        console.log("🚀 getChatHistory API called");
        console.log("📡 Making GET request to:", `${API_URL}/ai/chat`);
        const res = await api.get(`${API_URL}/ai/chat`);
        console.log("✅ getChatHistory API response:", res);
        return {
          status: res?.status,
          data: res?.data?.data,
        };
      } catch (error) {
        console.log("❌ getChatHistory API error:", error);
        return {
          message: error?.response?.data?.error,
          status: error?.response?.status,
        };
      }
    }
  );

// ─── Get Single Chat History ───────────────────────────────
export const getSingleChatHistory = createAsyncThunk(
    "getSingleChatHistory",
    async (chatId) => {
      try {
        console.log("🚀 getSingleChatHistory API called with chatId:", chatId);
        const apiUrl = `${API_URL}/ai/chat/${chatId}/history`;
        console.log("📡 Making GET request to:", apiUrl);
        console.log("🔗 Full API URL:", apiUrl);
        const res = await api.get(apiUrl);
        console.log("✅ getSingleChatHistory API response:", res);
        return {
          status: res?.status,
          data: res?.data?.data, // This contains {chat: {...}, messages: [...]}
        };
      } catch (error) {
        console.log("❌ getSingleChatHistory API error:", error);
        console.log("❌ Error response:", error?.response);
        console.log("❌ Error status:", error?.response?.status);
        console.log("❌ Error data:", error?.response?.data);
        return {
          message: error?.response?.data?.error || error?.message,
          status: error?.response?.status,
        };
      }
    }
  );
  
// ─── Delete Chat ───────────────────────────────────────────
export const deleteChat = createAsyncThunk("deleteChat", async (chatId) => {
  try {
    console.log("🚀 deleteChat API called with chatId:", chatId);
    console.log("📡 Making DELETE request to:", `${API_URL}/ai/chat/${chatId}`);
    const res = await api.delete(`${API_URL}/ai/chat/${chatId}`);
    console.log("✅ deleteChat API response:", res);
    return {
      status: res?.status,
      message: res?.data?.message,
    };
  } catch (error) {
    console.log("❌ deleteChat API error:", error);
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
      console.log("🚀 updateChatTitle API called with chatId:", chatId, "title:", title);
      console.log("📡 Making PUT request to:", `${API_URL}/ai/chat/${chatId}/title`);
      const res = await api.put(`${API_URL}/ai/chat/${chatId}/title`, {
        title,
      });
      console.log("✅ updateChatTitle API response:", res);
      return {
        status: res?.status,
        data: res?.data?.data,
      };
    } catch (error) {
      console.log("❌ updateChatTitle API error:", error);
      return {
        message: error?.response?.data?.error,
        status: error?.response?.status,
      };
    }
  }
);