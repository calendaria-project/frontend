/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';
import qs from 'qs';

axios.defaults.headers.common['X-Frame-Options'] = 'SAMEORIGIN';
axios.defaults.paramsSerializer = (params) => qs.stringify(params, { arrayFormat: 'repeat' });

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    if (!config.headers) {
      config.headers = {};
    }
    const token = localStorage.getItem('alageum_token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
)

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      (error?.response?.status === 409 || error?.response?.status === 400) &&
      !Array.isArray(error?.response?.data)
    ) {
      console.log(error?.response?.data ? `error:${error?.response?.data}` : '400 Bad Request');
    }

    if (error?.response?.status === 403) {
      return Promise.reject(false);
    }

    return Promise.reject(error);
  },
);

export default axios;
