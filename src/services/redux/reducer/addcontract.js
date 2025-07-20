import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contract: {
    name: null,
    type: null,
  },
};

export const addcontractSlice = createSlice({
  name: "addcontractSlice",
  initialState,
  reducers: {
    setContract: (state, action) => {
      console.log(action.payload,"inside the reduces");
      const { name, type } = action.payload;
      state.contract = { name, type };

      //   state.contract = { ...state.contract, name, type };
    },
  },
});

// Action creator
export const { setContract } = addcontractSlice.actions;

// Reducer
export default addcontractSlice.reducer;
