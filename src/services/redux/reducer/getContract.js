import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getContract } from "../middleware/getContract";

const initialState = {
  loading: false,
  error: "",
  contract: [],
};
const getcontractSlice = createSlice({
  name: "getcontractSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContract.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getContract.fulfilled, (state, action) => {
      state.loading = false;
      state.contract = action.payload;
    });
    builder.addCase(getContract.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getcontractSlice.reducer;
