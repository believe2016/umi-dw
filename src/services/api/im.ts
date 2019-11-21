import http from '@/services/http';

export default {
  getAccid(data: commonData): Promise<any> {
    return http.get('chat/session/user/accid', { data });
  },
};
