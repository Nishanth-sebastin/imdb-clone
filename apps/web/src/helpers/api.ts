import axios from 'axios';
import { AxiosInstance } from 'axios';

const useAxios = (): AxiosInstance => {
  const baseURL = 'http://localhost:8085';
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Attach token to request headers
  axiosInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Refresh Token logic
  axiosInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      if (error.response?.status === 403) {
        try {
          const { data }: any = await axios.post('/auth/refresh');
          localStorage.setItem('accessToken', data.accessToken);
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return axios.request(error.config);
        } catch {
          localStorage.removeItem('accessToken');
        }
      }
      return Promise.reject(error);
    }
  );
  return axiosInstance;
};

export default useAxios;
