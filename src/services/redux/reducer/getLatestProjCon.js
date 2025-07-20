import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatestProjContract } from "../middleware/Project/project";

const initialState = {
  loading: false,
  error: "",
  myData: [],
};
const getLatestProjectConSlice = createSlice({
  name: "getLatestProjectConSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(LatestProjContract.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(LatestProjContract.fulfilled, (state, action) => {
      state.loading = false;
      state. myData = action.payload;
    });
    builder.addCase(LatestProjContract.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getLatestProjectConSlice.reducer;
