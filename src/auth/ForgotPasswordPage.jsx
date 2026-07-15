import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { RiTimerLine, RiEyeLine, RiEyeOffLine, RiCheckboxCircleFill } from "react-icons/ri";
import { sendResetPasswordOtp, resetPasswordWithOtp } from "../services/authService";
import mailImg from "../assets/images/mail-forgot-pass.png";
import "./Login.css";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [otpArray, setOtpArray] = useState(Array(6).fill(""));
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(-1);
    const newOtpArray = [...otpArray];
    newOtpArray[index] = cleanValue;
    setOtpArray(newOtpArray);
    setOtp(newOtpArray.join(""));

    // Move to next box if digit entered
    if (cleanValue && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otpArray[index] && index > 0) {
        const newOtpArray = [...otpArray];
        newOtpArray[index - 1] = "";
        setOtpArray(newOtpArray);
        setOtp(newOtpArray.join(""));
        otpRefs[index - 1].current.focus();
      } else {
        const newOtpArray = [...otpArray];
        newOtpArray[index] = "";
        setOtpArray(newOtpArray);
        setOtp(newOtpArray.join(""));
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      const newOtpArray = pastedData.split("");
      setOtpArray(newOtpArray);
      setOtp(pastedData);
      otpRefs[5].current.focus();
    }
  };

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
    setOtp("");
    setOtpArray(Array(6).fill(""));
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
      setSuccess("");
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
            <h1 className="login-headline">
              {step === 3 ? (
                <>Secure Your Professional<br />Workspace</>
              ) : (
                <>Secure Access For<br />Event Management</>
              )}
            </h1>
            <p className="login-description">
              {step === 3 ? (
                "Vevora ensures your event data remains private and secure. Updating your password regularly is a best practice for corporate security standards."
              ) : (
                "Deliver flawless events with a platform built for precision and control"
              )}
            </p>
            <div className="login-stats-row" style={{ maxWidth: "340px" }}>
              <div className="login-stat-card">
                <div className="login-stat-value">12K+</div>
                <div className="login-stat-label">EVENTS HOSTED</div>
              </div>
              <div className="login-stat-card">
                <div className="login-stat-value">99.9%</div>
                <div className="login-stat-label">SECURITY</div>
              </div>
            </div>
          </div>
          <div className="login-footer-copyright">© 2026 Vevora Event Management.</div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right-panel d-flex flex-column align-items-center" style={{ padding: "40px" }}>
        {/* Top-aligned navigation link */}
        {step !== 3 && (
          <div className="d-flex justify-content-start w-100 mb-auto">
            <Link to="/login" className="login-create-link d-inline-flex align-items-center gap-1" style={{ textDecoration: "none", color: "#0D9488", fontWeight: "600", fontSize: "13px" }}>
              <i className="bi bi-arrow-left"></i> Back to Login
            </Link>
          </div>
        )}

        <div className="login-form-wrapper my-auto">
          {step !== 2 && (
            <div className="login-step-indicator">
              <span className="step-bar"></span>
              <span className="step-dot"></span>
              <span className="step-dot"></span>
            </div>
          )}

          <h2 className="login-form-title" style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h2>
          <p className="login-form-subtitle" style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
            {step === 1 && "Enter your registered mobile number to receive a reset OTP."}
            {step === 2 && (
              <>
                We sent a 6-digit code to <strong>+91 {mobile}</strong>
              </>
            )}
            {step === 3 && "Create a new, strong password for your account"}
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
              <div className="otp-container">
                {otpArray.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    className="otp-box"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="otp-timer-row">
                <span className="d-flex align-items-center" style={{ color: "#6b7280", fontSize: "12.5px" }}>
                  <RiTimerLine className="me-1" style={{ fontSize: "14px" }} />
                  {cooldown > 0 ? `Resend code in ${formatTime(cooldown)}` : "Code expired"}
                </span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={cooldown > 0 || loading}
                  style={{
                    background: "none",
                    border: "none",
                    color: cooldown > 0 ? "#9ca3af" : "#0D9488",
                    fontWeight: "700",
                    fontSize: "12.5px",
                    cursor: cooldown > 0 ? "not-allowed" : "pointer",
                    padding: 0,
                    textDecoration: "none"
                  }}
                >
                  Resend Code
                </button>
              </div>

              <Button
                variant="primary"
                className="login-submit-btn d-flex align-items-center justify-content-center gap-1"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    Verify & Continue <i className="bi bi-chevron-right ms-1" style={{ fontSize: "11px", fontWeight: "bold" }}></i>
                  </>
                )}
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label className="login-field-label">New Password</Form.Label>
                <div className="password-toggle-wrapper">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    className="password-input-field"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="password-visibility-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="login-field-label">Confirm Password</Form.Label>
                <div className="password-toggle-wrapper">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    className="password-input-field"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="password-visibility-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </Form.Group>

              <div className="security-requirements-card">
                <div className="security-req-title">SECURITY REQUIREMENTS</div>
                <div className="security-req-item">
                  <RiCheckboxCircleFill className={`security-req-icon ${newPassword.length >= 8 ? "valid" : "invalid"}`} />
                  At least 8 characters
                </div>
                <div className="security-req-item">
                  <RiCheckboxCircleFill className={`security-req-icon ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? "valid" : "invalid"}`} />
                  Uppercase & lowercase letters
                </div>
                <div className="security-req-item">
                  <RiCheckboxCircleFill className={`security-req-icon ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "valid" : "invalid"}`} />
                  At least one special character
                </div>
              </div>

              <Button
                variant="success"
                className="login-submit-btn d-flex align-items-center justify-content-center gap-1"
                onClick={handleResetPassword}
                disabled={loading || newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) || newPassword !== confirmPassword}
              >
                {loading ? <Spinner size="sm" animation="border" /> : (
                  <>
                    Update Password <i className="bi bi-arrow-right ms-1"></i>
                  </>
                )}
              </Button>
            </>
          )}

          <div className="text-center mt-4 small">
            {step === 2 ? (
              <>
                <span className="text-muted">Having trouble? </span>
                <Link to="#" className="login-create-link" style={{ fontWeight: "600", textDecoration: "none" }}>Contact Support</Link>
              </>
            ) : step === 3 ? (
              <Link to="/login" className="login-create-link" style={{ fontWeight: "600", textDecoration: "none", color: "#0D9488" }}>
                Back to Login
              </Link>
            ) : (
              <>
                <span className="text-muted">Remembered it? </span>
                <Link to="/login" className="login-create-link" style={{ fontWeight: "600", textDecoration: "none" }}>Sign In</Link>
              </>
            )}
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