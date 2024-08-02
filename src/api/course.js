/* This file contains all course related API calls aside from auth, listed in order of program flow. */

import axios from "../_helpers/axiosInstance.js";
import {authHeader} from "../_helpers/authHeader.js";

/* Get Employee Group Details for the group associated with the JWT token */
const getEmployeeGroup = async () => {
    try {
        const response = await axios.get('EmployeeGroup', {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Get Post Login Questions for group */
const getPostLoginQuestions = async () => {
    try {
        const response = await axios.get('PostLoginQuestion', {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Get Available Courses for this employee group */
const getAvailableCourses = async () => {
    try {
        const response = await axios.get('AvailableCourse', {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Register new course attempt and record Post Login Question answers if they exist */
const startCourseAttempt = async (values) => {
    const data = JSON.stringify(values);
    console.log(data);
    try {
        const response = await axios.post('CourseAttempt', values, {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Get Course Attempt details including Post Login Question answers and score*/
const getCourseAttempt = async (attemptId) => {
    try {
        const response = await axios.get(`CourseAttempt/${attemptId}`, {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Update Course Attempt details */
const updateCourseAttempt = async (values) => {
    const data = JSON.stringify(values);
    try {
        const response = await axios.put('CourseAttempt', data, {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/*Get Assessment Questions */
const getAssessmentQuestions = async (attemptId) => {
    try {
        const response = await axios.get(`Assessment/courseattempt/${attemptId}`, {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Record Answers for Assessment */
const recordAssessmentAnswers = async (values) => {
    const data = JSON.stringify(values);
    try {
        const response = await axios.post('Assessment', data, {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Complete Course Attempt */
const completeCourseAttempt = async (attemptId) => {
    try {
        const response = await axios.put('CourseAttempt/complete', {id: attemptId}, {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Get Feedback Questions */
const getFeedbackQuestions = async () => {
    try {
        const response = await axios.get('Feedback', {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Submit Feedback */
const submitFeedback = async (values) => {
    const data = JSON.stringify(values);
    try {
        const response = await axios.post('Feedback', data, {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

/* Get Certificate */
const getCertificate = async (attemptId) => {
    try {
        const response = await axios.get(`Certificate/CourseAttempt/${attemptId}`, {
            headers: authHeader(),
            responseType: 'blob' // Important for downloading binary data
        });

        const filename = getFileNameFromContentDisposition(response.headers['content-disposition']);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error(e);
    }
}

const getFileNameFromContentDisposition = (contentDisposition) => {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
    if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, '');
    }
    return 'certificate.pdf';
}


export const courseApi = {
    getEmployeeGroup,
    getPostLoginQuestions,
    getAvailableCourses,
    startCourseAttempt,
    getCourseAttempt,
    updateCourseAttempt,
    getAssessmentQuestions,
    recordAssessmentAnswers,
    completeCourseAttempt,
    getFeedbackQuestions,
    submitFeedback,
    getCertificate
}
