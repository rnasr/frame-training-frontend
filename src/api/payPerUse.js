import axios from "../_helpers/axiosInstance.js";
import { authHeader } from "../_helpers/authHeader.js";

/* Get courses available for pay per use purchase */
const getPpuCourses = async () => {
    return axios.get('PayPerUse/course', {headers: authHeader()}).then(response => response.data.result);
}

/* Get details needed for the payment page */
const getPaymentPageDetails = async (courseQuantities, country) => {
    const data = JSON.stringify({courseQuantities, country});
    const response = await axios.post('PayPerUse/paymentPage', data, {headers: authHeader()});
    return response.data;
}

/* Complete the order after a successful payment */
const completeOrder = async (values) => {
    const data = JSON.stringify(values);
    return axios.post('PayPerUse/complete', data, {headers: authHeader()}).then(response => response.data.result);
}

export const payPerUseApi = {
    getPpuCourses,
    getPaymentPageDetails,
    completeOrder
}