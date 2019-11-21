import http from '@/services/http';

export default {
  getUserInfo(data?: any): Promise<any> {
    return http.get('user', data || {});
  },
  getUserInfo22(data?: any): Promise<any> {
    return http.get('user', data || {});
  },
};
