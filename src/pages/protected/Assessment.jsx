import React from "react";
import { Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Assessment() {
	const navigate = useNavigate();

	const handleNext = () => {
		navigate("/results");
	};

	return (
		<Col>
			<h1>Assessment</h1>
			<p>Placeholder content for the assessment section.</p>
			<Button onClick={handleNext}>See Your Results</Button>
		</Col>
	);
}
