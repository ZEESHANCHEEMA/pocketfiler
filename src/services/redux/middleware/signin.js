import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";
import { requestPermission } from "../../../utils/Firebase/firebase";

export const signup = createAsyncThunk("signin", async (data) => {
  try {
    console.log("Signup");
    const res = await api.post(`${API_URL}/auth/signup`, data);
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

export const GoogleOrgSignUp = createAsyncThunk(
  "GoogleOrgSignUp",
  async (data) => {
    try {
      console.log(" Inside Google Organization Signup");
      const res = await api.post(`${API_URL}/auth/googlesignname`, data);
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

export const LinkedInSignIn = createAsyncThunk(
  "LinkedInSignIn",
  async (data) => {
    try {
      console.log(" Inside Linkedin modal");
      const res = await api.post(`${API_URL}/auth/googlesignname`, data);
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

export const LinkdinAuth = createAsyncThunk("LinkdinAuth", async (data) => {
  try {
    console.log(" Inside Linkedin modal");
    const res = await api.post(`${API_URL}/linkedin/login`, data);
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

export const signin = createAsyncThunk("signin", async (data) => {
  let token = localStorage.getItem("fcm_token");
  console.log(token, "tokentokentokentoken", {
    ...data,
    fcmToken: token || null,
  });
  try {
    console.log("inside the modal");
    const res = await api.post(`${API_URL}/auth/login`, {
      ...data,
      deviceToken: token || null,
    });
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

export const verifysignup = createAsyncThunk("verifysignup", async (data) => {
  try {
    console.log("Inside Sign-Up Verify");
    const res = await axios.post(`${API_URL}/auth/verify/code`, data);
    console.log(res);
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

export const updateverifycode = createAsyncThunk(
  "updateverifycode",
  async (data) => {
    try {
      console.log("Again sending verify code");
      const res = await axios.post(
        `${API_URL}/auth/updateVerificationCode`,
        data
      );
      console.log(res);
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
export const forgetPassword = createAsyncThunk(
  "forgetpassword",
  async (data) => {
    try {
      console.log("inside the modal");
      const res = await api.post(`${API_URL}/auth/forgot`, data);
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
export const newPassword = createAsyncThunk("newPassword", async (data) => {
  try {
    console.log("inside the Reset Password");
    const res = await api.post(`${API_URL}/auth/resetpassword`, data);
    console.log(res);
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

export const getProfile = createAsyncThunk("getProfile", async (data) => {
  try {
    const res = await api.get(`${API_URL}/auth/getuserByid/${data}`);
    // localStorage.setItem("token", res?.data?.token);
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
    const res = await api.get(`${API_URL}/auth/userDetails/${data}`);

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
      const res = await api.post(`${API_URL}/api/addWallet/${data.id}`, {
        walletAddress: data.walletAddress,
      });
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
export const addEmailAddressGoogle = createAsyncThunk(
  "addEmailAddressGoogle",
  async (data) => {
    try {
      const res = await api.post(
        `${API_URL}/api/addEmailAddressGoogle/${data.id}`,
        {
          email: data.email,
        }
      );
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
export const addEmailAddress = createAsyncThunk(
  "addEmailAddressGoogle",
  async (data) => {
    try {
      const res = await api.post(`${API_URL}/api/addEmailAddress/${data.id}`, {
        email: data.email,
        password: data?.password,
      });
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

export const getProfileInfo = createAsyncThunk(
  "getProfileInfo",
  async (data) => {
    try {
      console.log("inde the profile");
      const res = await api.get(`${API_URL}/api/getUserInfo/${data}`);
      // localStorage.setItem("token", res?.data?.token);
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
      const res = await api.get(`${API_URL}/api/getUserProfileImage/${data}`);
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
      const res = await api.get(`${API_URL}/auth/getuserByid/${data}`);
      // localStorage.setItem("token", res?.data?.token);
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
      const res = await api.get(`${API_URL}/auth/getTermAndConditions`);

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
