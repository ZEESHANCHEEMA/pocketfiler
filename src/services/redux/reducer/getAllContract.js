import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllContract } from "../middleware/getAllContract";

const initialState = {
  loading: false,
  error: "",
  allcontract: [],
};
const getallcontractSlice = createSlice({
  name: "getallcontractSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllContract.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllContract.fulfilled, (state, action) => {
      state.loading = false;
      state.allcontract = action.payload;
    });
    builder.addCase(getAllContract.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getallcontractSlice.reducer;
