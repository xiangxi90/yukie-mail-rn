import {combineReducers} from 'redux';

//import nav from './navigation.reducer';
import thread from './threadSlice';
import calendar from './calendarSlice';
import account from './accountSlice';

const rootRuducer = combineReducers({
  //nav,
  thread,
  calendar,
  account,
});

export default rootRuducer;
export type RootState = ReturnType<typeof rootRuducer>;
