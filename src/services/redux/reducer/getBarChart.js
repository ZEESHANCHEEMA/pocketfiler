import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBarChartGraph } from "../middleware/getNft";

const initialState = {
  loading: false,
  error: "",
  graph: [],
};
const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBarChartGraph.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getBarChartGraph.fulfilled, (state, action) => {
      state.loading = false;
      state.graph = action.payload;
    });
    builder.addCase(getBarChartGraph.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default graphSlice.reducer;
