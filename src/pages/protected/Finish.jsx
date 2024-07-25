import React from "react";
import { Col, Button } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";

import rootStore from "../../stores/rootStore.js";
import { courseApi } from "../../api/course.js";

export default function Finish() {
    const navigate = useNavigate();

    const authStore = rootStore.authenticationStore;
    const courseAttemptId = sessionStorage.getItem('courseAttemptId');  
    const employeeGroup = useOutletContext();

    const getCertificate = async () => {
        try {
            await courseApi.getCertificate(courseAttemptId);
        } catch (e) {
            console.error(e);
        }
    };

    const handleNewCourse = () => {
        navigate("/course-select");
    };

    const handleCertificate = () => {
        getCertificate();
    };

    const handleLogout = () => {
        authStore.logout();
        navigate("/login");
    };
    
    return (
        <Col>
            <h1>Congratulations!</h1>
            <hr />
            <p className="mt-3">Thank you! Your completion has been recorded.</p>
            {employeeGroup && employeeGroup.showTakeAnotherCourse && <p>If you have additional courses to complete, please click the "Take Another Course" button.</p>}
            {employeeGroup && courseAttemptId && employeeGroup.generateCertificate && <Button className="mt-3 w-100" onClick={handleCertificate}>Download Certificate</Button>}
            {employeeGroup && employeeGroup.showTakeAnotherCourse && <Button className="mt-3 w-100" onClick={handleNewCourse}>Take Another Course</Button>}
            <Button className="mt-3 w-100" onClick={handleLogout}>Logout</Button>
        </Col>
    );
}
