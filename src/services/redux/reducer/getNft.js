import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNftData } from "../middleware/getNft";

const initialState = {
  loading: false,
  error: "",
  nftData: [],
};
const singUpSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNftData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getNftData.fulfilled, (state, action) => {
      state.loading = false;
      state.nftData = action.payload;
    });
    builder.addCase(getNftData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default singUpSlice.reducer;
