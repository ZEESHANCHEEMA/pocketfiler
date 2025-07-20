import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WithDrawDispute } from "../middleware/Dispute/dispute";
const initialState = {
  loading: false,
  error: "",
  withdrawdispute: [],
};
const WithdrawDisputeSlice = createSlice({
  name: "WithdrawDisputeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(WithDrawDispute.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(WithDrawDispute.fulfilled, (state, action) => {
      state.loading = false;
      state. withdrawdispute = action.payload;
    });
    builder.addCase(WithDrawDispute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default WithdrawDisputeSlice.reducer;
