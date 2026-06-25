import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { resetPassword } from "../services/authService";
const ChangeNewPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!password || !confirmPassword) {
    setError("Please fill all fields");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const response = await resetPassword(token, password);

    setSuccess(
      response.data.message || "Password reset successfully!"
    );

    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to reset password"
    );
  } finally {
    setLoading(false);
  }
};

  return (
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
                  Create New Password
                </h2>

                <p className="text-center text-muted mb-4">
                  Create a new password for your account.
                </p>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>

                    <div className="position-relative">
                        <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />

                        <i
                        className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: "absolute",
                            right: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#6c757d",
                        }}
                        ></i>
                    </div>
                    </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>

                    <div className="position-relative">
                        <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <i
                        className={`bi ${
                            showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={{
                            position: "absolute",
                            right: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#6c757d",
                        }}
                        ></i>
                    </div>
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
                    {loading ? "Updating..." : "Reset Password"}
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
  );
};

export default ChangeNewPassword;