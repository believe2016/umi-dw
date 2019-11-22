import http from '@/services/http';

export default {
  updateWorkStatus(data?: any): Promise<any> {
    return http.patch('operator/workorder/status',  {data});
  },
};
