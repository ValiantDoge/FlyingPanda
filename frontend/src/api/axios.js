import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = JSON.parse(localStorage.getItem('auth'));

    if (auth?.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosInstance;



