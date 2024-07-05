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

/* Register new course attempt and record Post Login Question answers if they exist */
const startCourseAttempt = async (values) => {

    const data = JSON.stringify(values);

    try {
        const response = await axios.post('CourseAttempt', data, {headers:authHeader()});
        return response.data.result;
    } catch (e) {
        console.error(e);
    }
}

const recordAssessmentAnswers = async (values) => {
    const data = JSON.stringify(values);
    try {
        const response = await axios.post('Assessment', data, {headers:authHeader()});
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

/* Get Course Attempt details including Post Login Question answers and score*/
const getCourseAttempt = async (attemptId) => {
    try {
        const response = await axios.get(`CourseAttempt/${attemptId}`, {headers:authHeader()});
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

export const courseApi = {
    getEmployeeGroup,
    getPostLoginQuestions,
    getAvailableCourses,
    startCourseAttempt,
    recordAssessmentAnswers,
    getCourseAttempt,
    getFeedbackQuestions,
    submitFeedback
}