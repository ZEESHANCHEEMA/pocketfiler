import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getClient } from "../middleware/getContract";

const initialState = {
  loading: false,
  error: "",
  allClient: [],
};
const getallClientSlice = createSlice({
  name: "getallClientSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getClient.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getClient.fulfilled, (state, action) => {
      state.loading = false;
      state.allClient = action.payload;
    });
    builder.addCase(getClient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getallClientSlice.reducer;
