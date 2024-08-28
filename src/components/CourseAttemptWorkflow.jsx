import React from "react";
import { useNavigate } from "react-router-dom";

function CourseAttemptWorkflow({children}) {
    const navigate = useNavigate();
    const courseAttemptId = sessionStorage.getItem('courseAttemptId');

    const pathsThatRequireCourseAttemptId = [
        "/courseware",
        "/assessment",
        "/results",
        "/feedback",
    ];

    if (!courseAttemptId && pathsThatRequireCourseAttemptId.includes(window.location.pathname)) {
        navigate("/course-select");
        return null;
    }

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}

export default CourseAttemptWorkflow;
