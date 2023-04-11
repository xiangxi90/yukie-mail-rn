import tmpState from './temState';

export const appReducer = (
  state = tmpState,
  action: {
    type: any;
    payload: {
      activeTab: any;
    };
  },
) => {
  switch (action.type) {
    case 'toggleActiveTab': {
      const activeTab = action.payload.activeTab;
      return {
        ...state,
        activeTab,
      };
    }
    default:
      return state;
  }
};
