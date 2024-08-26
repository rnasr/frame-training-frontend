/* This file contains all course related API calls aside from auth, listed in order of program flow. */

import axios from "../_helpers/axiosInstance.js";
import { authHeader } from "../_helpers/authHeader.js";

/* Get Employee Group Details for the group associated with the JWT token */
const getEmployeeGroup = async () => {
    return axios.get('EmployeeGroup', {headers:authHeader()}).then(response => response.data.result);
}

/* Get Post Login Questions for group */
const getPostLoginQuestions = async () => {
    return axios.get('PostLoginQuestion', {headers:authHeader()}).then(response => response.data.result);
}

/* Get Available Courses for this employee group */
const getAvailableCourses = async () => {
    return axios.get('AvailableCourse', {headers:authHeader()}).then(response => response.data.result);
}

/* Register new course attempt and record Post Login Question answers if they exist */
const startCourseAttempt = async (values) => {
    const data = JSON.stringify(values);
    console.log(data);
    return axios.post('CourseAttempt', values, {headers:authHeader()}).then(response => response.data.result);
}

/* Get Course Attempt details including Post Login Question answers and score*/
const getCourseAttempt = async (attemptId) => {
    return axios.get(`CourseAttempt/${attemptId}`, {headers:authHeader()}).then(response => response.data.result);
}

/* Update Course Attempt details */
const updateCourseAttempt = async (values) => {
    const data = JSON.stringify(values);
    return axios.put('CourseAttempt', data, {headers:authHeader()}).then(response => response.data.result);
}

/*Get Assessment Questions */
const getAssessmentQuestions = async (attemptId) => {
    return axios.get(`Assessment/courseattempt/${attemptId}`, {headers:authHeader()}).then(response => response.data.result);
}

/* Record Answers for Assessment */
const recordAssessmentAnswers = async (values) => {
    const data = JSON.stringify(values);
    return axios.post('Assessment', data, {headers:authHeader()}).then(response => response.data.result);
}

/* Complete Course Attempt */
const completeCourseAttempt = async (attemptId) => {
    return axios.put('CourseAttempt/complete', {id: attemptId}, {headers:authHeader()}).then(response => response.data.result);
}

/* Get Feedback Questions */
const getFeedbackQuestions = async () => {
    return axios.get('Feedback', {headers:authHeader()}).then(response => response.data.result);
}

/* Submit Feedback */
const submitFeedback = async (values) => {
    const data = JSON.stringify(values);
    return axios.post('Feedback', data, {headers:authHeader()}).then(response => response.data.result);
}

/* Get Certificate */
const getCertificate = async (attemptId) => {
    return axios.get(`Certificate/CourseAttempt/${attemptId}`, {
        headers: authHeader(),
        responseType: 'blob' // Important for downloading binary data
    }).then(response => {
        const filename = getFileNameFromContentDisposition(response.headers['content-disposition']);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
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