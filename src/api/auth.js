import axios from "../_helpers/axiosInstance.js";

const login = async (username, passkey) => {
    const data = { username, passkey };
    let response = await axios.post('Auth/login', data);
    return response.data.result;
}
const refreshToken = async (jwtToken, refreshToken) => {
    const data = {jwtToken, refreshToken};
    let response = await axios.post('Auth/refresh', data);
    return response.data.result;
}

export const authApi = {
    login,
    refreshToken
}