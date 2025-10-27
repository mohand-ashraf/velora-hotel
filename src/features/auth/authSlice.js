import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("currentUser")) || null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("token", token);
    },

    signupSuccess: (state, action) => {
      const { user, token } = action.payload;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));

      state.user = user;
      state.token = token;
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("token", token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, signupSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
