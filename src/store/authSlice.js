import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loggedIn: false,
  isGuestUser: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.loggedIn = action.payload;
    },
    setGuestUser(state, action) {
      state.isGuestUser = action.payload;
    },
    logout(state) {
      state.loggedIn = false;
      state.isGuestUser = false;
    },
  },
});

export const { setLoggedIn, setGuestUser, logout } = authSlice.actions;
export default authSlice.reducer;