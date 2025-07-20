import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { viewcontract } from "../middleware/contract";

const initialState = {
  loading: false,
  error: "",
  viewContract: [],
};
const viewcontractSlice = createSlice({
  name: "getviewcontract",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(viewcontract.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(viewcontract.fulfilled, (state, action) => {
      state.loading = false;
      state.  viewContract = action.payload;
    });
    builder.addCase(viewcontract.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default viewcontractSlice.reducer;
