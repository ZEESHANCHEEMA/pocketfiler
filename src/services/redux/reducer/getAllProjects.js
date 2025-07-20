import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllProject } from "../middleware/Project/project";

const initialState = {
  loading: false,
  error: "",
  myallProjects: [],
};
const getallprojectsSlice = createSlice({
  name: "getallprojectsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProject.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllProject.fulfilled, (state, action) => {
      state.loading = false;
      state.myallProjects = action.payload;
    });
    builder.addCase(getAllProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getallprojectsSlice.reducer;
