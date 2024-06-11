// axiosConfig.ts
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  // Add other Axios configurations as needed
});

const setupInterceptors = (
  logout: any,
  history: any,
  showSnackbar: (message: string, severity: string) => void
) => {
  // Add a request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // Add any request headers or modifications here
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      // Do something with successful responses
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Logout the user and redirect to the login page
        setTimeout(() => {
          logout();
        }, 2000);
        // history.push('/login');
      }

      if (error.response && error.response.status === 400) {
        let message = "";
        if (error.response.data instanceof Object) {
          message = error.response.data.error;
        } else if (error.response.data instanceof String) {
          try {
            const data = JSON.parse(error.response.data);
            message = data.error;
          } catch (e) {
            console.log(e);
          }
        }
        if (message) {
          showSnackbar(message, "error");
        }
      }
      return Promise.reject(error);
    }
  );
};

const initializeInterceptors = (
  logout: any,
  history: any,
  showSnackbar: (message: string, severity: string) => void
) => {
  setupInterceptors(logout, history, showSnackbar);
};

export { axiosInstance, initializeInterceptors };
