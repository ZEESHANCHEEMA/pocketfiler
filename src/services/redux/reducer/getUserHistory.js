import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserHistory } from "../middleware/getNft";

const initialState = {
  loading: false,
  error: "",
  userHistory: [],
};
const nftTableSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserHistory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.userHistory = action.payload;
    });
    builder.addCase(getUserHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default nftTableSlice.reducer;
