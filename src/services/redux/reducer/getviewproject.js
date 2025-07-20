import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { viewproject } from "../middleware/Project/project";
const initialState = {
  loading: false,
  error: "",
  viewProject: [],
};
const viewProjectSlice = createSlice({
  name: "getviewproject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(viewproject.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(viewproject.fulfilled, (state, action) => {
      state.loading = false;
      state.viewProject = action.payload;
    });
    builder.addCase(viewproject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default viewProjectSlice.reducer;
