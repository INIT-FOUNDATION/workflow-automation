import axios from "axios";

const axiosInstance = axios.create({

  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Add other Axios configurations as needed
  
});
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);


const setupInterceptors = (
  logout: any,
  history: any,
  showSnackbar: (message: string, severity: string) => void
) => {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      if (process.env.REACT_APP_ENV === 'local') {
        if (config.url && config.url.indexOf("/api/v1/auth") !== -1) {
          config.baseURL = process.env.REACT_APP_AUTH_BASE_URL;
        } else if (config.url && config.url.indexOf("/api/v1/admin") !== -1) {
          config.baseURL = process.env.REACT_APP_ADMIN_BASE_URL;
        } else if (config.url && config.url.indexOf("/api/v1/user") !== -1) {
          config.baseURL = process.env.REACT_APP_USER_BASE_URL;
        } else if (config.url && config.url.indexOf("/api/v1/forms") !== -1) {
          config.baseURL = process.env.REACT_APP_FORMS_BASE_URL;
        } else if (config.url && config.url.indexOf("/api/v1/workflows") !== -1) {
          config.baseURL = process.env.REACT_APP_WORKFLOWS_BASE_URL;
        }
      }      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // if (error.response && error.response.status === 401) {
      //   setTimeout(() => {
      //     logout();
      //   }, 2000);
      // }

      if (error.response && error.response.status === 400) {
        let message = "";
        if (error.response.data instanceof Object) {
          message = error.response.data.error;
        } else if (typeof error.response.data === "string") {
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