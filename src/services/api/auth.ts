import request from 'umi-request';
import qs from 'qs';

export default {
  // 登录
  token(formData: commonData): Promise<any> {
    console.log('token data', formData);
    return request.post('token', {
      prefix: `${process.env.BASEURL}${process.env.AUTH_NAMESPACE}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ZG9jdG9yX3dlYjo='
      },
      // @ts-ignore
      auth: { username: 'doctor_web' },
      data: qs.stringify(formData)
    });
  },

  getVCode(data: commonData): Promise<any> {
    return request.post('user/verification', { data });
  },

  reset(data: commonData): Promise<any> {
    return request.post('user/password', { data });
  },
};
