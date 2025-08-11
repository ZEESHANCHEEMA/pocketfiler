import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apiInterceptor";
import { API_ENDPOINTS } from "../../../config/apiConfig";

export const getContractTemplates = createAsyncThunk("getContractTemplates", async () => {
  try {
    console.log("📋 Fetching contract templates from API");
    const res = await api.get(API_ENDPOINTS.CONTRACT.GET_TEMPLATES);
    
    console.log("📋 Contract templates API response:", {
      status: res?.status,
      dataLength: res?.data?.data?.length || 0,
      message: res?.data?.message,
      fullResponse: res?.data
    });
    
    // Log individual template details
    if (res?.data?.data && Array.isArray(res.data.data)) {
      console.log("📋 Individual template details:", res.data.data.map(template => ({
        id: template._id,
        title: template.title,
        category: template.category,
        hasContent: !!template.content,
        contentLength: template.content?.length || 0,
        description: template.description?.substring(0, 50) + '...'
      })));
    }
    
    return {
      status: res?.status,
      data: res?.data?.data, // templates array from response
      message: res?.data?.message,
    };
  } catch (error) {
    console.log("❌ Contract templates error details:", {
      error: error,
      response: error?.response,
      data: error?.response?.data,
      status: error?.response?.status
    });
    
    // Handle different error response structures
    let errorMessage = 'Failed to fetch contract templates';
    let errorStatus = 500;
    
    if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    if (error?.response?.status) {
      errorStatus = error.response.status;
    }
    
    return {
      message: errorMessage,
      status: errorStatus,
    };
  }
});

export const getContractByTemplateId = createAsyncThunk("getContractByTemplateId", async (templateId) => {
  try {
    console.log("🔍 Fetching contract details for template ID:", templateId);
    const res = await api.get(`${API_ENDPOINTS.CONTRACT.GET_CONTRACT_BY_ID}/${templateId}`);
    
    console.log("📄 Contract details API response:", res);
    
    return {
      status: res?.status,
      data: res?.data?.data, // contract details from response
      message: res?.data?.message,
    };
  } catch (error) {
    console.log("❌ Contract details error details:", {
      error: error,
      response: error?.response,
      data: error?.response?.data,
      status: error?.response?.status
    });
    
    // Handle different error response structures
    let errorMessage = 'Failed to fetch contract details';
    let errorStatus = 500;
    
    if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    if (error?.response?.status) {
      errorStatus = error.response.status;
    }
    
    return {
      message: errorMessage,
      status: errorStatus,
    };
  }
});

export const createContractFromTemplate = createAsyncThunk("createContractFromTemplate", async (templateData) => {
  try {
    console.log("📝 Creating contract from template:", templateData);
    const res = await api.post(API_ENDPOINTS.CONTRACT.CREATE_CONTRACT_API, templateData);
    
    console.log("✅ Contract creation response:", res);
    
    return {
      status: res?.status,
      data: res?.data?.data,
      message: res?.data?.message,
    };
  } catch (error) {
    console.log("❌ Contract creation error:", error);
    
    let errorMessage = 'Failed to create contract from template';
    let errorStatus = 500;
    
    if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    if (error?.response?.status) {
      errorStatus = error.response.status;
    }
    
    return {
      message: errorMessage,
      status: errorStatus,
    };
  }
}); 