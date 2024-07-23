import React, { useState, useEffect } from "react";
import { Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";

import { courseApi } from "../../api/course.js";

export default function Courseware() {
	const navigate = useNavigate();

    const employeeGroup = useOutletContext();
	const courseAttemptId = sessionStorage.getItem('courseAttemptId');
	
	const [coursewareUrl, setCoursewareUrl] = useState(null);
	const [courseCompleted, setCourseCompleted] = useState(false);

	const getCoursewareUrl = async () => {
		try {
			const response = await courseApi.getCourseAttempt(courseAttemptId);
			setCoursewareUrl(response.courseLaunchUrl);
			console.log(response.courseLaunchUrl);
		} catch (e) {
			console.error(e);
		}
	};

	const disableNext = () => {

		// Enable button if course completion is not required, or course is completed
		if (employeeGroup && !employeeGroup.mustCompleteCourse) {
			return false;			
		} else if (courseCompleted) {
			return false;
		}

		// If required course is not completed, disable button
		return true;
	};

	const handleNext = () => {
		navigate("/assessment");
	};

	useEffect(() => {
		getCoursewareUrl();
	}, []);

	return (
		<Col>
			<h1>Courseware</h1>
			<hr />
			<Alert variant="info" className="mt-5">
				<p className="ms-1 my-4">The course you have chosen should have popped up in a new window. If the course did not open, turn off your pop-up blocker for this site and click here to relaunch.</p>
				<p className="ms-1 my-4 d-flex align-items-center"><i className="bi-info-circle-fill text-info fs-4 mx-2"></i><strong> Please keep this window open while you are taking the course.</strong></p>
				<p className="ms-1 my-4">Once you have finished, click the button below to go to the Assessment section.</p>
			</Alert>
			{coursewareUrl && (
				<>
					{/* if courseware url exists, launch course and then store completion status in courseCompleted */}
				</>
			)}
			<Button className='mt-5 w-100' onClick={handleNext} disabled={disableNext()}>Go to Assessment</Button>
		</Col>
	);
}
