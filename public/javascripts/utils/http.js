import axios from 'axios';
import { BASE_URL } from '@/constants/api';
import Vue from 'vue';
import { opener, pack } from 'pack-opener';

const instance = axios.create({
  baseURL: BASE_URL, // 设置统一请求地址
  withCredentials: true, // 跨域请求时是否需要使用凭证
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response.status === 401) {
      if (err.response.data.message === '当前用户权限不足') {
        Vue.prototype.$noPermission();
      }
      // const data = {
      //   code: -1,
      //   message: err.response.data.message,
      // };
      // return Promise.reject(data);
    }

    return Promise.reject(err.response);
  },
);

async function MetroApi(config = {}) {
  const {
    method = 'post',
    url = '',
    data = {},
    headers = {},
    tipError = true,
  } = config;
  const opt = { data, url, method, headers };

  if (method.toLowerCase() === 'get') {
    opt.params = data;
  }
  try {
    const res = await instance.request(opt);
    return res.data;
  } catch (err) {
    tipError;
    throw err;
  }
}

export default MetroApi;

window.opener = opener;
window.pack = pack;
opener.baseUrl = '/chart/';
export function load(id) {
  return new Promise((resolve, reject) => {
    try {
      opener(id, (text) => {
        resolve(text);
      });
    } catch (err) {
      reject(err);
    }
  });
}
