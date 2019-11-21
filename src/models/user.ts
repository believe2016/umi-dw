import { Effect } from 'dva';
import { Reducer } from 'redux';

import user from '@/services/api/user';

export interface UserModelState {
  user: Iuser;
  institution: Iins;
  relationship: Iorg[];
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    user: {
      username: '',
      tel: '',
      status: '',
      roles: [],
    },
    institution: {
      id: '',
      name: '',
    },
    relationship: []
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      // console.log('fetchCurrent', payload);
      const response = yield call(user.getUserInfo);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default UserModel;
