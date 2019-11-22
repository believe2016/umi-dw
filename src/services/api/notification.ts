import http from '@/services/http';

export default {
  getNotifications(data?: any): Promise<any> {
    return http.get('notification',  {data});
  },
  isValid(data?: any): Promise<any> {
    return http.get('notification/valid',  {data});
  },
  update(data?: any): Promise<any> {
    return http.patch('notification',  {data});
  },
};
