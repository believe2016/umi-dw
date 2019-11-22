import http from '@/services/http';

export default {
  getUserInfo(data?: any): Promise<any> {
    return http.get('user',  {data});
  },
  getSumMsgCount(data?: any): Promise<any> {
    return http.get('sum/message/count',  {data});
  },
  getPatientMsg(data?: any): Promise<any> {
    return http.get('user/patient/message',  {data});
  },
};
