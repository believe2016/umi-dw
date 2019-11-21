// 此文件会在入口文件的最前面被自动引入，可以在这里加载补丁，做一些初始化的操作等。

import { setAuthorizationToken } from "@/services/http";
const token = localStorage.getItem('access_token');

if (token) {
  // 刷新
  setAuthorizationToken(token);
}
