import * as types from '../../actions/action.types';
import {AnyAction} from '@reduxjs/toolkit';
const initialState = {
  accounts: null,
  isLoading: false,
  isExpired: false,
  hasAccount: false,
};

export default function accountReducer(
  state = initialState,
  action: AnyAction,
) {
  switch (action.type) {
    case types.ACCOUNT_ENABLED:
      return {
        ...state,
        accounts: action.data,
        isLoading: false,
        isExpired: false,
        hasAccount: true,
      };
    case types.ACCOUNT_DISABLED:
      return {
        ...state,
        accounts: null,
        isLoading: false,
        isExpired: false,
        hasAccount: false,
      };
    case types.ACCOUNT_EXPIRED:
      return {
        ...state,
        accounts: action.data,
        isLoading: false,
        isExpired: true,
        hasAccount: true,
      };
    case types.ACCOUNT_CHECKING:
      return {
        ...state,
        accounts: null,
        isLoading: true,
        isExpired: false,
        hasAccount: false,
      };
    default:
      return state;
  }
}
