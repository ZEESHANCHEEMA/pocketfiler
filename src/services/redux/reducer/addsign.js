import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contractsign: null,
};

export const addsignSlice = createSlice({
  name: "addsignSlice",
  initialState,
  reducers: {
    setContractSign: (state, action) => {
      console.log(action.payload, "inside the Upload Sign Reducer");
      state.contractsign = action.payload;
    },
  },
});

// Action creator
export const { setContractSign } = addsignSlice.actions;

// Reducer
export default addsignSlice.reducer;
