import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProfileInfo } from "../middleware/signin";

const initialState = {
  loading: false,
  error: "",
  userProfile: [],
};
const singUpSlice = createSlice({
  name: "getProfileInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProfileInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProfileInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.userProfile = action.payload;
    });
    builder.addCase(getProfileInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default singUpSlice.reducer;
