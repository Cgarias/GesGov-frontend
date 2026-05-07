import api from './axios.config';

export const authApi = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // { accessToken, user }
  },

  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
