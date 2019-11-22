import { Reducer } from 'redux';

// import user from '@/services/api/user';

export interface InstitutionModelState {
  curHospital: {
    id: string;
    name: string;
  };
  departments: {};
  openedSub: string[];
  isShowHospital: boolean,
  isShowSubAdmin: boolean,
  isShowPWD: boolean,
  hospitalId: string,
  adminChatType: string,
  link: string,
  departLink: string,
}

export interface InstitutionModelType {
  namespace: 'institution';
  state: InstitutionModelState;
  reducers: {
    changeCurHospital: Reducer<InstitutionModelState>;
  };
}

const UserModel: InstitutionModelType = {
  namespace: 'institution',

  state: {
    curHospital: {
      id: '',
      name: '',
    },
    departments: {},
    openedSub: [],
    isShowHospital: false,
    isShowSubAdmin: false,
    isShowPWD: false,
    hospitalId: '',
    adminChatType: 'new',
    link: '',
    departLink: '',
  },

  reducers: {
    changeCurHospital(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default UserModel;
