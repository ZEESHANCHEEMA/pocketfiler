import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 contractimgtxt:null
};

export const addcontractimgtxtSlice = createSlice({
  name: "addcontractimgtxtSlice",
  initialState,
  reducers: {
    setContractImgTxt: (state, action) => {
      console.log(action.payload,"inside the Contract Image Reducer");
      state.contracteditorcontent = action.payload;

    },
  },
});

// Action creator
export const { setContractEditor } = addcontractimgtxtSlice.actions;

// Reducer
export default addcontractimgtxtSlice.reducer;
