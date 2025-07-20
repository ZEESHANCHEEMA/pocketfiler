import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserAssociate } from "../middleware/getUserAssociate";

const initialState = {
  loading: false,
  error: "",
  user_associates: [],
};
const getuserassociatesSlice = createSlice({
  name: "getuserassociatesSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserAssociate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserAssociate.fulfilled, (state, action) => {
      state.loading = false;
      state.user_associates = action.payload;
    });
    builder.addCase(getUserAssociate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getuserassociatesSlice.reducer;
