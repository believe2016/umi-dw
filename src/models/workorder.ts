import { Reducer } from 'redux';

export interface WorkorderModelState {
  status: string;
  isChat: boolean;
  currentTab: string;
}

export interface WorkorderModelType {
  namespace: 'workorderStatus';
  state: WorkorderModelState;
  reducers: {
    setWorkorderStatus: Reducer<WorkorderModelState>;
    setIsChat: Reducer<WorkorderModelState>;
    setOpadminStatus: Reducer<WorkorderModelState>;
  };
}

const WorkorderStatusModel: WorkorderModelType = {
  namespace: 'workorderStatus',

  state: {
    status: '',
    isChat: localStorage.getItem('isChat') === 'true',
    currentTab: '',
  },

  reducers: {
    setWorkorderStatus(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setIsChat(state, action) {
      localStorage.setItem('isChat', action.payload);
      return {
        ...state,
        isChat: action.payload,
      };
    },
    setOpadminStatus(state, action) {
      return {
        ...state,
        currentTab: action.payload,
      };
    },
  },
};

export default WorkorderStatusModel;
