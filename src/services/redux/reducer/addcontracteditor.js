import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 contracteditorcontent:null
};

export const addcontracteditorSlice = createSlice({
  name: "addcontracteditorSlice",
  initialState,
  reducers: {
    setContractEditor: (state, action) => {
      console.log(action.payload,"inside the Editor Reducer");
      state.contracteditorcontent = action.payload;

    },
  },
});

// Action creator
export const { setContractEditor } = addcontracteditorSlice.actions;

// Reducer
export default addcontracteditorSlice.reducer;
