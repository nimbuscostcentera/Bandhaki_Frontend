import React, { useState, useEffect, useRef } from "react";
import { Card, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";

const Calculator = () => {
  const [formData, setFormData] = useState({
    valuation: "",
    interestPercent: "",
    eligibleAmt: "",
    months: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const valuationRef = useRef(null);

  // Focus on valuation field on component mount
  useEffect(() => {
    if (valuationRef.current) {
      valuationRef.current.focus();
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { valuation, interestPercent, eligibleAmt, months } = formData;

  // Convert input values to numbers (using 0 if the input is empty)
  const valuationNum = parseFloat(valuation) || 0;
  const interestPercentNum = parseFloat(interestPercent) || 0;
  const eligibleAmtNum = parseFloat(eligibleAmt) || 0;
  const monthsNum = parseFloat(months) || 0;

  // Calculate values
  const interestPerMonthCalc = (eligibleAmtNum * interestPercentNum) / 100;
  const totalInterestCalc = interestPerMonthCalc * monthsNum;
  const totalEligibleCalc = eligibleAmtNum + totalInterestCalc;

  // Only display calculation results if inputs are provided
  const interestPerMonth =
    eligibleAmt === "" || interestPercent === "" ? "" : interestPerMonthCalc.toFixed(2);
  const totalInterest =
    eligibleAmt === "" || interestPercent === "" || months === ""
      ? ""
      : totalInterestCalc.toFixed(2);
  const totalEligible =
    eligibleAmt === "" || interestPercent === "" || months === ""
      ? ""
      : totalEligibleCalc.toFixed(2);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Validation: Eligible Amount should not be greater than Valuation
  const isEligibleInvalid =
    valuation !== "" && eligibleAmt !== "" && eligibleAmtNum > valuationNum;

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light text-dark min-vh-100"}>
      <Container className="py-5">
        <div className="d-flex justify-content-end align-items-center mb-3" style={{ height: "40px" }}>
          <i
            className={darkMode ? "bi bi-sun-fill" : "bi bi-moon-fill"}
            style={{ color: darkMode ? "#fcd34d" : "#6c757d", fontSize: "24px", cursor: "pointer" }}
            onClick={toggleTheme}
          ></i>
        </div>
        <Card className={`p-4 shadow-lg mx-auto ${darkMode ? "bg-secondary text-light" : "bg-white"}`} style={{ maxWidth: "700px" }}>
          <h4 className="mb-4 text-center">Interest Calculator</h4>
          <Form>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="valuation">
                  <Form.Label>Valuation</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter valuation"
                    value={valuation}
                    onChange={(e) => handleChange("valuation", e.target.value)}
                    ref={valuationRef}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="interestPercent">
                  <Form.Label>Interest %</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter interest %"
                    value={interestPercent}
                    onChange={(e) => handleChange("interestPercent", e.target.value)}
                    disabled={isEligibleInvalid}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="eligibleAmt">
                  <Form.Label>Eligible Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter eligible amount"
                    value={eligibleAmt}
                    onChange={(e) => handleChange("eligibleAmt", e.target.value)}
                    isInvalid={isEligibleInvalid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Eligible Amount cannot be greater than Valuation.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="months">
                  <Form.Label>How many months</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter months"
                    value={months}
                    onChange={(e) => handleChange("months", e.target.value)}
                    disabled={isEligibleInvalid}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="interestPerMonth">
                  <Form.Label>Interest Amount / Month</Form.Label>
                  <Form.Control type="number" value={interestPerMonth} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="totalInterest">
                  <Form.Label>Total Interest Amount</Form.Label>
                  <Form.Control type="number" value={totalInterest} readOnly />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group controlId="totalEligible">
                  <Form.Label>Total Amount (Eligible + Interest)</Form.Label>
                  <Form.Control type="number" value={totalEligible} readOnly />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Calculator;
