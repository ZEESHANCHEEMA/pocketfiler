import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getChatHistoryDispute } from "../middleware/Dispute/dispute";

const initialState = {
  loading: false,
  error: "",
  myDisputeChatHistory: [],
};
const getCHathistoryDisputeSlice = createSlice({
  name: "getCHathistoryDisputeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getChatHistoryDispute.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getChatHistoryDispute.fulfilled, (state, action) => {
      state.loading = false;
      state.myDisputeChatHistory = action.payload;
    });
    builder.addCase(getChatHistoryDispute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getCHathistoryDisputeSlice.reducer;
