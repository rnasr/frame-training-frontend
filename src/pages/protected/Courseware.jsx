import React from "react";
import { Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Courseware() {
	const navigate = useNavigate();

	const handleNext = () => {
		navigate("/assessment");
	};

	return (
		<Col>
			<h1>Courseware</h1>
			<hr />
			<Alert variant="info" className="mt-5">
			<Row className="ms-1 my-4">The course you have chosen should have popped up in a new window. If the course did not open, turn off your pop-up blocker for this site and click here to relaunch.</Row>
			<Row className="ms-1 my-4"><strong>Please keep this window open while you are taking the course.</strong></Row>
			<Row className="ms-1 my-4">Once you have finished, click the button below to go to the Assessment section.</Row>
			</Alert>
			<Button className='mt-5 w-100' onClick={handleNext}>Go to Assessment</Button>
		</Col>
	);
}
