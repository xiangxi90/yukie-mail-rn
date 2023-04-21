import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Message} from '../../types';

export type MessageMap = Map<string, Message>;

const messageSlice = createSlice({
  name: 'todos',
  initialState: {
    messages: [] as Message[],
    isLoading: false,
  },
  reducers: {
    addMessage(state, action) {
      // 一般只有在写草稿后发信时调用，id采用时间戳+hash随机生成即可
      state.messages.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchMessage.pending, (state, _action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMessage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.messages = action.payload;
    });
    builder.addCase(fetchMessage.rejected, (state, _action) => {
      state.isLoading = false;
    });
  },
});

const fetchMessage = createAsyncThunk(
  'messages/fetchById',
  async (payload: string) => {
    const response = await fetch('feff' + payload);
    return (await response.json()).data as Message[];
  },
);
export const {addMessage} = messageSlice.actions;

export default messageSlice.reducer;
