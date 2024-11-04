// scheduleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Получение расписания
export const fetchSchedule = createAsyncThunk('schedule/fetchSchedule', async () => {
  const response = await axios.use('/api/schedule');
  return response.data;
});

// Редактирование расписания
export const updateSchedule = createAsyncThunk('schedule/updateSchedule', async ({ id, updatedData }) => {
  const response = await axios.use(`/api/schedule/${id}`, updatedData);
  return response.data;
});

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedule: [],
    userRole: null,
    status: 'idle',
  },
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.schedule = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const index = state.schedule.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.schedule[index] = action.payload;
        }
      });
  },
});

export const { setUserRole } = scheduleSlice.actions;
export default scheduleSlice.reducer;
