import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const lockersSlice = createSlice({
  name: "lockers",
  initialState,
  reducers: {
    setLockers(state, action) {
      state.list = Array.isArray(action.payload) ? action.payload : [];
    },
    upsertLocker(state, action) {
      const locker = action.payload;
      if (!locker?.id) return;
      const idx = state.list.findIndex((l) => l.id === locker.id);
      if (idx >= 0) state.list[idx] = { ...state.list[idx], ...locker };
      else state.list.push(locker);
    },
    updateLocker(state, action) {
      const { id, changes } = action.payload || {};
      if (!id) return;
      const idx = state.list.findIndex((l) => l.id === id);
      if (idx >= 0) state.list[idx] = { ...state.list[idx], ...changes };
    },
    removeLocker(state, action) {
      const id = action.payload;
      state.list = state.list.filter((l) => l.id !== id);
    },
  },
});

export const { setLockers, upsertLocker, updateLocker, removeLocker } =
  lockersSlice.actions;
export default lockersSlice.reducer;
