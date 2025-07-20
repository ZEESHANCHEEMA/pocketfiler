import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uploadProject } from "../middleware/Project/project";

const initialState = {
  loading: false,
  error: "",
  allProjectDoc: [],
};
const addProjectDocSlice = createSlice({
  name: "addProjectDocSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(uploadProject.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(uploadProject.fulfilled, (state, action) => {
      state.loading = false;
      state.allProjectDoc = action.payload;
    });
    builder.addCase(uploadProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default addProjectDocSlice.reducer;
