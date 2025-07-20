import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getChatHistory } from "../middleware/Project/project";

const initialState = {
  loading: false,
  error: "",
  myChatHistory: [],
};
const getCHathistorySlice = createSlice({
  name: "getCHathistorySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getChatHistory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getChatHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.myChatHistory = action.payload;
    });
    builder.addCase(getChatHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getCHathistorySlice.reducer;
