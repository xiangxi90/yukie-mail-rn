import {appReducer} from './appReducer';

const reduceReducers =
  (
    ...reducers: ((
      state:
        | {
            username: string;
            mails: {
              headers: {
                subject: string;
                date: string;
                from: string;
                to: string;
                sender: string;
                senderLogo: string;
              };
              body: string;
              status: string;
            }[];
            activeTab: string;
          }
        | undefined,
      action: {
        type: any;
        payload: {
          activeTab: any;
        };
      },
    ) => {
      activeTab: any;
      username: string;
      mails: {
        headers: {
          subject: string;
          date: string;
          from: string;
          to: string;
          sender: string;
          senderLogo: string;
        };
        body: string;
        status: string;
      }[];
    })[]
  ) =>
  (
    prevState: any,
    value: {
      type: any;
      payload: {
        activeTab: any;
      };
    },
  ) =>
    reducers.reduce((newState, reducer) => reducer(newState, value), prevState);

export default reduceReducers(appReducer);
