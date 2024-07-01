import axios from "./axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

const setupInterceptors = (rootStore) => {
    const store = rootStore;
    /**
     * This interceptor's job is to attach the bearer token to every request that requires it so that we don't have
     * to do that explicitly for every service call.
     */
    axios.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            console.error(error);
            return Promise.reject(error);
        }
    );

    /**
     * This interceptor's responsibility is to detect an expired JWT token and to request a new one. This will be
     * completely transparent to the application. The failed call will then be retried with the new token
     */
    axios.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            console.error(err);
            const originalConfig = err.config;
            const authStore = store.authenticationStore;
            if (err.response.status == 400 || err.response.status == 500){
                var message = "An error occurred. Please try again."
                if (err.response?.data?.error?.errorDescription !== null ){
                    message = err.response.data.error.errorDescription
                } else if (err.message !== null){
                    message = err.message;
                } else {
                    message ="An error has occurred: " + JSON.stringify(err);
                }
                console.log(message);
                //todo: show an error
            }
            if (originalConfig.url !== "/auth/login" && originalConfig.url !== "/auth/refresh"
                && err.response) {
                // Access Token was expired so lets try to refresh it
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;
                    await authStore.refreshToken();
                    var newJwtToken = authStore.authentication.jwtToken
                    originalConfig.headers.Authorization = `Bearer ${newJwtToken}`;
                    return axios(originalConfig);
                }
            }
            if (err.response && originalConfig.url === "/user/refresh"){
                authStore.logout();
            }
            return Promise.reject({err,message:err.response?.data?.error?.errorDescription});
        }
    );
};

export default setupInterceptors;
