import { Reducer } from 'redux';

export interface MessageCountState {
  messageCount: any
}

export interface MessageCountModelType {
  namespace: 'messageCount';
  state: MessageCountState;
  reducers: {
    fetchMessageCount: Reducer<MessageCountState>;
  };
}

const WorkorderStatusModel: MessageCountModelType = {
  namespace: 'messageCount',

  state: {
    messageCount: {},
  },

  reducers: {
    fetchMessageCount(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default WorkorderStatusModel;
