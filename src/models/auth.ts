import { Reducer } from 'redux';
// import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
// import { setAuthority } from '@/utils/authority';

export interface AuthModelState {
  isLogin: boolean;
  uid: string;
}

export interface AuthModelType {
  namespace: string;
  state: AuthModelState;
  reducers: {
    changeLoginStatus: Reducer<AuthModelState>;
  };
}

const localUid = localStorage.getItem('user');

const Model: AuthModelType = {
  namespace: 'auth',

  state: {
    isLogin: !!localUid,
    uid: localUid || '',
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        isLogin: payload.isLogin,
        uid: payload.uid,
      };
    },
  },
};

export default Model;
