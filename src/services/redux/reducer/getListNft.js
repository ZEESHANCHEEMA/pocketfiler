import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getListNft } from "../middleware/getNft";

const initialState = {
  loading: false,
  error: "",
  listNft: [],
};
const listNft = createSlice({
  name: "listNft",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListNft.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListNft.fulfilled, (state, action) => {
      state.loading = false;
      state.listNft = action.payload;
    });
    builder.addCase(getListNft.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default listNft.reducer;
