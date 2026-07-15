import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/Auth/AuthContext";   // ✅ correct import
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { loginUser, sendLoginOtp, mobileLogin } from "../services/authService";
import mailImg from "../assets/images/mail-forgot-pass.png";
import mobileImg from "../assets/images/mobile.png";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();   // ✅ now works

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
    if (val.length < 8) return "Minimum 8 characters.";
    if (val.length > 20) return "Maximum 20 characters.";
    if (/\s/.test(val)) return "Spaces are not allowed.";
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);
    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial)
      return "Must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
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
      setCooldown(30);
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

      // ✅ Use context login instead of manual localStorage
      login(user, token);

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

  return (
    <div className="login-split-container">
      {/* Left Panel */}
      <div
        className="login-left-panel"
        style={{ backgroundImage: `url(${loginMethod === "email" ? mailImg : mobileImg})` }}
      >
        <div className="login-left-content">
          <div className="login-logo-section">
            <div className="login-logo-brand">Vevora</div>
            <div className="login-logo-sub">EVENT MANAGEMENT</div>
          </div>

          <div className="login-middle-section">
            <h1 className="login-headline">
              {loginMethod === "email" ? (
                <>
                  Manage events<br />
                  Track payments<br />
                  Grow faster
                </>
              ) : (
                <>
                  One tap. Instant<br />
                  access. Zero hassle
                </>
              )}
            </h1>
            <p className="login-description">
              {loginMethod === "email"
                ? "Everything you need to run seamless events bookings, payments, tax compliance, and real-time insights, all in one professional workspace."
                : "Login securely with a one-time password sent to your registered mobile number. No password needed."}
            </p>

            <div className="login-stats-row">
              {loginMethod === "email" ? (
                <>
                  <div className="login-stat-card">
                    <div className="login-stat-value">12K+</div>
                    <div className="login-stat-label">Events Hosted</div>
                  </div>
                  <div className="login-stat-card">
                    <div className="login-stat-value">98%</div>
                    <div className="login-stat-label">Uptime SLA</div>
                  </div>
                  <div className="login-stat-card">
                    <div className="login-stat-value">4.9★</div>
                    <div className="login-stat-label">Partner Rating</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="login-stat-card">
                    <div className="login-stat-value text-uppercase">OTP</div>
                    <div className="login-stat-label text-uppercase">6-Digit Code</div>
                  </div>
                  <div className="login-stat-card">
                    <div className="login-stat-value text-uppercase">30s</div>
                    <div className="login-stat-label text-uppercase">Delivery Time</div>
                  </div>
                  <div className="login-stat-card">
                    <div className="login-stat-value text-uppercase">2FA</div>
                    <div className="login-stat-label text-uppercase">Secured Login</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="login-footer-copyright">
            © 2026 Vevora Event Management. • All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right-panel">
        <div className="login-form-wrapper">
          <h2 className="login-form-title">
            {loginMethod === "email" ? "Welcome back" : "Mobile OTP Login"}
          </h2>
          <p className="login-form-subtitle">
            {loginMethod === "email"
              ? "Sign in to your Vevora professional account"
              : "Enter your registered mobile number to receive a verification code."}
          </p>

          <div className="login-toggle-tab">
            <button
              type="button"
              className={`login-toggle-btn ${loginMethod === "email" ? "active" : ""}`}
              onClick={() => {
                setLoginMethod("email");
                setError("");
              }}
            >
              Email & Password
            </button>
            <button
              type="button"
              className={`login-toggle-btn ${loginMethod === "mobile" ? "active" : ""}`}
              onClick={() => {
                setLoginMethod("mobile");
                setError("");
              }}
            >
              Mobile OTP
            </button>
          </div>

          {error && (
            <Alert variant="danger" className="py-2 px-3 small border-0 animate__animated animate__fadeIn mb-3" style={{ borderRadius: "8px", backgroundColor: "#ffdad6", color: "#93000a" }}>
              {error}
            </Alert>
          )}

          {/* Email Form */}
          {loginMethod === "email" ? (
            <Form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="login-field-label">Email Address</Form.Label>
                <div className="login-input-wrapper">
                  <i className="bi bi-envelope login-input-icon"></i>
                  <Form.Control
                    type="email"
                    className="login-input-field"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {email && emailError && (
                  <span className="validation-error-text">{emailError}</span>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label className="login-field-label">Password</Form.Label>
                <div className="login-input-wrapper">
                  <i className="bi bi-lock login-input-icon"></i>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    className="login-input-field"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} login-password-toggle`}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <div className="d-flex justify-content-end mt-1">
                  <Link to="/forgot-password" className="login-forgot-link">
                    Forgot password?
                  </Link>
                </div>
                {password && passError && (
                  <span className="validation-error-text">{passError}</span>
                )}
              </Form.Group>

              <Form.Group className="login-checkbox-group">
                <Form.Check
                  type="checkbox"
                  id="remember-me"
                  label="Remember me on this device"
                  className="login-checkbox"
                />
              </Form.Group>

              <Button
                type="submit"
                className="login-submit-btn"
                disabled={loading || !email || !password || !!emailError || !!passError}
              >
                {loading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i> Sign In
                  </>
                )}
              </Button>
              <div className="text-center mt-3">
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
            </Form>
          ) : (
            /* Mobile OTP Form */
            <Form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="login-field-label">Mobile Number</Form.Label>
                <div className="login-mobile-input-container">
                  <Form.Select className="login-country-select">
                    <option value="+91">+91</option>
                  </Form.Select>
                  <div className="login-input-wrapper flex-grow-1">
                    <i className="bi bi-phone login-input-icon"></i>
                    <Form.Control
                      type="text"
                      className="login-input-field"
                      placeholder="9876543210"
                      value={mobile}
                      maxLength={10}
                      onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                    />
                  </div>
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
                  <Form.Label className="login-field-label">OTP Code</Form.Label>
                  <div className="login-input-wrapper">
                    <i className="bi bi-shield-lock login-input-icon"></i>
                    <Form.Control
                      type="text"
                      className="login-input-field"
                      placeholder="Enter 6-digit OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                    />
                  </div>
                  {otpCode && otpError && (
                    <span className="validation-error-text">{otpError}</span>
                  )}
                </Form.Group>
              )}

              {!otpSent && (
                <div className="login-info-box">
                  <i className="bi bi-check-circle-fill login-info-icon"></i>
                  <span className="login-info-text">
                    A 6-digit OTP will be sent to your number. Standard SMS charges may apply.
                  </span>
                </div>
              )}

              <div className="d-flex flex-column gap-2 mt-2">
                {otpSent ? (
                  <Button
                    type="submit"
                    className="login-submit-btn"
                    disabled={loading || !mobile || !otpCode || !!mobileError || !!otpError}
                  >
                    {loading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i> Sign In with OTP
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="login-submit-btn"
                    disabled={cooldown > 0 || !mobile || !!mobileError || sendingOtp}
                    onClick={handleSendOtp}
                  >
                    {sendingOtp ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i> {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Send OTP"}
                      </>
                    )}
                  </Button>
                )}

                <div className="login-separator">
                  <span className="login-separator-text">OR</span>
                </div>

                <Button
                  type="button"
                  className="login-secondary-btn"
                  onClick={() => {
                    setLoginMethod("email");
                    setError("");
                  }}
                >
                  <i className="bi bi-envelope me-2"></i> Login with Email instead
                </Button>
                <div className="text-center mt-3">
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
            </Form>
          )}

          {/* Footer */}
          {loginMethod === "email" ? (
            <div className="login-right-footer mt-5">
              <div className="d-flex justify-content-center gap-3">
                <Link to="#" className="login-footer-link">Privacy Policy</Link>
                <Link to="#" className="login-footer-link">Terms of Service</Link>
                <Link to="#" className="login-footer-link">Help Center</Link>
              </div>
              <div className="text-center mt-3">
                <span className="text-muted small">Don't have an account? </span>
                <Link to="/register" className="login-create-link">
                  Create one
                </Link>
              </div>
            </div>
          ) : (
            <div className="login-right-footer mt-4 text-center">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="login-create-link">
                Create one
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;