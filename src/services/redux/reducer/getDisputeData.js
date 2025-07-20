import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DisputeData } from "../middleware/Dispute/dispute";

const initialState = {
  loading: false,
  error: "",
  myDisputeDATA: [],
};
const getDisputeDataSlice = createSlice({
  name: "getDisputeDataSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(DisputeData .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(DisputeData .fulfilled, (state, action) => {
      state.loading = false;
      state. myDisputeDATA = action.payload;
    });
    builder.addCase(DisputeData .rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getDisputeDataSlice.reducer;
