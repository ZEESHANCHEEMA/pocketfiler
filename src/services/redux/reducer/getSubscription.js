import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSubscription } from "../middleware/Project/project";

const initialState = {
  loading: false,
  error: "",
  allsubscription: [],
};
const getSubscriptionSlice = createSlice({
  name: "getSubscriptionSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubscription.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSubscription.fulfilled, (state, action) => {
      state.loading = false;
      state.allsubscription = action.payload;
    });
    builder.addCase(getSubscription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || "something wrong";
    });
  },
});
export default getSubscriptionSlice.reducer;
