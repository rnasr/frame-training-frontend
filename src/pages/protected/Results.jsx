import React, { useState, useEffect } from "react";
import { Alert, Col, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

import { courseApi } from "../../api/course.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useCourseAttempt } from "../../contexts/CourseAttemptContext.jsx";

export default function Results() {
	const navigate = useNavigate();
	const courseAttemptContext = useCourseAttempt();
	const [passingScore, setPassingScore] = useState(null);
	const [score, setScore] = useState(null);
	const courseAttempt = courseAttemptContext.courseAttempt;
	
	//Get current state of course attempt
	const refreshCourseAttempt = async () => {
		try {
			const response = await courseApi.getCourseAttempt(courseAttempt.id);
			courseAttemptContext.setCourseAttempt(response);
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
			await courseApi.completeCourseAttempt(courseAttempt.id);
			sessionStorage.setItem('certificateCourseAttemptId', courseAttempt.id);
			sessionStorage.removeItem('courseAttemptId');
			courseAttemptContext.setCourseAttempt(null);
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
		if (courseAttempt){
			refreshCourseAttempt();
		} else {
			navigate("/course-select");
		}
	}, []);

	return (
		<Col>
			<h1>Review Results</h1>
			<hr />
			{courseAttempt && (
				<>
					{courseAttempt.passed && (
						<>
							<p className="ms-1 my-4 fs-5">
							Congratulations! You have completed this course.
							</p>

						</>
					)}
					{!courseAttempt.passed && (
						<>
							{courseAttempt.allowSubmissionOnFail && (
								<>
									<p className="ms-1 my-4 fs-5">
									You have completed this course
									</p>
									<Alert variant="info">
										<p className="mt-3">To retake the assessment, <Link className="p-0" to="/assessment">click here</Link>.</p>
										<p className="mt-3">To review specific components of the training before retaking the assessment, <Link className="p-0" to="/courseware">click here.</Link></p>
									</Alert>
									<p>If the following information is correct, please click the button below to submit your assessment	results:</p>
								</>
							)}
							{!courseAttempt.allowSubmissionOnFail && (
								<>
									<p className="ms-1 my-4 fs-5">
									Sorry that you have not passed this course
									</p>
									<Alert variant="info">
										<p className="mt-3">To retake the assessment, <Link className="p-0" to="/assessment">click here</Link>.</p>
										<p className="mt-3">To review specific components of the training before retaking the assessment, <Link className="p-0" to="/courseware">click here.</Link></p>
									</Alert>
								</>
							)}
							
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
											<><i className="bi-x-circle-fill text-danger fs-4"></i> Your score is {score}%</>
										)
									}
		
								</p>
							</>
						}
						<p className="ms-1 my fs-6">A score of {courseAttempt.passingScore}% or more is considered a successful completion.</p>
						<Alert variant="info">
							<p className="mt-3">If you wish to retake the assessment, <Link className="p-0" to="/assessment">click here</Link>.</p>
							<p className="mt-3">If you wish to review specific components of the training before retaking the assessment, <Link className="p-0" to="/courseware">click here.</Link></p>
						</Alert>
						<p>If the following information is correct, please click the button below to submit your assessment	results:</p>
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
