import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Thread} from '../../types';

export type MessageMap = Map<string, Thread>;

const threadSlice = createSlice({
  name: 'thread',
  initialState: {
    threadList: [] as Thread[],
    isLoading: false,
  },
  reducers: {
    addMessage(state, action) {
      // 一般只有在写草稿后发信时调用，id采用时间戳+hash随机生成即可
      state.threadList.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchThreadList.pending, (state, _action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchThreadList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.threadList = action.payload;
    });
    builder.addCase(fetchThreadList.rejected, (state, _action) => {
      state.isLoading = false;
    });
  },
});

const fetchThreadList = createAsyncThunk(
  'thread/fetchThreadList',
  async (label_id: string) => {
    const response = await fetch('feff' + label_id);
    return (await response.json()).data as Thread[];
  },
);
export const {addMessage} = threadSlice.actions;
export default threadSlice.reducer;
