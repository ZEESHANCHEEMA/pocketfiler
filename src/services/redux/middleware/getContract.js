import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../apiInterceptor";
import { API_URL } from "../../client";

export const getContract = createAsyncThunk("getContract", async (data) => {
  try {
    const res = await api.get(`${API_URL}/contract/getfourContract/${data}`);
    // localStorage.setItem("token", res?.data?.token);
    console.log("inside get contract", res);
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

// for add client

export const addClient = createAsyncThunk("addClient", async (data) => {
  try {
    console.log("inside get contract", data);
    const res = await api.post(`${API_URL}/association/addAssociation`, data);
    // localStorage.setItem("token", res?.data?.token);
    return {
      status: res?.status,
      data: res?.data?.data,
    };
  } catch (error) {
    console.log("thjis is the error", error);
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});

export const updateClient = createAsyncThunk("updateClient", async (data) => {
  try {
    const res = await api.put(`${API_URL}/association/updateStatus`, data);
    // localStorage.setItem("token", res?.data?.token);
    console.log("inside get contract", data);
    return {
      status: res?.status,
      data: res?.data?.data,
    };
  } catch (error) {
    console.log("this is the error", error);
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});

export const removeClients = createAsyncThunk("removeClients", async (data) => {
  try {
    console.log(data, "inside the remove client");

    const res = await api.delete(
      `${API_URL}/association/removeAssociation/${data}`
    );
    // localStorage.setItem("token", res?.data?.token);
    console.log("remove Client", data);
    return {
      status: res?.status,
      data: res?.data?.data,
    };
  } catch (error) {
    console.log("this is the error", error);
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});

export const deleteProfile = createAsyncThunk("deleteProfile", async (data) => {
  try {
    console.log(data, "before delete profile");
    const res = await api.post(`${API_URL}/auth/requestDeleteAccount`, data);
    console.log("delete profile", data);
    return {
      status: res?.status,
      data: res?.data?.data,
    };
  } catch (error) {
    console.log("this is the error", error);
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});

export const getClient = createAsyncThunk("getClient", async (ClienData) => {
  try {
    let data = {};
    if (ClienData?.page) {
      data.page = ClienData.page;
    }
    if (ClienData?.year) {
      data.year = ClienData.year;
    }
    if (ClienData?.search) {
      const res = await api.post(
        `${API_URL}/association/getAssociatess/${ClienData?.id}`,
        { ...data, search: ClienData.search }
      );
      return {
        status: res?.status,
        data: res?.data?.data,
      };
    } else {
      const res = await api.post(
        `${API_URL}/association/getAssociatess/${ClienData?.id}`,
        data
      );
      return {
        status: res?.status,
        data: res?.data?.data,
      };
    }
  } catch (error) {
    return {
      message: error?.response?.data?.error,
      status: error?.response?.status,
    };
  }
});

export const getAcceptClient = createAsyncThunk(
  "getAcceptClient",
  async (data) => {
    try {
      let url = `${API_URL}/association/getAssociatesUser/${data?.id}`;

      const queryParams = new URLSearchParams();

      if (data?.page) {
        queryParams.append("page", data.page);
      }
      if (data?.search) {
        queryParams.append("search", data.search);
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await api.get(url);

      console.log("Accept Clients", res);

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
