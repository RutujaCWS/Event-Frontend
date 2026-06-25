import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import {
  sendMobileOtp,
  verifyMobileOtp,
  sendEmailOtp,
  verifyEmailOtp,
  registerUser,
} from "../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  
  // 👇 Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState({
    sendMobile: false,
    verifyMobile: false,
    sendEmail: false,
    verifyEmail: false,
    register: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const errors = {
    name: formData.name.trim() === "" ? "Full name is required" : "",
    mobile: formData.mobile && !/^\d{10}$/.test(formData.mobile) ? "Valid 10-digit mobile number required" : "",
    email: formData.email && !/\S+@\S+\.\S+/.test(formData.email) ? "Valid email required" : "",
    password: formData.password && formData.password.length < 6 ? "Password must be at least 6 characters" : "",
    confirmPassword: formData.confirmPassword && formData.confirmPassword !== formData.password ? "Passwords do not match" : "",
    mobileOtp: mobileOtp && !/^\d{6}$/.test(mobileOtp) ? "Enter 6-digit OTP" : "",
    emailOtp: emailOtp && !/^\d{6}$/.test(emailOtp) ? "Enter 6-digit OTP" : "",
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Full name is required";
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile))
      return "Valid 10-digit mobile number required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      return "Valid email required";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    if (!formData.termsAccepted)
      return "You must accept the Terms & Conditions";
    return null;
  };

  const handleSendMobileOtp = async () => {
    if (!formData.mobile || errors.mobile) {
      setError("Enter a valid mobile number first");
      return;
    }
    setLoading((prev) => ({ ...prev, sendMobile: true }));
    setError("");
    try {
      await sendMobileOtp(formData.mobile);
      setMobileOtpSent(true);
      alert(`OTP sent to ${formData.mobile}`);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send mobile OTP";
      setError(msg);
    } finally {
      setLoading((prev) => ({ ...prev, sendMobile: false }));
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (!mobileOtp || errors.mobileOtp) {
      setError("Enter 6-digit mobile OTP");
      return;
    }
    setLoading((prev) => ({ ...prev, verifyMobile: true }));
    setError("");
    try {
      await verifyMobileOtp(formData.mobile, mobileOtp);
      setMobileVerified(true);
      alert("Mobile verified successfully!");
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid or expired OTP";
      setError(msg);
    } finally {
      setLoading((prev) => ({ ...prev, verifyMobile: false }));
    }
  };

  const handleSendEmailOtp = async () => {
    if (!formData.email || errors.email) {
      setError("Enter a valid email address first");
      return;
    }
    setLoading((prev) => ({ ...prev, sendEmail: true }));
    setError("");
    try {
      await sendEmailOtp(formData.email);
      setEmailOtpSent(true);
      alert(`OTP sent to ${formData.email}`);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send email OTP";
      setError(msg);
    } finally {
      setLoading((prev) => ({ ...prev, sendEmail: false }));
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || errors.emailOtp) {
      setError("Enter 6-digit email OTP");
      return;
    }
    setLoading((prev) => ({ ...prev, verifyEmail: true }));
    setError("");
    try {
      await verifyEmailOtp(formData.email, emailOtp);
      setEmailVerified(true);
      alert("Email verified successfully!");
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid or expired OTP";
      setError(msg);
    } finally {
      setLoading((prev) => ({ ...prev, verifyEmail: false }));
    }
  };

  // 👇 MODIFIED: popup alerts instead of setting error for OTP verification
  const handleRegister = async () => {
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }
    if (!mobileVerified) {
      alert("Please verify your mobile number first.");
      return;
    }
    if (!emailVerified) {
      alert("Please verify your email address first.");
      return;
    }
    setLoading((prev) => ({ ...prev, register: true }));
    setError("");
    try {
      const { data } = await registerUser({
        fullName: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        termsAccepted: formData.termsAccepted,
      });
      alert(data.message || "Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading((prev) => ({ ...prev, register: false }));
    }
  };

  const getInputClass = (value, errorMsg) => {
    if (!value) return "form-control-custom";
    return errorMsg ? "form-control-custom is-invalid-custom" : "form-control-custom is-valid-custom";
  };

  const getMobileButtonText = () => {
    return mobileOtpSent ? "Resend" : "Send OTP";
  };

  const getEmailButtonText = () => {
    return emailOtpSent ? "Resend" : "Send OTP";
  };

  return (
    <div className="login-bg">
      <Container>
        <Row className="justify-content-center">
          <Col xs={11} sm={8} md={5} lg={4} className="login-card-container">
            <Card className="login-card-wrapper border-0">
              <div className="login-border-title">
                Create Account
              </div>

              <Card.Body className="p-3 pt-4">
                {error && (
                  <Alert variant="danger" className="py-2 px-3 small border-0 mb-2" style={{ borderRadius: "8px" }}>
                    {error}
                  </Alert>
                )}

                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label className="form-label-custom">Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className={getInputClass(formData.name, errors.name)}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                    {formData.name && errors.name && (
                      <span className="validation-error-text">{errors.name}</span>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="form-label-custom">Mobile Number *</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="tel"
                        name="mobile"
                        className={getInputClass(formData.mobile, errors.mobile)}
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile"
                        disabled={mobileVerified}
                      />
                      {!mobileVerified ? (
                        <Button
                          variant="outline-primary"
                          className="btn-outline-custom flex-shrink-0 d-inline-flex align-items-center justify-content-center"
                          onClick={handleSendMobileOtp}
                          disabled={loading.sendMobile || !formData.mobile || errors.mobile}
                          style={{ width: "100px", padding: "8px 0", fontSize: "0.85rem" }}
                        >
                          {loading.sendMobile ? <Spinner size="sm" animation="border" /> : getMobileButtonText()}
                        </Button>
                      ) : (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 small fw-semibold flex-shrink-0 d-inline-flex align-items-center justify-content-center" style={{ width: "100px", borderRadius: "10px", fontSize: "0.85rem" }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {mobileOtpSent && !mobileVerified && (
                      <div className="d-flex gap-2 mt-2 align-items-center animate__animated animate__fadeIn">
                        <Form.Control
                          type="text"
                          className={getInputClass(mobileOtp, errors.mobileOtp)}
                          placeholder="Enter OTP"
                          value={mobileOtp}
                          onChange={(e) => setMobileOtp(e.target.value)}
                        />
                        <Button
                          variant="success"
                          className="btn-success-custom flex-shrink-0 d-inline-flex align-items-center justify-content-center"
                          onClick={handleVerifyMobileOtp}
                          disabled={loading.verifyMobile || !mobileOtp || errors.mobileOtp}
                          style={{ width: "100px", padding: "8px 0", fontSize: "0.85rem" }}
                        >
                          {loading.verifyMobile ? <Spinner size="sm" animation="border" /> : "Verify"}
                        </Button>
                      </div>
                    )}
                    <div className="d-flex flex-column">
                      {formData.mobile && errors.mobile && (
                        <span className="validation-error-text">{errors.mobile}</span>
                      )}
                      {mobileOtp && errors.mobileOtp && (
                        <span className="validation-error-text">{errors.mobileOtp}</span>
                      )}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="form-label-custom">Email Address *</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="email"
                        name="email"
                        className={getInputClass(formData.email, errors.email)}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        disabled={emailVerified}
                      />
                      {!emailVerified ? (
                        <Button
                          variant="outline-primary"
                          className="btn-outline-custom flex-shrink-0 d-inline-flex align-items-center justify-content-center"
                          onClick={handleSendEmailOtp}
                          disabled={loading.sendEmail || !formData.email || errors.email}
                          style={{ width: "100px", padding: "8px 0", fontSize: "0.85rem" }}
                        >
                          {loading.sendEmail ? <Spinner size="sm" animation="border" /> : getEmailButtonText()}
                        </Button>
                      ) : (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 small fw-semibold flex-shrink-0 d-inline-flex align-items-center justify-content-center" style={{ width: "100px", borderRadius: "10px", fontSize: "0.85rem" }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {emailOtpSent && !emailVerified && (
                      <div className="d-flex gap-2 mt-2 align-items-center animate__animated animate__fadeIn">
                        <Form.Control
                          type="text"
                          className={getInputClass(emailOtp, errors.emailOtp)}
                          placeholder="Enter OTP"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                        />
                        <Button
                          variant="success"
                          className="btn-success-custom flex-shrink-0 d-inline-flex align-items-center justify-content-center"
                          onClick={handleVerifyEmailOtp}
                          disabled={loading.verifyEmail || !emailOtp || errors.emailOtp}
                          style={{ width: "100px", padding: "8px 0", fontSize: "0.85rem" }}
                        >
                          {loading.verifyEmail ? <Spinner size="sm" animation="border" /> : "Verify"}
                        </Button>
                      </div>
                    )}
                    <div className="d-flex flex-column">
                      {formData.email && errors.email && (
                        <span className="validation-error-text">{errors.email}</span>
                      )}
                      {emailOtp && errors.emailOtp && (
                        <span className="validation-error-text">{errors.emailOtp}</span>
                      )}
                    </div>
                  </Form.Group>

                  {/* 👇 Password field with eye toggle */}
                  <Form.Group className="mb-2">
                    <Form.Label className="form-label-custom">Password *</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={getInputClass(formData.password, errors.password)}
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
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
                      />
                    </div>
                    {formData.password && errors.password && (
                      <span className="validation-error-text">{errors.password}</span>
                    )}
                  </Form.Group>

                  {/* 👇 Confirm Password field with eye toggle */}
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Confirm Password *</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className={getInputClass(formData.confirmPassword, errors.confirmPassword)}
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <i
                        className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          fontSize: "18px",
                          color: "#6c757d",
                        }}
                      />
                    </div>
                    {formData.confirmPassword && errors.confirmPassword && (
                      <span className="validation-error-text">{errors.confirmPassword}</span>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="termsAccepted"
                      id="termsAccepted"
                      label={
                        <span className="small text-muted fw-medium">
                          I accept the{" "}
                          <Link to="/terms" className="auth-link">Terms</Link> &{" "}
                          <Link to="/privacy" className="auth-link">Privacy</Link>
                        </span>
                      }
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* 👇 MODIFIED: Button enabled even if OTP not verified (popup will appear) */}
                  <Button
                    onClick={handleRegister}
                    className="w-100 text-white btn-login"
                    style={{ padding: "10px !important" }}
                    disabled={
                      loading.register ||
                      !formData.name ||
                      !formData.termsAccepted ||
                      errors.name ||
                      errors.mobile ||
                      errors.email ||
                      errors.password ||
                      errors.confirmPassword
                    }
                  >
                    {loading.register ? <Spinner size="sm" animation="border" /> : "Register"}
                  </Button>
                </Form>

                <hr className="my-3" style={{ borderColor: "#cbd5e1" }} />
                <p className="text-center mb-0 small text-muted">
                  Already have an account?{" "}
                  <Link to="/login" className="auth-link">
                    Sign In
                  </Link>
                </p>


                <div className="text-center mt-4">
                                                  <Link
                                                    to="/"
                                                    style={{
                                                      color: "#7c3aed",
                                                      textDecoration: "none",
                                                      fontWeight: "600",
                                                    }}
                                                  >
                                                    ← Back to Home
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

export default RegisterPage;