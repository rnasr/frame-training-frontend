import React, { useState, useEffect } from "react";
import { Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import 'scorm-again';

import { courseApi } from "../../api/course.js";

export default function Courseware() {
	const navigate = useNavigate();

    const employeeGroup = useOutletContext();
	const courseAttemptId = sessionStorage.getItem('courseAttemptId');

	const [coursewareUrl, setCoursewareUrl] = useState(null);
	const [courseCompleted, setCourseCompleted] = useState(false);
	const [nextPage, setNextPage] = useState('');
	const [enableNext, setEnableNext] = useState(false);

	const getCourseConfig = async () => {
		try {
			const courseAttempt = await courseApi.getCourseAttempt(courseAttemptId);
			setCoursewareUrl(courseAttempt.courseLaunchUrl);
			if (courseAttempt.askAssessmentQuestions) {
				setNextPage("/assessment");
			} else {
				completeCourseAttempt(); 
				if (courseAttempt.askForFeedback) {
					setNextPage("/feedback");
				} else {
					setNextPage("/finish");
				}
			}
		} catch (e) {
			console.error(e);
		}
	};

	const completeCourseAttempt = async () => {
		try {
			await courseApi.completeCourseAttempt(courseAttemptId);
		} catch (e) {
			console.error(e);
		}
	};
	
	const handleNext = () => {
		navigate(nextPage);
	};

	useEffect(() => {
		getCourseConfig();
	}, []);

	useEffect(() => {
		if (employeeGroup.mustCompleteCourse && courseCompleted){
			setEnableNext(true);
		} else if (!employeeGroup.mustCompleteCourse){
			setEnableNext(true);
		} else {
			setEnableNext(false);
		}
	}, [employeeGroup, courseCompleted]);

	useEffect(() => {
		let courseWindow;
		var settings = {};
		setCourseCompleted(false);
		if (coursewareUrl) {
			window.API = new Scorm12API(settings);
			window.API_1484_11 = new Scorm2004API(settings);
			//SCORM 1.2 events
			window.API.on("LMSSetValue.cmi.core.lesson_status", function(CMIElement, value) {
				console.log("CMIElement : ", CMIElement);
				console.log("value : ", value);
				if (value === 'passed' || value === 'completed'){
					setCourseCompleted(true);
				}
			});

			//SCORM 2004 events
			window.API.on("LMSSetValue.cmi.completion_status", function(CMIElement, value) {
				console.log("CMIElement : ", CMIElement);
				console.log("value : ", value);
				if (value === 'completed'){
					setCourseCompleted(true);
				}
			});
			window.API.on("LMSSetValue.cmi.success_status", function(CMIElement, value) {
				console.log("CMIElement : ", CMIElement);
				console.log("value : ", value);
				if (value === 'passed'){
					setCourseCompleted(true);
				}
			});

			courseWindow = window.open(coursewareUrl, 'CourseWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=' + window.screen.availWidth + ',height=' + window.screen.availHeight);
			if (courseWindow) {
				courseWindow.moveTo(0, 0);

			} else {
				console.error("Popup blocked. Please allow popups for this site.");
			}
		}

		return () => {
			if (courseWindow) {
				courseWindow.close();
			}
		};
	}, [coursewareUrl]);

	return (
		<Col>
			<h1>Courseware</h1>
			<hr />
			<Alert variant="info" className="mt-5">
				<p className="ms-1 my-4">The course you have chosen should have popped up in a new window. If the course did not open, turn off your pop-up blocker for this site and click here to relaunch.</p>
				<p className="ms-1 my-4 d-flex align-items-center"><i className="bi-info-circle-fill text-info fs-4 mx-2"></i><strong> Please keep this window open while you are taking the course.</strong></p>
				<p className="ms-1 my-4">Once you have finished, click the button below to go to the Assessment section.</p>
			</Alert>

			<Button className='mt-5 w-100' onClick={handleNext} disabled={!enableNext}>{enableNext ? "Proceed to next section" : "You must complete the course to continue."}</Button>
		</Col>
	);
}
