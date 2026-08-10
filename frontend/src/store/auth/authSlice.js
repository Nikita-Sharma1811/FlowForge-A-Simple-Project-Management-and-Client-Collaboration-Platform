// src/features/user/userSlice.js
import {  createSlice } from '@reduxjs/toolkit';
import { getMyOrganisationAPI, getUserOrganisationAPI, getUserProfileAPI, loginAPI, registerAPI } from './authAPI';
import { createApiThunk } from '../../utils/createAPIThunk';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,
};

// Create thunks
export const login = createApiThunk('user/login', loginAPI, (res) => {
  localStorage.setItem('user', JSON.stringify(res.data));
});

export const register = createApiThunk('user/register', registerAPI, (res) => {
  localStorage.setItem('user', JSON.stringify(res.data));
});


export const getUserProfile = createApiThunk('user/profile', getUserProfileAPI, (res) => {
  localStorage.setItem('user', JSON.stringify(res.data));
});

export const getMyOrganisation = createApiThunk('user/organisations', getMyOrganisationAPI, (res) => {
  localStorage.setItem('myOrganisation', JSON.stringify(res.data));
});

// Thunk using createApiThunk
export const getUserOrganisation = createApiThunk(
  'user/:userId/organisations',
  getUserOrganisationAPI,
  (res) => {
    localStorage.setItem('userOrganisation', JSON.stringify(res.data));
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    [login, register].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;