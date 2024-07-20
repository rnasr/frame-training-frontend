import React, { useState, useEffect } from "react";
import { Alert, Row, Col, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";


import { courseApi } from "../../api/course.js";

export default function Results() {
	const navigate = useNavigate();

	const courseAttemptId = sessionStorage.getItem('courseAttemptId');
	const [courseAttempt, setCourseAttempt] = useState(null);

	//Get current state of course attempt
	const getCourseAttempt = async () => {
		try {
			const response = await courseApi.getCourseAttempt(courseAttemptId);
			setCourseAttempt(response);
			console.log(response);
		} catch (e) {
			console.error(e);
		}
	};

	const handleNext = () => {
		navigate("/feedback");
	};

	useEffect(() => {
		getCourseAttempt();
	}, []);

	return (
		<Col>
			<h1>Assessment Results</h1>
			<hr />
			{courseAttempt && (
				<>
					<p className="ms-1 my-4 fs-5">You got <strong>{courseAttempt.recordedScore} correct</strong> out of <strong>{courseAttempt.possibleScore}</strong>.</p>
					<p className="ms-1 my-4 fs-3"><i className="bi-check-circle-fill text-success fs-4"></i> Your score is {courseAttempt.recordedScore / courseAttempt.possibleScore * 100}%</p>
					<p className="ms-1 my fs-6">A score of 80% or more is considered a successful completion.</p>
					<Alert variant="info">
						<p className="mt-3">If you wish to retake the assessment, <Link className="p-0" to="/assessment">click here</Link>.</p>
						<p className="mt-3">If you wish to review specific components of the training before retaking the assessment, <Link className="p-0" to="/courseware">click here.</Link></p>
					</Alert>
					<p>If the following information is correct, please click the button below to submit your assessment	results:</p>
					<div className="mx-1 my-4">
                        {courseAttempt.firstName && <p><strong>First Name:</strong> {courseAttempt.firstName}</p>}
                        {courseAttempt.lastName && <p><strong>Last Name:</strong> {courseAttempt.lastName}</p>}
                        {courseAttempt.employeeNumber && <p><strong>Employee Number:</strong> {courseAttempt.employeeNumber}</p>}
                        {[...Array(10).keys()].map(i => (
                            courseAttempt[`otherFieldName${i + 1}`] && courseAttempt[`otherField${i + 1}`] && (
                                <p key={i}><strong>{courseAttempt[`otherFieldName${i + 1}`]}:</strong> {courseAttempt[`otherField${i + 1}`]}</p>
                            )
                        ))}
                    </div>					
				</>
			)}
			<Button className='mt-5 w-100' onClick={handleNext}>Submit Assessment Results and Continue</Button>
		</Col>
	);
}
