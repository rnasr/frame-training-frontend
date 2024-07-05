import React from "react";
import { Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
	const navigate = useNavigate();

	const handleNext = () => {
		navigate("/finish");
	};

	return (
		<Col>
			<h1>Feedback</h1>
			<p>Placeholder content for optional user feedback section.</p>
			<Button onClick={handleNext}>Finish Course</Button>
		</Col>
	);
}
