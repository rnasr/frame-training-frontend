import axios from "../_helpers/axiosInstance.js";

const login = async (username, password) => {
    const data = {  username, password };
    let response = await axios.post('auth/login', data);
    return response.data.result;
}
const refreshToken = async (jwtToken, refreshToken) => {
    const data = {jwtToken, refreshToken};
    let response = await axios.post('auth/refresh', data);
    return response.data.result;
}

export const authApi = {
    login,
    refreshToken
}