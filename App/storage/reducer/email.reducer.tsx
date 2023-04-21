import * as types from '../../actions/action.types';
import {AnyAction} from '@reduxjs/toolkit';
const initialState = {
  error: false,
  isLoading: false,
  itens: [],
};

export default function emailReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case types.EMAIL_CACHE_DATA:
      return {
        ...state,
        isLoading: false,
        error: false,
        itens: action.data,
      };
    case types.EMAIL_RECV_DATA:
      return {
        ...state,
        isLoading: false,
        error: false,
        itens: action.data,
      };
    case types.EMAIL_REQ_DATA:
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case types.EMAIL_REQ_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    default:
      return state;
  }
}
