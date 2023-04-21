import {MiddlewareArray, configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootRuducer from './reducer';

const store = configureStore({
  reducer: rootRuducer,
  middleware: new MiddlewareArray().concat(logger),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
