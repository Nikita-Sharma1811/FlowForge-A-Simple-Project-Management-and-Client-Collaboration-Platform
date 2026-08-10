// src/utils/createApiThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createApiThunk = (name, apiFunc, onSuccess = () => {}, onError = () => {}) =>
  createAsyncThunk(name, async (payload, thunkAPI) => {
    try {
      const response = await apiFunc(payload);
      onSuccess(response, thunkAPI);
      return response.data;
    } catch (error) {
      onError(error, thunkAPI);
      return thunkAPI.rejectWithValue(error.response?.data || 'API call failed');
    }
  });