import axios from "./axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

const setupInterceptors = (getAuthContext) => {

    // Remove all request interceptors
    axios.interceptors.request.handlers = [];
    // Remove all response interceptors
    axios.interceptors.response.handlers = [];

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
            const authContext = getAuthContext();
            console.log("AuthContext", authContext);
            console.error(err);
            const originalConfig = err.config;
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
            }
            const reqUrl = originalConfig.url.toLowerCase();
            console.log("REQ URL: " + reqUrl);
            if (reqUrl !== "auth/login" && reqUrl !== "auth/refresh"
                && err.response) {
                // Access Token was expired so lets try to refresh it
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;
                    const newJwtToken = await authContext.refreshToken();
                    console.log("old token", authContext.authentication.jwtToken);
                    console.log("new token", newJwtToken);
                    originalConfig.headers.Authorization = `Bearer ${newJwtToken}`;
                    return axios(originalConfig);
                }
            }
            if (err.response && reqUrl === "auth/refresh"){
                console.log("COULD NOT REFRESH... LOGGING OUT")
                authContext.logout();
            }
            return Promise.reject({err,message:err.response?.data?.error?.errorDescription});
        }
    );
};

export default setupInterceptors;
