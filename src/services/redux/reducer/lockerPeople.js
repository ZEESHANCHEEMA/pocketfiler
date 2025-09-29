import { createSlice } from "@reduxjs/toolkit";

// Stores people-with-access per lockerId to avoid refetching
// state.byLockerId[lockerId] = { owner, associates, fetchedAt }
const lockerPeopleSlice = createSlice({
  name: "lockerPeople",
  initialState: {
    byLockerId: {},
  },
  reducers: {
    setLockerPeople: (state, action) => {
      const { lockerId, owner, associates } = action.payload || {};
      if (!lockerId) return;
      state.byLockerId[lockerId] = {
        owner: owner || null,
        associates: Array.isArray(associates) ? associates : [],
        fetchedAt: Date.now(),
      };
    },
    clearLockerPeople: (state, action) => {
      const lockerId = action.payload;
      if (lockerId && state.byLockerId[lockerId])
        delete state.byLockerId[lockerId];
    },
  },
});

export const { setLockerPeople, clearLockerPeople } = lockerPeopleSlice.actions;
export default lockerPeopleSlice.reducer;
