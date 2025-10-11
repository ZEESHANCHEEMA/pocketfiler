import { createSlice } from "@reduxjs/toolkit";
import { getfourProjects } from "../middleware/Project/project";

const initialState = {
  loading: false,
  error: "",
  myFourProjects: [],
};
const getfourProjectsSlice = createSlice({
  name: "getfourProjectsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getfourProjects.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getfourProjects.fulfilled, (state, action) => {
      state.loading = false;
      state.myFourProjects = action.payload;
    });
    builder.addCase(getfourProjects.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload?.message ||
        action.error?.message ||
        "Failed to fetch projects";
    });
  },
});
export default getfourProjectsSlice.reducer;
