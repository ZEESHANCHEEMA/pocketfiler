import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../apiInterceptor";
import { API_URL } from "../../../client";

export const createproject = createAsyncThunk("createproject", async (data) => {
  try {
    console.log("Inside Create Project");
    const res = await api.post(`${API_URL}/project/CreateProject`, data);
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

export const getAllProject = createAsyncThunk("getAllProject", async (data) => {
  try {
    let url = `${API_URL}/project/getProjects/${data?.id}`;

    const queryParams = new URLSearchParams();

    if (data?.year) {
      queryParams.append("year", data.year);
    }
    if (data?.search) {
      queryParams.append("search", data.search);
    }
    if (data?.page) {
      queryParams.append("page", data.page);
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

export const viewproject = createAsyncThunk("viewproject", async (data) => {
  try {
    const res = await api.get(`${API_URL}/project/viewProject/${data}`);
    // localStorage.setItem("token", res?.data?.token);
    console.log("inside view Project  MODAL", res);
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

export const updateproject = createAsyncThunk("updateproject", async (data) => {
  try {
    const res = await api.put(
      `${API_URL}/project/updateProject/${data.id}`,
      data
    );
    console.log("Inside Update Project", res);

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

export const uploadProject = createAsyncThunk("uploadProject", async (data) => {
  try {
    console.log("upload doc");

    const res = await api.post(
      `${API_URL}/project/uploadProjectDocument/${data.id}`,
      data
    );
    console.log("Inside Upload Project Document", res);

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

export const viewProjectActivities = createAsyncThunk(
  "viewProjectActivities",
  async (data) => {
    try {
      const res = await api.get(
        `${API_URL}/project/getActivitiesForData/${data}`,
        data
      );
      console.log("Inside View Project Activity modal", res);

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

export const ChatCall = createAsyncThunk("ChatCall", async (data) => {
  try {
    const res = await api.post(`${API_URL}/project/addProjectActivity`, data);
    console.log("Inside Chat Call Modal", res);

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
export const Call = createAsyncThunk("Call", async (data) => {
  try {
    const res = await api.post(`${API_URL}/project/statingCall`, data);

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
export const addProjectClient = createAsyncThunk(
  "addProjectClient",
  async (data) => {
    try {
      console.log("Inside Add Client Project Modal");

      const res = await api.post(`${API_URL}/project/addClients`, data);
      console.log("Inside Add Client Project Modal", res);

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

export const getfourProjects = createAsyncThunk(
  "getfourProjects",
  async (data) => {
    try {
      const res = await api.get(`${API_URL}/project/getfourProject/${data}`);
      // localStorage.setItem("token", res?.data?.token);
      console.log("Inside Get 4 Project Modal", res);
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

export const chatSendMsg = createAsyncThunk("chatSendMsg", async (data) => {
  try {
    console.log("Inside CHatbox Project Modal");

    const res = await api.post(
      `${API_URL}/project/createMessengerHistory`,
      data
    );
    console.log("Inside CHATbox Project Modal", res);

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

export const getChatHistory = createAsyncThunk(
  "getChatHistory",
  async (data) => {
    try {
      const res = await api.get(
        `${API_URL}/project/getMessengerHistoryByProjectId/${data}`
      );
      // localStorage.setItem("token", res?.data?.token);
      console.log("Inside Get CHAT HISTORY ", res);
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

export const addSubscription = createAsyncThunk(
  "addSubscription",
  async (data) => {
    try {
      console.log("Inside Add Subscription Method");

      const res = await api.post(`${API_URL}/create-checkout-session`, data);
      console.log("Inside Add Subscription Method", res);

      // localStorage.setItem("token", res?.data?.token);
      return {
        status: res?.status,
        data: res?.data,
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

export const getSubscription = createAsyncThunk(
  "getSubscription",
  async (data) => {
    try {
      const res = await api.get(`${API_URL}/api/getLatestSubscription/${data}`);
      // localStorage.setItem("token", res?.data?.token);
      console.log("Inside Get Subscription ", res);
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

export const getContributors = createAsyncThunk(
  "getContributors",
  async (data) => {
    try {
      let url = `${API_URL}/project/getContributors/${data?.projectId}`;
      const queryParams = new URLSearchParams();

      if (data?.search) {
        queryParams.append("search", data.search);
      }
      if (data?.page) {
        queryParams.append("page", data.page);
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await api.get(url);
      console.log("Inside Get Contibutors Modal", res);
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

export const getContributorsNopaging = createAsyncThunk(
  "getallContributorsWithNoPaging",
  async (data) => {
    try {
      const res = await api.get(
        `${API_URL}/project/getallContributorsWithNoPaging/${data?.projectId}`
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

export const removeContributors = createAsyncThunk(
  "removeContributors",
  async (data) => {
    try {
      console.log(data, "inside the remove Contributors");

      const res = await api.delete(
        `${API_URL}/project/removeContributor/${data}`
      );
      // localStorage.setItem("token", res?.data?.token);
      console.log("Inside Remove Contributors", data);
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
  }
);

export const RequestDoc = createAsyncThunk("RequestDoc ", async (data) => {
  try {
    console.log("Inside Req Doc Modal");

    const res = await api.post(
      `${API_URL}/project/requestProjectDocument`,
      data
    );
    console.log("Inside Inside Req Doc Modal res", res);

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

export const getTotalCount = createAsyncThunk("getTotalCount", async (data) => {
  try {
    const res = await api.get(`${API_URL}/project/getTotals/${data}`, data);
    console.log("Inside get TOTAL COUNT", res);

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

export const LatestProjContract = createAsyncThunk(
  "LatestProjContract",
  async (data) => {
    try {
      const res = await api.get(
        `${API_URL}/api/GetLatestSubscription/${data}`,
        data
      );
      console.log("Inside Latest Project and Contract modal", res);

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

export const CompleteProject = createAsyncThunk(
  "CompleteProject",
  async (data) => {
    try {
      const res = await api.put(`${API_URL}/Status`, data);

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
