import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { sendResetPasswordOtp, resetPasswordWithOtp } from "../services/authService";
import mailImg from "../assets/images/mail-forgot-pass.png";
import "./Login.css";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP, 3: New Password
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // ---------- Step 1: Send OTP ----------
 const handleSendOtp = async () => {
  if (!mobile || mobile.length !== 10) {
    setError("Please enter a valid 10-digit mobile number.");
    return;
  }
  setLoading(true);
  setError("");
  try {
    await sendResetPasswordOtp(mobile);
    setStep(2);
    setSuccess("OTP sent to your mobile number.");
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
  } catch (err) {
    const errorMsg = err.response?.data?.error || "Failed to send OTP";
    setError(errorMsg);

    // Extract remaining seconds from the error message (e.g., "Please wait 45 seconds")
    const match = errorMsg.match(/(\d+)\s*seconds?/);
    if (match) {
      const remaining = parseInt(match[1], 10);
      if (remaining > 0) {
        setCooldown(remaining);
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) clearInterval(timer);
            return prev - 1;
          });
        }, 1000);
      }
    }
  } finally {
    setLoading(false);
  }
};

  // ---------- Step 2: Verify OTP ----------
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Move to password reset step (actual verification in reset)
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Step 3: Reset Password ----------
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPasswordWithOtp(mobile, otp, newPassword);
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => window.location.href = "/login", 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Left Panel */}
      <div className="login-left-panel" style={{ backgroundImage: `url(${mailImg})` }}>
        <div className="login-left-content">
          <div className="login-logo-section">
            <div className="login-logo-brand">Vevora</div>
            <div className="login-logo-sub">EVENT MANAGEMENT</div>
          </div>
          <div className="login-middle-section">
            <h1 className="login-headline">Secure Event Logistics,<br />Simplified.</h1>
            <p className="login-description">
              Everything you need to run seamless events bookings, payments, tax compliance, and real-time insights.
            </p>
            <div className="login-stats-row" style={{ maxWidth: "340px" }}>
              <div className="login-stat-card">
                <div className="login-stat-value">12K+</div>
                <div className="login-stat-label">Events Hosted</div>
              </div>
              <div className="login-stat-card">
                <div className="login-stat-value">99.9%</div>
                <div className="login-stat-label">Security</div>
              </div>
            </div>
          </div>
          <div className="login-footer-copyright">© 2026 Vevora Event Management.</div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right-panel d-flex flex-column align-items-center" style={{ padding: "40px" }}>
        <div className="login-form-wrapper my-auto">
          <div className="login-step-indicator">
            <span className="step-bar"></span>
            <span className="step-dot"></span>
            <span className="step-dot"></span>
          </div>
          <div className="mb-2">
            <Link to="/login" className="login-create-link d-inline-flex align-items-center gap-1" style={{ textDecoration: "none" }}>
              <i className="bi bi-arrow-left"></i> Back to login
            </Link>
          </div>

          <h2 className="login-form-title">Forgot Password?</h2>
          <p className="login-form-subtitle">
            {step === 1 && "Enter your registered mobile number to receive a reset OTP."}
            {step === 2 && `Enter the OTP sent to ${mobile}.`}
            {step === 3 && "Set your new password."}
          </p>

          {error && <Alert variant="danger" className="py-2 px-3 small border-0 mb-3" style={{ borderRadius: "8px", backgroundColor: "#ffdad6", color: "#93000a" }}>{error}</Alert>}
          {success && <Alert variant="success" className="py-2 px-3 small border-0 mb-3" style={{ borderRadius: "8px", backgroundColor: "#ecfdf5", color: "#065f46" }}>{success}</Alert>}

          {step === 1 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label className="login-field-label">Registered Mobile Number</Form.Label>
                <div className="login-input-wrapper">
                  <i className="bi bi-phone login-input-icon"></i>
                  <Form.Control
                    type="tel"
                    className="login-input-field"
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength="10"
                  />
                </div>
                <Form.Text className="text-muted">A 6-digit OTP will be sent via SMS.</Form.Text>
              </Form.Group>
              <Button
                variant="primary"
                className="login-submit-btn"
                onClick={handleSendOtp}
                disabled={loading || mobile.length !== 10 || cooldown > 0}
              >
                {loading ? <Spinner size="sm" animation="border" /> : cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label className="login-field-label">Enter OTP</Form.Label>
                <div className="login-input-wrapper">
                  <i className="bi bi-shield-lock login-input-icon"></i>
                  <Form.Control
                    type="text"
                    className="login-input-field"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength="6"
                  />
                </div>
                <Form.Text className="text-muted">OTP sent to {mobile}. Valid for 5 minutes.</Form.Text>
              </Form.Group>
              <Button
                variant="primary"
                className="login-submit-btn"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Verify OTP"}
              </Button>
              <Button variant="link" className="mt-2" onClick={handleSendOtp} disabled={loading}>
                Resend OTP
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label className="login-field-label">New Password</Form.Label>
                <div className="login-input-wrapper">
                  <i className="bi bi-lock login-input-icon"></i>
                  <Form.Control
                    type="password"
                    className="login-input-field"
                    placeholder="Enter new password (min 8 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Form.Text className="text-muted">Use at least 8 characters with uppercase, lowercase, number & special character.</Form.Text>
              </Form.Group>
              <Button
                variant="success"
                className="login-submit-btn"
                onClick={handleResetPassword}
                disabled={loading || newPassword.length < 8}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Reset Password"}
              </Button>
            </>
          )}

          <div className="text-center mt-3 small">
            <span className="text-muted">Remembered it? </span>
            <Link to="/login" className="login-create-link">Sign In</Link>
          </div>
        </div>

        <div className="login-right-footer text-start mt-auto" style={{ maxWidth: "380px", width: "100%" }}>
          <div className="text-muted small mb-1">© 2026 Vevora Event Management</div>
          <div className="d-flex gap-3">
            <Link to="#" className="login-footer-link">Privacy Policy</Link>
            <Link to="#" className="login-footer-link">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;