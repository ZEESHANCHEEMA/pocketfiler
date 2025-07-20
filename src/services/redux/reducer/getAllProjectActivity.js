import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { viewProjectActivities } from "../middleware/Project/project";

const initialState = {
  loading: false,
  error: "",
  allProjectActivity: [],
};
const getallProjectActivitySlice = createSlice({
  name: "getallProjectActivitySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(viewProjectActivities.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(viewProjectActivities.fulfilled, (state, action) => {
      console.log(action, "actionactionaction");
      state.loading = false;
      state.allProjectActivity = action.payload;
    });
    builder.addCase(viewProjectActivities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getallProjectActivitySlice.reducer;
