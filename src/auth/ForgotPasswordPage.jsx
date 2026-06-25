import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { forgotPassword } from "../services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    setError("Please enter your email address");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await forgotPassword(email);

    setSuccess(
      response.data.message ||
      `Password reset link has been sent to ${email}`
    );

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to send reset link"
    );
  } finally {
    setLoading(false);
  }
};

  return (
     <>
      
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card
              className="shadow-lg border-0"
              style={{ borderRadius: "20px" }}
            >
              <Card.Body className="p-4 p-md-5">
                <h2
                  className="text-center fw-bold mb-3"
                  style={{ color: "#7c3aed" }}
                >
                  Forgot Password
                </h2>

                <p className="text-center text-muted mb-4">
                  Enter your registered email address and we'll send you a reset link.
                </p>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 text-white fw-semibold"
                    style={{
                      background:
                        "linear-gradient(90deg,#9333ea,#7c3aed)",
                      border: "none",
                      padding: "12px",
                      borderRadius: "10px",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    style={{
                      color: "#7c3aed",
                      textDecoration: "none",
                      fontWeight: "600",
                    }}
                  >
                    ← Back to Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    </>
  );
};

export default ForgotPasswordPage;