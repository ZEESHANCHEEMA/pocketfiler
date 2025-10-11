import { createSlice } from "@reduxjs/toolkit";
import { getFourProjectsAsContributor } from "../middleware/Project/project";

const initialState = {
  loading: false,
  error: "",
  myFourProjectsAsContributor: [],
};

const getFourProjectsAsContributorSlice = createSlice({
  name: "getFourProjectsAsContributorSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFourProjectsAsContributor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFourProjectsAsContributor.fulfilled, (state, action) => {
      state.loading = false;
      state.myFourProjectsAsContributor = action.payload;
    });
    builder.addCase(getFourProjectsAsContributor.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload?.message ||
        action.error?.message ||
        "Failed to fetch contributor projects";
    });
  },
});

export default getFourProjectsAsContributorSlice.reducer;
