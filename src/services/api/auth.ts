import { auth, ajax } from '../auth';
import qs from 'qs';

export default {
  // 登录
  token(formData: commonData): Promise<any> {
    // console.log('token data', formData);
    return auth.post('token', {
      data: qs.stringify(formData)
    });
  },

  getVCode(data: commonData): Promise<any> {
    return ajax.post('user/verification', { data });
  },

  reset(data: commonData): Promise<any> {
    return ajax.post('user/password', { data });
  },
};
