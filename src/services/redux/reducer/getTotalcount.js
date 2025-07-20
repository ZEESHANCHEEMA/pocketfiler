import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTotalCount } from "../middleware/Project/project";

const initialState = {
  loading: false,
  error: "",
  myTotalCount: [],
};
const getAllCountSlice = createSlice({
  name: "getAllCountSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase( getTotalCount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase( getTotalCount.fulfilled, (state, action) => {
      state.loading = false;
      state.myTotalCount = action.payload;
    });
    builder.addCase( getTotalCount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getAllCountSlice.reducer;
