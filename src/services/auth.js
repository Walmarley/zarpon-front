import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3333',
});

export default {
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/authenticate', credentials);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async getUser() {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};