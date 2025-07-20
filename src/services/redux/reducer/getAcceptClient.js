import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAcceptClient } from "../middleware/getContract";

const initialState = {
  loading: false,
  error: "",
  allClient: [],
};
const getAcceptClientsSlice = createSlice({
  name: "getAcceptClientSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAcceptClient.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAcceptClient.fulfilled, (state, action) => {
      state.loading = false;
      state.allClient = action.payload;
    });
    builder.addCase(getAcceptClient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getAcceptClientsSlice.reducer;
