import {createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../apiInterceptor';

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, {rejectWithValue}) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed',
      );
    }
  },
);

// Logout action
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed',
      );
    }
  },
); 