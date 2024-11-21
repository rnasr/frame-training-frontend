import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

function PLQOptionQuestion({options, question, values, handleChange, errors}) {
    const showSelect = options.length >= 10;
    console.log("errors", errors);
    return (
        <>
            {showSelect ? (
                <Form.Select
                    id={`select-${question.fieldToPopulate}`}
                    name={question.fieldToPopulate}
                    value={values[question.fieldToPopulate]}
                    onChange={handleChange}
                    isInvalid={!!errors[question.fieldToPopulate]}
                >
                    <option value="">Choose an option</option>
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </Form.Select>
            ) : (
                options.map(option => (
                    <Form.Check
                        type="radio"
                        label={option}
                        name={question.fieldToPopulate}
                        value={option}
                        checked={values[question.fieldToPopulate] === option}
                        onChange={handleChange}
                        isInvalid={!!errors[question.fieldToPopulate]}
                        key={option}
                    />
                ))
            )}
            {errors[question.fieldToPopulate] && (
                <Form.Control.Feedback type="invalid" className="d-block">
                    {errors[question.fieldToPopulate]}
                </Form.Control.Feedback>
            )}
        </>
    )
}

export default PLQOptionQuestion;