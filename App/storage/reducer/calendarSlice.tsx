import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Calendar} from '../../types';

// export type Calendars = {
//   title: string;
//   start: Date;
//   end: Date;
// };

export type CalendarMap = Map<string, Calendar>;

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    calendars: [] as Calendar[],
    loading: false,
  },
  reducers: {
    addCalendar: (state, action: PayloadAction<Calendar>) => {
      state.calendars.push(action.payload);
    },
    removeCalendar: (state, action: PayloadAction<Calendar>) => {
      state.calendars.filter(item => item !== action.payload);
    },
  },
});

export const {addCalendar, removeCalendar} = calendarSlice.actions;

export default calendarSlice.reducer;
