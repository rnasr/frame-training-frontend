import React from "react";
import { Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CourseSelect() {
	const navigate = useNavigate();

	const handleNext = () => {
		navigate("/courseware");
	};

	return (
		<Col>
			<h1>Course Selection</h1>
			<p>Placeholder message about course selection (optional).</p>
			<Button onClick={handleNext}>Proceed to Courseware</Button>
		</Col>
	);
}
