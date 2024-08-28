import React, { useState, useEffect } from "react";
import { Alert, Col, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

import { courseApi } from "../../api/course.js";

export default function Results() {
	const navigate = useNavigate();

	const courseAttemptId = sessionStorage.getItem('courseAttemptId');
	const [courseAttempt, setCourseAttempt] = useState(null);
	const [passingScore, setPassingScore] = useState(null);
	const [score, setScore] = useState(null);

	//Get current state of course attempt
	const getCourseAttempt = async () => {
		try {
			const response = await courseApi.getCourseAttempt(courseAttemptId);
			setCourseAttempt(response);
			if (response.possibleScore && response.passingScore){
				let passPercentage = (response.passingScore / response.possibleScore ) * 100;
				//round to 2 decimals
				passPercentage = Math.round((passPercentage + Number.EPSILON) * 100) / 100
				setPassingScore(passPercentage);
			}
			if (response.recordedScore){
				let scorePercentage = (response.recordedScore / response.possibleScore) * 100;
				scorePercentage = Math.round((scorePercentage + Number.EPSILON) * 100) / 100;
				setScore(scorePercentage);
			}

			console.log(response);
		} catch (e) {
			console.error(e);
		}
	};

	const completeCourseAttempt = async () => {
		try {
			await courseApi.completeCourseAttempt(courseAttemptId);
			sessionStorage.setItem('certificateCourseAttemptId', courseAttemptId);
			sessionStorage.removeItem('courseAttemptId');
		} catch (e) {
			console.error(e);
		}
	};

	const disableNext = () => {
		return !courseAttempt?.passed && !courseAttempt?.allowSubmissionOnFail;
	};

	const handleNext = () => {
		completeCourseAttempt();
		if (courseAttempt.askForFeedback) navigate("/feedback");
		else navigate("/finish");
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
					{courseAttempt.possibleScore == 0 && (
						<>
							<p className="ms-1 my-4 fs-5">
							Congratulations! You have completed this course.
							</p>
							<Alert variant="info">
								<p className="mt-3">If you wish to review specific components of the training before submitting your completion, <Link className="p-0" to="/courseware">click here.</Link></p>
							</Alert>
							<p>Please click the button below to submit your assessment	results:</p>
						</>
					)}
					{courseAttempt.possibleScore > 0 && (
						<>
						{courseAttempt && courseAttempt.showScoreToTrainee &&
							<>
								<p className="ms-1 my-4 fs-5">
									You got <strong>{courseAttempt.recordedScore} correct</strong> out of <strong>{courseAttempt.possibleScore}</strong>.
								</p>
								<p className="ms-1 my-4 fs-3">
									{courseAttempt.passed ? (
											<><i className="bi-check-circle-fill text-success fs-4"></i> You passed! Your score is {score}%</>
										) : (
											<><i className="bi-x-circle-fill text-danger fs-4"></i> Sorry you did not pass. Your score is {score}%</>
										)
									}
		
								</p>
							</>
						}
						<p className="ms-1 my fs-6">A score of {passingScore}% or more is considered a successful completion.</p>
						<Alert variant="info">
							<p className="mt-3">If you wish to retake the assessment, <Link className="p-0" to="/assessment">click here</Link>.</p>
							<p className="mt-3">If you wish to review specific components of the training before retaking the assessment, <Link className="p-0" to="/courseware">click here.</Link></p>
						</Alert>
						<p>If the preceding information is correct, please click the button below to submit your assessment	results:</p>
						</>
					)}
					
					
					
					
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
			<Button className='mt-5 w-100' onClick={handleNext} disabled={disableNext()}>Submit Assessment Results and Continue</Button>
		</Col>
	);
}
