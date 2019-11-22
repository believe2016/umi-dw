import { Effect } from 'dva';
import { Reducer } from 'redux';
import { initialOrg } from '@/utils/consts';

import user from '@/services/api/user';

export interface UserModelState {
  user: Iuser;
  institution: Iins;
  relationship: Iorg[];
  legalRelationship: Iorg[];
  isShowMsgHistory: boolean;
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
    relationship: [initialOrg],
    legalRelationship: [initialOrg],
    isShowMsgHistory: false,
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      console.log('fetchCurrentUser', payload);
      const response = yield call(user.getUserInfo);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      const { user, relationship } = action.payload;
      const legalRelationship = user.status === 'NORMAL' ? relationship
        .filter((org: Iorg) => ['CONFIRMED'].includes(org.status)) : relationship;
      return {
        ...state,
        ...action.payload,
        legalRelationship,
      };
    },
  },
};

export default UserModel;
