import axios from 'axios';
import API_BASE_URL from '../consants/ApiContants';

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const legacyUser = JSON.parse(localStorage.getItem('user') || 'null');
    const authUser = JSON.parse(localStorage.getItem('authUser') || 'null');
    const token = localStorage.getItem('authToken') || authUser?.authToken || legacyUser?.authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
