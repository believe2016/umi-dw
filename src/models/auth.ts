import { Reducer } from 'redux';
import { clearSession } from '@/utils/session';
import { setAuthorizationToken } from '@/services/http';

export interface AuthModelState {
  isLogin: boolean;
  uid: string;
}

export interface AuthModelType {
  namespace: string;
  state: AuthModelState;
  reducers: {
    changeLoginStatus: Reducer<AuthModelState>;
    logout: Reducer<AuthModelState>;
  };
}

const localUid = localStorage.getItem('user') || '';

const Model: AuthModelType = {
  namespace: 'auth',

  state: {
    isLogin: !!localUid,
    uid: localUid,
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        isLogin: payload.isLogin,
        uid: payload.uid,
      };
    },
    logout(state) {
      clearSession();
      setAuthorizationToken(false);
      return {
        ...state,
        isLogin: false,
        uid: '',
      };
    }
  },
};

export default Model;
