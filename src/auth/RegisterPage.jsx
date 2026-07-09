import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import {
  sendMobileOtp,
  verifyMobileOtp,
  sendEmailOtp,
  verifyEmailOtp,
  registerUser,
} from "../services/authService";
import registrationImg from "../assets/images/registration.png";
import "./Login.css";

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
  
  // Cooldown timer states
  const [mobileCooldown, setMobileCooldown] = useState(0);
  const [emailCooldown, setEmailCooldown] = useState(0);

  // Timer effect for Mobile OTP
  useEffect(() => {
    let timer;
    if (mobileCooldown > 0) {
      timer = setTimeout(() => setMobileCooldown(mobileCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [mobileCooldown]);

  // Timer effect for Email OTP
  useEffect(() => {
    let timer;
    if (emailCooldown > 0) {
      timer = setTimeout(() => setEmailCooldown(emailCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [emailCooldown]);

  // Password visibility states
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
      setMobileCooldown(30);
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
      setEmailCooldown(30);
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

  const getMobileButtonText = () => {
    return mobileOtpSent ? "Resend" : "Send OTP";
  };

  const getEmailButtonText = () => {
    return emailOtpSent ? "Resend" : "Send OTP";
  };

  return (
    <div className="login-split-container">
      {/* Left Panel: registration.png background and branding */}
      <div 
        className="login-left-panel"
        style={{ backgroundImage: `url(${registrationImg})` }}
      >
        <div className="login-left-content">
          {/* Logo & Brand */}
          <div className="login-logo-section">
            <div className="login-logo-brand">Vevora</div>
            <div className="login-logo-sub">EVENT MANAGEMENT</div>
          </div>

          {/* Headline, Subtitle, and Stats */}
          <div className="login-middle-section">
            <h1 className="login-headline">
              Precision Planning for<br />
              Perfect Events.
            </h1>
            <p className="login-description">
              Empowering professionals with precision logistics and seamless coordination tools.
            </p>

            <div className="login-stats-row" style={{ maxWidth: "340px" }}>
              <div className="login-stat-card">
                <div className="login-stat-value text-uppercase">12K+</div>
                <div className="login-stat-label text-uppercase">Events Hosted</div>
              </div>
              <div className="login-stat-card">
                <div className="login-stat-value text-uppercase">99.9%</div>
                <div className="login-stat-label text-uppercase">Security</div>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="login-footer-copyright">
            © 2026 Vevora Event Management. • All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel: Registration Form */}
      <div className="login-right-panel" style={{ padding: "40px 60px" }}>
        <div className="login-form-wrapper">
          <h2 className="login-form-title">Create your account</h2>
          <p className="login-form-subtitle">
            Empowering global event professionals to orchestrate high-stakes experiences with absolute precision and flawless execution.
          </p>

          {error && (
            <Alert variant="danger" className="py-2 px-3 small border-0 mb-3" style={{ borderRadius: "8px", backgroundColor: "#ffdad6", color: "#93000a" }}>
              {error}
            </Alert>
          )}

          <Form className="d-flex flex-column gap-3">
            {/* Full Name */}
            <Form.Group>
              <Form.Label className="login-field-label">Full Name</Form.Label>
              <div className="login-input-wrapper">
                <i className="bi bi-person login-input-icon"></i>
                <Form.Control
                  type="text"
                  name="name"
                  className="login-input-field"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              {formData.name && errors.name && (
                <span className="validation-error-text">{errors.name}</span>
              )}
            </Form.Group>

            {/* Email Address with Inline Verification */}
            <Form.Group>
              <Form.Label className="login-field-label">Email Address</Form.Label>
              <div className="login-mobile-input-container">
                <div className="login-input-wrapper flex-grow-1">
                  <i className="bi bi-envelope login-input-icon"></i>
                  <Form.Control
                    type="email"
                    name="email"
                    className="login-input-field"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    disabled={emailVerified}
                    required
                  />
                </div>
                {!emailVerified ? (
                  <Button
                    type="button"
                    className="login-verify-inline-btn"
                    onClick={handleSendEmailOtp}
                    disabled={loading.sendEmail || !formData.email || errors.email || emailCooldown > 0}
                  >
                    {emailCooldown > 0 
                      ? `Resend (${emailCooldown}s)` 
                      : loading.sendEmail 
                        ? <Spinner size="sm" animation="border" /> 
                        : getEmailButtonText()}
                  </Button>
                ) : (
                  <span className="login-verified-badge">
                    ✓ Verified
                  </span>
                )}
              </div>

              {/* Email OTP Field */}
              {emailOtpSent && !emailVerified && (
                <div className="d-flex gap-2 mt-2 align-items-center animate__animated animate__fadeIn">
                  <div className="login-input-wrapper flex-grow-1">
                    <i className="bi bi-shield-lock login-input-icon"></i>
                    <Form.Control
                      type="text"
                      className="login-input-field"
                      placeholder="Enter Email OTP"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    className="login-verify-inline-btn success-btn"
                    onClick={handleVerifyEmailOtp}
                    disabled={loading.verifyEmail || !emailOtp || errors.emailOtp}
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

            {/* Password */}
            <Form.Group>
              <Form.Label className="login-field-label">Password</Form.Label>
              <div className="login-input-wrapper">
                <i className="bi bi-lock login-input-icon"></i>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="login-input-field"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} login-password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              {formData.password && errors.password && (
                <span className="validation-error-text">{errors.password}</span>
              )}
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group>
              <Form.Label className="login-field-label">Confirm Password</Form.Label>
              <div className="login-input-wrapper">
                <i className="bi bi-lock login-input-icon"></i>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="login-input-field"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <i
                  className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} login-password-toggle`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
              {formData.confirmPassword && errors.confirmPassword && (
                <span className="validation-error-text">{errors.confirmPassword}</span>
              )}
            </Form.Group>

            {/* Mobile Number with Inline Verification */}
            <Form.Group>
              <Form.Label className="login-field-label">Mobile Number</Form.Label>
              <div className="login-mobile-input-container">
                <Form.Select className="login-country-select">
                  <option value="+91">+91</option>
                </Form.Select>
                <div className="login-input-wrapper flex-grow-1">
                  <i className="bi bi-phone login-input-icon"></i>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    className="login-input-field"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="9876543210"
                    disabled={mobileVerified}
                    required
                  />
                </div>
                {!mobileVerified ? (
                  <Button
                    type="button"
                    className="login-verify-inline-btn"
                    onClick={handleSendMobileOtp}
                    disabled={loading.sendMobile || !formData.mobile || errors.mobile || mobileCooldown > 0}
                  >
                    {mobileCooldown > 0 
                      ? `Resend (${mobileCooldown}s)` 
                      : loading.sendMobile 
                        ? <Spinner size="sm" animation="border" /> 
                        : getMobileButtonText()}
                  </Button>
                ) : (
                  <span className="login-verified-badge">
                    ✓ Verified
                  </span>
                )}
              </div>

              {/* Mobile OTP Field */}
              {mobileOtpSent && !mobileVerified && (
                <div className="d-flex gap-2 mt-2 align-items-center animate__animated animate__fadeIn">
                  <div className="login-input-wrapper flex-grow-1">
                    <i className="bi bi-shield-lock login-input-icon"></i>
                    <Form.Control
                      type="text"
                      className="login-input-field"
                      placeholder="Enter Mobile OTP"
                      value={mobileOtp}
                      onChange={(e) => setMobileOtp(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    className="login-verify-inline-btn success-btn"
                    onClick={handleVerifyMobileOtp}
                    disabled={loading.verifyMobile || !mobileOtp || errors.mobileOtp}
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

            {/* Info notice box */}
            <div className="login-info-box">
              <i className="bi bi-info-circle-fill login-info-icon"></i>
              <span className="login-info-text">
                A 6-digit OTP will be sent to the mobile number for verification. Carrier rates may apply.
              </span>
            </div>

            {/* Terms Checkbox */}
            <Form.Group className="login-checkbox-group">
              <Form.Check
                type="checkbox"
                name="termsAccepted"
                id="termsAccepted"
                label={
                  <span className="small text-muted fw-semibold">
                    I accept the <Link to="/terms" className="login-create-link">Terms</Link> & <Link to="/privacy" className="login-create-link">Privacy</Link>
                  </span>
                }
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="login-checkbox"
              />
            </Form.Group>

            {/* Submit Button */}
            <Button
              onClick={handleRegister}
              className="login-submit-btn mt-2"
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
              {loading.register ? <Spinner size="sm" animation="border" /> : "Create Account"}
            </Button>
          </Form>

          {/* Bottom Footer Section */}
          <div className="login-right-footer mt-4 text-center">
            <span className="text-muted small">Already have an account? </span>
            <Link to="/login" className="login-create-link">
              Sign In
            </Link>
            <div className="mt-3">
              <Link
                to="/"
                className="d-inline-flex align-items-center gap-1"
                style={{ 
                  textDecoration: "none", 
                  color: "#00685f", 
                  fontSize: "14px", 
                  fontWeight: "500" 
                }}
              >
                <i className="bi bi-arrow-left"></i> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
