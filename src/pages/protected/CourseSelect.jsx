import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { courseApi } from "../../api/course.js";

export default function CourseSelect() {
	const navigate = useNavigate();
	const [availableCourses, setAvailableCourses] = useState(null);

	const getAvailableCourses = async () => {
		const courses = await courseApi.getAvailableCourses();
		setAvailableCourses(courses);
	};

	const startCourseAttempt = async (id) => {
		console.log ("Attempting to start course: " + id);
		try {
			const response = await courseApi.startCourseAttempt({courseId: id,});
			if (response) {
				navigate("/courseware");
			}
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		getAvailableCourses();
	}, []);

	return (
		<Col>
			<h1>Course Selection</h1>
			<hr />
			{availableCourses && availableCourses.length > 0 && (
				<Row className="ms-1 my-4">Please choose a course to proceed:</Row>
			)}
			{availableCourses && availableCourses.length > 0 && (
				<>
					{availableCourses.map((course) => (
							<Button className="w-100 mb-3 p-4" onClick={() => startCourseAttempt(course.courseId)}>
								{course.courseName}
							</Button>
					))}
				</>
			)}
		</Col>
	);
}
