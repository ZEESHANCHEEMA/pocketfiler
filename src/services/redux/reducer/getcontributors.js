import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getContributors } from "../middleware/Project/project";
const initialState = {
  loading: false,
  error: "",
  myContributors: [],
};
const getContributorsSlice = createSlice({
  name: "getContributorsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContributors.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getContributors.fulfilled, (state, action) => {
      state.loading = false;
      state.myContributors = action.payload;
    });
    builder.addCase(getContributors.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload?.message ||
        action.error?.message ||
        "Failed to load contributors";
      // keep last successful myContributors; don't clear on error
    });
  },
});
export default getContributorsSlice.reducer;
