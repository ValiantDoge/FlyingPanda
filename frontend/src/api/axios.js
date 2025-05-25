import axios from "axios";
import  useAuth  from '../hooks/useAuth';

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

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 error and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log("Token expired, attempting to refresh...");
        // Attempt to refresh token
        const auth = JSON.parse(localStorage.getItem('auth'));
        const response = await axiosInstance.post('api/auth/refresh-token', {
          refreshToken: auth?.refreshToken
        });
        
        console.log("Token refreshed successfully:", response.data.data.accessToken);
        // Update stored tokens
        const newAuth = {
          ...auth,
          accessToken: response.data.data.accessToken,
        };
        localStorage.setItem('auth', JSON.stringify(newAuth));
        
        // Update AuthContext if needed
        const { setAuth } = useAuth();
        if (setAuth) setAuth(newAuth);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - log user out
        const { setAuth } = useAuth();
        if (setAuth) setAuth(null);
        localStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);


export default axiosInstance;



