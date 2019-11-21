import { extend } from 'umi-request';

export const auth = extend({
  prefix: `${process.env.BASEURL}${process.env.AUTH_NAMESPACE}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ZG9jdG9yX3dlYjo='
  },
  // @ts-ignore
  auth: { username: 'doctor_web' },
});

export const ajax = extend({
  prefix: `${process.env.BASEURL}${process.env.NAMESPACE}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

export default auth;
