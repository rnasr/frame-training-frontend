import axios from "../_helpers/axiosInstance.js";
import {authHeader} from "../_helpers/authHeader.js";

/* Get courses available for pay per use purchase */
const getPpuCourses = async () => {
    try {
        const response = await axios.get('PayPerUse/course', {headers: authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Get details needed for the payment page */
const getPaymentPageDetails = async (values) => {
    const data = JSON.stringify(values);
    try {
        const response = await axios.post('PayPerUse/paymentPage', data, {headers: authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Complete the order after a successful payment */
const completeOrder = async (values) => {
    const data = JSON.stringify(values);
    try {
        const response = await axios.post('PayPerUse/complete', data, {headers: authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

export const payPerUseApi = {
    getPpuCourses,
    getPaymentPageDetails,
    completeOrder
}
