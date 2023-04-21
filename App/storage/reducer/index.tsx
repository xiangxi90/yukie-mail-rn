import {combineReducers} from 'redux';

//import nav from './navigation.reducer';
import message from './messageSlice';
import calendarSlice from './calendarSlice';
import accounts from './account.reducer';

const rootRuducer = combineReducers({
  //nav,
  message,
  calendarSlice,
  accounts,
});

export default rootRuducer;
export type RootState = ReturnType<typeof rootRuducer>;
