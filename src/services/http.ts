/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { Base64 } from 'js-base64';

const codeMessage = {
  400: '请求参数错误',
  450:'业务处理失败',
  500: '服务异常',
  550: '服务暂不可用',
  2001:'没找到用户',
  2002:'该手机号已被注册',
  2003:'医生存在绑定患者，不能被删除',
  2004:'不合法的绑定关系',
  2005:'当前用户无权发送采集表',
  2006:'重置用户密码失败',
  2007:'新密码必须和原密码不同',
  2008:'密码错误',
  2009:'密码格式错误',
  2010:'用户状态异常',
  2011:'更新用户信息失败',
  2101:'没有找到医院',
  2102:'无法添加部门',
  2103:'科室名称已经存在',
  18001:'发送短信过于频繁',
  18002:'验证码不正确',
  18003:'发送验证码失败',
  2015:'当前医助没有关联的患者',
  2211:'获取药品关联禁忌症失败',
  2300:'医生不能修改医嘱',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数s
 */
const headers: any = {};

const http = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  timeout: 10000,
  headers,
  prefix: `${process.env.BASEURL}${process.env.NAMESPACE}`,
});

http.interceptors.request.use((url, options) => {
  if (options.method === 'get') {
    return {
      url,
      options: {
        ...options,
        params: options.data
      }
    }
  }
  return {
    url,
    options,
  };
});

http.interceptors.response.use(async (response: Response) => {
  const resData = await response.clone().json();
  const authUrl = ['user/password', 'user/verification', 'token'];
  const isWhiteList = authUrl.some(url => response.url.includes(url));
  if (isWhiteList) {
    return response;
  } else {
    const { status, data } = resData;
    if (status === 'fail') {
      const msg = data.message || data.result || '请求失败';
      return Promise.reject(msg);
    } if (status === 'error') {
      return Promise.reject(data.message);
    }
    return data;
  }
});

export function setAuthorizationToken(token: string) {
  if (token) {
    // console.log('request', http);
    headers.Authorization = `Bearer ${token}`;
  } else {
    delete headers.Authorization;
  }
}
export function setHeader(headerObj: any) {
  const ref: string = Base64.encode(JSON.stringify(headerObj));
  // console.log(obj);
  localStorage.setItem('relationRef', ref);
  headers.relationRef = ref;
}
export default http;
