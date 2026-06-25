import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { loginUser, sendLoginOtp, mobileLogin } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();

  // Login Method Toggle: "email" or "mobile"
  const [loginMethod, setLoginMethod] = useState("email");

  // Email login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Mobile login states
  const [mobile, setMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Common UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cooldown timer handler
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Validation helpers
  const getEmailError = (val) => {
    if (!val) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val) ? "" : "Please enter a valid email address";
  };

  const getPasswordError = (val) => {
    if (!val) return "";
    if (val.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const getMobileError = (val) => {
    if (!val) return "";
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(val) ? "" : "Please enter a valid 10-digit mobile number";
  };

  const getOtpError = (val) => {
    if (!val) return "";
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(val) ? "" : "OTP must be a 6-digit number";
  };

  const emailError = getEmailError(email);
  const passError = getPasswordError(password);
  const mobileError = getMobileError(mobile);
  const otpError = getOtpError(otpCode);

  // Send login OTP action
  const handleSendOtp = async () => {
    if (!mobile || mobileError) return;
    setError("");
    setSendingOtp(true);
    try {
      await sendLoginOtp(mobile);
      setOtpSent(true);
      setCooldown(30); // 30 seconds resend cooldown
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Login submission handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;
      if (loginMethod === "email") {
        if (!email || !password || emailError || passError) return;
        response = await loginUser(email, password);
      } else {
        if (!mobile || !otpCode || mobileError || otpError || !otpSent) return;
        response = await mobileLogin(mobile, otpCode);
      }

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirects
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "staff") navigate("/staff/dashboard");
      else navigate("/customer/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (value, errorMsg) => {
    if (!value) return "form-control-custom";
    return errorMsg ? "form-control-custom is-invalid-custom" : "form-control-custom is-valid-custom";
  };

  const getMobileInputClass = (value, errorMsg) => {
    if (!value) return "form-control-custom";
    return errorMsg ? "form-control-custom is-invalid-custom" : "form-control-custom";
  };

  return (
    <div className="login-page-scope login-bg">
      <Container>
        <Row className="justify-content-center">
          <Col xs={11} sm={8} md={5} lg={4} className="login-card-container">
            <Card className="login-card-wrapper border-0">
              <div className="login-border-title">
                hi, welcome back
              </div>

              <Card.Body className="p-4 p-md-5 mt-2 login-card-body-fixed">
                {/* Top Section: Logo, Tabs, Forms */}
                <div>
                  {/* Brand Logo Section */}
                  <div className="text-center mb-3">
                    <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#00685f', margin: 0, letterSpacing: '-0.02em' }}>
                      CreativeWS
                    </h1>
                  </div>

                  {/* Tab Navigation Segment Controls */}
                  <div className="login-tabs-container">
                    <button
                      type="button"
                      className={`login-tab-btn ${loginMethod === "email" ? "active" : "inactive"}`}
                      onClick={() => {
                        setLoginMethod("email");
                        setError("");
                      }}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      className={`login-tab-btn ${loginMethod === "mobile" ? "active" : "inactive"}`}
                      onClick={() => {
                        setLoginMethod("mobile");
                        setError("");
                      }}
                    >
                      Mobile
                    </button>
                  </div>

                  {error && (
                    <Alert variant="danger" className="py-2 px-3 small border-0 animate__animated animate__fadeIn mb-3" style={{ borderRadius: "8px", backgroundColor: "#ffdad6", color: "#93000a" }}>
                      {error}
                    </Alert>
                  )}

                  {/* Email Form */}
                  {loginMethod === "email" && (
                    <Form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-2">
                      <Form.Group>
                        <Form.Label className="form-label-custom">email</Form.Label>
                        <Form.Control
                          type="email"
                          className={getInputClass(email, emailError)}
                          placeholder="Enter email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        {email && emailError && (
                          <span className="validation-error-text">{emailError}</span>
                        )}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label className="form-label-custom">password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            className={getInputClass(password, passError)}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <i
                            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: "absolute",
                              right: "14px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                              fontSize: "18px",
                              color: "#3d4947",
                            }}
                          />
                        </div>
                        {password && passError && (
                          <span className="validation-error-text">{passError}</span>
                        )}
                      </Form.Group>

                      <div className="text-end" style={{ marginTop: "-4px" }}>
                        <Link to="/forgot-password" className="auth-link small">
                          forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-100 btn-login mt-2"
                        disabled={loading || !email || !password || !!emailError || !!passError}
                      >
                        {loading ? <Spinner size="sm" animation="border" /> : "Sign In"}
                      </Button>
                    </Form>
                  )}

                  {/* Mobile OTP Form */}
                  {loginMethod === "mobile" && (
                    <Form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-2">
                      <Form.Group>
                        <Form.Label className="form-label-custom">mobile number</Form.Label>
                        <div className="d-flex gap-2">
                          <div className="flex-grow-1">
                            <Form.Control
                              type="text"
                              className={getMobileInputClass(mobile, mobileError)}
                              placeholder="Enter 10-digit mobile"
                              value={mobile}
                              onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                              disabled={false} // we change as per the security req this is for temp
                              required
                            />
                          </div>
                          <Button
                            type="button"
                            className="btn-outline-custom"
                            disabled={cooldown > 0 || !mobile || !!mobileError || sendingOtp}
                            onClick={handleSendOtp}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {cooldown > 0 ? `Resend (${cooldown}s)` : sendingOtp ? "Sending..." : "Send OTP"}
                          </Button>
                        </div>
                        {mobile && mobileError && (
                          <span className="validation-error-text">{mobileError}</span>
                        )}
                        {otpSent && (
                          <span className="text-success small mt-2 d-block" style={{ fontSize: "12px", fontWeight: 500 }}>
                            OTP sent. Valid for 5 minutes.
                          </span>
                        )}
                      </Form.Group>

                      {otpSent && (
                        <Form.Group>
                          <Form.Label className="form-label-custom">otp code</Form.Label>
                          <Form.Control
                            type="text"
                            className={getMobileInputClass(otpCode, otpError)}
                            placeholder="Enter 6-digit OTP"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            required
                          />
                          {otpCode && otpError && (
                            <span className="validation-error-text">{otpError}</span>
                          )}
                        </Form.Group>
                      )}

                      <Button
                        type="submit"
                        className="w-100 btn-login mt-2"
                        disabled={loading || !mobile || !otpCode || !!mobileError || !!otpError || !otpSent}
                      >
                        {loading ? <Spinner size="sm" animation="border" /> : "Sign In with OTP"}
                      </Button>
                    </Form>
                  )}
                </div>

                {/* Bottom Section: Links */}
                <div>
                  <hr className="my-3" style={{ borderColor: "#bcc9c6" }} />

                  <p className="text-center mb-0 small text-muted">
                    Don't have an account?{" "}
                    <Link to="/register" className="auth-link">
                      Register
                    </Link>
                  </p>
                  <div className="text-center mt-3">
                    <Link
                      to="/"
                      className="auth-link small d-inline-flex align-items-center gap-1"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="bi bi-arrow-left"></i> Back to Home
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Bottom Trust Indicators */}
            <div className="trust-indicators">
              <div className="trust-item">
                <i className="bi bi-shield-lock-fill"></i>
                <span>Secure Encryption</span>
              </div>
              <div className="trust-item">
                <i className="bi bi-shield-check"></i>
                <span>PCI-DSS Compliant</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
