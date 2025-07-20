import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllProjectDispute } from "../middleware/Dispute/dispute";

const initialState = {
  loading: false,
  error: "",
  myProjects: [],
};
const getallprojectsDisputeSlice = createSlice({
  name: "getallprojectsDisputeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProjectDispute .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllProjectDispute .fulfilled, (state, action) => {
      state.loading = false;
      state.myProjects = action.payload;
    });
    builder.addCase(getAllProjectDispute .rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getallprojectsDisputeSlice.reducer;
