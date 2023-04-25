import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Account} from '../../types';

const accountSlice = createSlice({
  name: 'todos',
  initialState: {
    account: {
      name: '',
      status: 'Empty',
      email_address: '',
      smtp_server: '',
      smtp_port: 993,
      smtp_account: '',
      smtp_password: '',
      imap_server: '',
      imap_port: 443,
      imap_account: '',
      imap_password: '',
    },
    isLoading: false,
    hasAccount: false,
    threadItemMode: 'card',
  },
  reducers: {
    addAccount(state, action) {
      state.account = action.payload;
    },
    setThreadItemMode(state, action) {
      state.threadItemMode = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAccount.pending, (state, _action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      state.isLoading = false;
      state.account = action.payload;
      if (state.account.status !== 'Empty') {
        state.hasAccount = true;
      }
    });
    builder.addCase(fetchAccount.rejected, (state, _action) => {
      state.isLoading = false;
    });
  },
});

export const fetchAccount = createAsyncThunk('account/fetch', async () => {
  const response = await fetch('feff');
  return (await response.json()).data as Account;
});

export const {addAccount, setThreadItemMode} = accountSlice.actions;

export default accountSlice.reducer;
