import React from "react";
import { Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Courseware() {
	const navigate = useNavigate();

	const handleNext = () => {
		navigate("/assessment");
	};

	return (
		<Col>
			<h1>Courseware</h1>
			<p>Placeholder content for course materials and learning modules.</p>
			<Button onClick={handleNext}>Go to Assessment</Button>
		</Col>
	);
}
