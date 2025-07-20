import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProfile } from "../middleware/signin";

const initialState = {
  loading: false,
  error: "",
  profile: [],
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default profileSlice.reducer;
