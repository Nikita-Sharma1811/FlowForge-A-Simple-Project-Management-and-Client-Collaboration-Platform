import axios from '../../utils/axiosInstance';

export const loginAPI = (credentials) => {
  return axios.post('/user/login', credentials);
};

export const registerAPI = (userData) => {
  return axios.post('/user/register', userData);
};

export const getUserProfileAPI = () => {
  return axios.get('/user/profile');
};

export const getMyOrganisationAPI = () => {
  return axios.get('/user/organizations');
};

export const getUserOrganisationAPI = ({ userId }) => {
  return axios.get(`/user/${userId}/organizations`);
};
