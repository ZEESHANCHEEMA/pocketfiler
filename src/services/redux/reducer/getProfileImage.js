import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProfileImage } from "../middleware/signin";

const initialState = {
  loading: false,
  error: "",
  profileImage: [],
};
const profileSlice = createSlice({
  name: "profileSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProfileImage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProfileImage.fulfilled, (state, action) => {
      state.loading = false;
      state.profileImage = action.payload;
    });
    builder.addCase(getProfileImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default profileSlice.reducer;
