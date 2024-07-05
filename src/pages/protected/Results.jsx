import React from "react";
import { Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Results() {
	const navigate = useNavigate();

	const handleNext = () => {
		navigate("/feedback");
	};

	return (
		<Col>
			<h1>Results</h1>
			<p>Placeholder content for displaying assessment results.</p>
			<Button onClick={handleNext}>Leave Feedback (Optional)</Button>
		</Col>
	);
}
