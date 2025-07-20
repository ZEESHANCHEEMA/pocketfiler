import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getReferalData } from "../middleware/getNft"

const initialState = {
  loading: false,
  error: "",
  referalDetail: [],
};
const referalSlice = createSlice({
  name: "getReferalData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getReferalData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getReferalData.fulfilled, (state, action) => {
      state.loading = false;
      state.referalDetail = action.payload;
    });
    builder.addCase(getReferalData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default referalSlice.reducer;
