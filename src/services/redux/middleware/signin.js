import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../apiInterceptor";
import { API_ENDPOINTS } from "../../../config/apiConfig";
import { requestPermission } from "../../../utils/Firebase/firebase";

export const signup = createAsyncThunk("signin", async (data) => {
  try {
    console.log("Signup");
    const res = await api.post(API_ENDPOINTS.AUTH.SIGNUP, data);
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

export const GoogleOrgSignUp = createAsyncThunk(
  "GoogleOrgSignUp",
  async (data) => {
    try {
      console.log(" Inside Google Organization Signup");
      const res = await api.post(API_ENDPOINTS.AUTH.GOOGLE_SIGNUP, data);
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

export const LinkedInSignIn = createAsyncThunk(
  "LinkedInSignIn",
  async (data) => {
    try {
      console.log(" Inside Linkedin modal");
      const res = await api.post(API_ENDPOINTS.AUTH.GOOGLE_SIGNUP, data);
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

export const LinkdinAuth = createAsyncThunk("LinkdinAuth", async (data) => {
  try {
    console.log(" Inside Linkedin modal");
    const res = await api.post(API_ENDPOINTS.AUTH.LINKEDIN_LOGIN, data);
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

export const signin = createAsyncThunk("signin", async (data) => {
  let token = localStorage.getItem("fcm_token");
  console.log(token, "tokentokentokentoken", {
    ...data,
    fcmToken: token || null,
  });
  try {
    console.log("inside the modal");
    const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      ...data,
      deviceToken: token || null,
    });
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

export const verifysignup = createAsyncThunk("verifysignup", async (data) => {
  try {
    console.log("Inside Sign-Up Verify");
    const res = await axios.post(API_ENDPOINTS.AUTH.VERIFY_CODE, data);
    console.log(res);
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

export const updateverifycode = createAsyncThunk(
  "updateverifycode",
  async (data) => {
    try {
      console.log("Again sending verify code");
      const res = await axios.post(
        API_ENDPOINTS.AUTH.UPDATE_VERIFICATION_CODE,
        data
      );
      console.log(res);
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

export const forgetPassword = createAsyncThunk(
  "forgetpassword",
  async (data) => {
    try {
      console.log("inside the modal");
      const res = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
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

export const newPassword = createAsyncThunk("newPassword", async (data) => {
  try {
    console.log("inside the Reset Password");
    const res = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    console.log(res);
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

export const getProfile = createAsyncThunk("getProfile", async (data) => {
  try {
    const res = await api.get(`${API_ENDPOINTS.AUTH.GET_USER_BY_ID}/${data}`);
    console.log("GET PROFILE", res);
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

export const userDetails = createAsyncThunk("userDetails", async (data) => {
  try {
    const res = await api.get(`${API_ENDPOINTS.AUTH.GET_USER_BY_ID}/${data}`);
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

export const addWalletAddress = createAsyncThunk(
  "addWalletAddress",
  async (data) => {
    try {
      const res = await api.post(`${API_ENDPOINTS.USER.ADD_WALLET_ADDRESS}/${data.id}`, {
        walletAddress: data.walletAddress,
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

export const addEmailAddressGoogle = createAsyncThunk(
  "addEmailAddressGoogle",
  async (data) => {
    try {
      const res = await api.post(
        `${API_ENDPOINTS.USER.ADD_EMAIL_ADDRESS_GOOGLE}/${data.id}`,
        {
          email: data.email,
        }
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

export const addEmailAddress = createAsyncThunk(
  "addEmailAddressGoogle",
  async (data) => {
    try {
      const res = await api.post(`${API_ENDPOINTS.USER.ADD_EMAIL_ADDRESS}/${data.id}`, {
        email: data.email,
        password: data?.password,
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

export const getProfileInfo = createAsyncThunk(
  "getProfileInfo",
  async (data) => {
    try {
      console.log("inde the profile");
      const res = await api.get(`${API_ENDPOINTS.USER.GET_PROFILE}/${data}`);
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

export const getProfileImage = createAsyncThunk(
  "getProfileImage",
  async (data) => {
    try {
      const res = await api.get(`${API_ENDPOINTS.USER.GET_PROFILE_IMAGE}/${data}`);
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

export const getProfileTemp = createAsyncThunk(
  "getProfileTemp",
  async (data) => {
    try {
      const res = await api.get(`${API_ENDPOINTS.AUTH.GET_USER_BY_ID}/${data}`);
      console.log("GET PROFILE", res);
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

export const getTermAndConditions = createAsyncThunk(
  "TermAndConditions",
  async () => {
    try {
      const res = await api.get(API_ENDPOINTS.AUTH.GET_TERMS_AND_CONDITIONS);
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
