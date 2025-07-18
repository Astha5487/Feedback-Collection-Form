// axiosInstance.js or axios.config.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9191/api',
  withCredentials: true,
});

export default axiosInstance;
