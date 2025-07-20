import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNftTableData } from "../middleware/getNft";

const initialState = {
  loading: false,
  error: "",
  nftDataTable: [],
};
const nftTableSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNftTableData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getNftTableData.fulfilled, (state, action) => {
      state.loading = false;
      state.nftDataTable = action.payload;
    });
    builder.addCase(getNftTableData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default nftTableSlice.reducer;
