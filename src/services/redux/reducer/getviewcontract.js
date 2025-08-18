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
      state.viewContract = action.payload;
      console.log("🔍 getviewcontract reducer: Action payload:", action.payload);
      console.log("🔍 getviewcontract reducer: Updated state:", state.viewContract);
    });
    builder.addCase(viewcontract.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
      console.error("❌ getviewcontract reducer: Error:", action.error);
    });
  },
});
export default viewcontractSlice.reducer;
