import http from '@/services/http';

export default {
  isValid(data?: any): Promise<any> {
    return http.get('notification/valid',  {data});
  },
  updateDesc(data?: any): Promise<any> {
    return http.patch('consultation/description',  {data});
  },
};
