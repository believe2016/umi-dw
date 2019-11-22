import http from '@/services/http';

export default {
  getCorrectedWorkOrder(data?: any): Promise<any> {
    return http.get('workorder/patient/amend/count',  {data});
  },
};
