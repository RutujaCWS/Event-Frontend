// OtpDemo.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import mailImg from "../assets/images/mail-forgot-pass.png";
import mobileImg from "../assets/images/mobile.png";
import registrationImg from "../assets/images/registration.png";
import "./OtpDemo.css";

const OtpDemo = () => {
  // 6-digit OTP code cells
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Common UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cooldown timer state (Mockup shows "00:54" initially)
  const [timerSeconds, setTimerSeconds] = useState(54);

  // Design Guideline Overlay Tool States
  const [panelOpen, setPanelOpen] = useState(false);
  const [overlayEnabled, setOverlayEnabled] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.4);
  const [selectedImgName, setSelectedImgName] = useState("mail-forgot-pass.png");
  const [blendMode, setBlendMode] = useState("normal");
  const [scale, setScale] = useState(1.0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const imgMap = {
    "mail-forgot-pass.png": mailImg,
    "mobile.png": mobileImg,
    "registration.png": registrationImg,
  };

  // Cooldown countdown
  useEffect(() => {
    let timer;
    if (timerSeconds > 0) {
      timer = setTimeout(() => setTimerSeconds(timerSeconds - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timerSeconds]);

  // Format seconds to MM:SS
  const formatTimer = (sec) => {
    const min = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${min < 10 ? "0" + min : min}:${remaining < 10 ? "0" + remaining : remaining}`;
  };

  // OTP Input event handlers
  const handleInputChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (!numericValue) {
      // Clear value
      const newOtp = [...otpValues];
      newOtp[index] = "";
      setOtpValues(newOtp);
      return;
    }

    // Capture only the last character entered
    const char = numericValue[numericValue.length - 1];
    const newOtp = [...otpValues];
    newOtp[index] = char;
    setOtpValues(newOtp);

    // Auto-focus next input if filled and not the last one
    if (index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleInputKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      // If cell is empty, clear previous cell and focus it
      if (!otpValues[index] && index > 0) {
        const newOtp = [...otpValues];
        newOtp[index - 1] = "";
        setOtpValues(newOtp);
        inputRefs[index - 1].current.focus();
      } else if (otpValues[index]) {
        // Clear current cell
        const newOtp = [...otpValues];
        newOtp[index] = "";
        setOtpValues(newOtp);
      }
    }
  };

  const handleInputPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim();
    const digitsOnly = pasteData.replace(/[^0-9]/g, "").substring(0, 6);

    if (digitsOnly.length > 0) {
      const newOtp = [...otpValues];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digitsOnly[i] || "";
      }
      setOtpValues(newOtp);

      // Focus the last filled box or box index 5
      const focusIndex = Math.min(digitsOnly.length, 5);
      inputRefs[focusIndex].current.focus();
    }
  };

  // Verify action
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const fullOtp = otpValues.join("");
    if (fullOtp.length !== 6) {
      setError("Please fill out all 6 digits of the OTP code.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      setSuccess("OTP Verified Successfully! Loading event management portal...");
    }, 1200);
  };

  // Resend OTP action
  const handleResendCode = () => {
    setTimerSeconds(54);
    setSuccess("A new 6-digit OTP code has been sent to +91 980123456.");
    setError("");
    // Clear inputs
    setOtpValues(["", "", "", "", "", ""]);
    inputRefs[0].current.focus();
  };

  return (
    <div className="otp-demo-container">
      {/* LEFT PANEL: Branding & Visuals */}
      <div
        className="otp-demo-left-panel"
        style={{ backgroundImage: `url(${mailImg})` }}
      >
        <div className="otp-demo-left-content">
          <div className="otp-demo-logo-section">
            <span className="otp-demo-logo-brand">Vevora</span>
            <span className="otp-demo-logo-sub">Event Management</span>
          </div>

          <div className="otp-demo-middle">
            <h1 className="otp-demo-headline">
              Secure Access For<br />
              Event Management
            </h1>
            <p className="otp-demo-description">
              Deliver flawless events with a platform built for precision and control
            </p>

            <div className="otp-demo-stats-row">
              <div className="otp-demo-stat-card">
                <div className="otp-demo-stat-value">12K+</div>
                <div className="otp-demo-stat-label">Events Hosted</div>
              </div>
              <div className="otp-demo-stat-card">
                <div className="otp-demo-stat-value">99.9%</div>
                <div className="otp-demo-stat-label">Security</div>
              </div>
            </div>
          </div>

          <div className="otp-demo-footer">
            © 2026 Vevora Event Management. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Form Inputs */}
      <div className="otp-demo-right-panel">
        <div className="otp-demo-back-nav">
          <Link to="/login" className="otp-demo-back-link">
            <i className="bi bi-arrow-left"></i> Back to Login
          </Link>
        </div>

        <div className="otp-demo-form-wrapper">
          <h2 className="otp-demo-title">Verify OTP</h2>
          <p className="otp-demo-subtitle">
            We sent a 6-digit code to <span className="otp-demo-phone">+91 980123456</span>
          </p>

          {error && (
            <div className="alert alert-danger py-2 px-3 small border mb-3" style={{ borderRadius: "4px", backgroundColor: "#fef2f2", color: "#EF4444", borderColor: "#fee2e2" }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success py-2 px-3 small border mb-3" style={{ borderRadius: "4px", backgroundColor: "#ecfdf5", color: "#10B981", borderColor: "#d1fae5" }}>
              <i className="bi bi-check-circle-fill me-2"></i> {success}
            </div>
          )}

          <form onSubmit={handleVerifyOtp}>
            {/* 6 Square Inputs */}
            <div className="otp-demo-inputs-row">
              {otpValues.map((val, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  className="otp-demo-input-box"
                  maxLength="1"
                  value={val}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  onKeyDown={(e) => handleInputKeyDown(idx, e)}
                  onPaste={handleInputPaste}
                  disabled={loading}
                  autoFocus={idx === 0}
                  required
                />
              ))}
            </div>

            {/* Action Row: Timer & Resend Link */}
            <div className="otp-demo-action-row">
              <div className="otp-demo-timer-wrap">
                <i className="bi bi-clock otp-demo-timer-icon"></i>
                <span>
                  {timerSeconds > 0 ? `Resend code in ${formatTimer(timerSeconds)}` : "Code expired"}
                </span>
              </div>
              <button
                type="button"
                className="otp-demo-resend-link"
                disabled={timerSeconds > 0 || loading}
                onClick={handleResendCode}
                style={{ opacity: timerSeconds > 0 ? 0.6 : 1 }}
              >
                Resend Code
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="otp-demo-btn"
              disabled={loading || otpValues.some((v) => v === "")}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>
                  Verify & Continue <i className="bi bi-chevron-right" style={{ fontSize: "12px", strokeWidth: "3px" }}></i>
                </>
              )}
            </button>

            {/* Bottom Support Callout */}
            <div className="otp-demo-help-footer">
              Having trouble?{" "}
              <a href="#" className="otp-demo-support-link">
                Contact Support
              </a>
            </div>
          </form>
        </div>

        {/* Footer copyright section */}
        <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "auto" }}>
          © 2026 Vevora Event Management. All rights reserved.
        </div>
      </div>

      {/* ======================================================== */}
      {/* TEMPORARY DESIGN COMPARISON OVERLAY LAYER               */}
      {/* ======================================================== */}
      {overlayEnabled && (
        <div className="guideline-overlay-wrapper">
          <img
            src={imgMap[selectedImgName]}
            alt="Design Guideline Overlay"
            className="guideline-overlay-image"
            style={{
              opacity: overlayOpacity,
              mixBlendMode: blendMode,
              transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
            }}
          />
        </div>
      )}

      {/* OVERLAY FLOATING CONTROL PANEL BUTTON */}
      <div
        className="guideline-control-btn"
        title="Toggle Design Guideline Panel"
        onClick={() => setPanelOpen(!panelOpen)}
        style={{ backgroundColor: panelOpen ? "#0d9488" : "#0f172a" }}
      >
        <i className={panelOpen ? "bi bi-x-lg" : "bi bi-aspect-ratio"}></i>
      </div>

      {/* OVERLAY CONTROL PANEL CONTROL BOX */}
      {panelOpen && (
        <div className="guideline-control-panel">
          <div className="guideline-panel-title">
            <i className="bi bi-sliders"></i> Design Alignment Inspector
            <span className="ms-auto guideline-badge-indicator">TEMP UTILITY</span>
          </div>

          {/* Toggle overlay enable */}
          <div className="guideline-control-group">
            <label className="guideline-control-checkbox">
              <input
                type="checkbox"
                checked={overlayEnabled}
                onChange={(e) => setOverlayEnabled(e.target.checked)}
                style={{ accentColor: "#0d9488", cursor: "pointer" }}
              />
              Show Design Overlay
            </label>
          </div>

          {/* Choose image to overlay */}
          <div className="guideline-control-group">
            <div className="guideline-control-label">
              <span>Select Mockup Image</span>
            </div>
            <select
              className="guideline-control-input"
              value={selectedImgName}
              onChange={(e) => setSelectedImgName(e.target.value)}
            >
              <option value="mail-forgot-pass.png">mail-forgot-pass.png</option>
              <option value="mobile.png">mobile.png</option>
              <option value="registration.png">registration.png</option>
            </select>
          </div>

          {/* Opacity control */}
          <div className="guideline-control-group">
            <div className="guideline-control-label">
              <span>Overlay Opacity</span>
              <span>{Math.round(overlayOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.05"
              className="guideline-control-slider"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            />
          </div>

          {/* Blend mode control */}
          <div className="guideline-control-group">
            <div className="guideline-control-label">
              <span>Blend Mode</span>
            </div>
            <select
              className="guideline-control-input"
              value={blendMode}
              onChange={(e) => setBlendMode(e.target.value)}
            >
              <option value="normal">Normal (Translucent image)</option>
              <option value="difference">Difference (Align elements)</option>
            </select>
          </div>

          {/* Scale Control */}
          <div className="guideline-control-group">
            <div className="guideline-control-label">
              <span>Scale Mockup</span>
              <span>{scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              className="guideline-control-slider"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
          </div>

          {/* Position offsets */}
          <div className="guideline-control-group">
            <div className="guideline-control-label">
              <span>Align Position (Offsets)</span>
            </div>
            <div className="guideline-offset-grid">
              <div>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>Offset X: {offsetX}px</span>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="5"
                  className="guideline-control-slider"
                  value={offsetX}
                  onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
                />
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>Offset Y: {offsetY}px</span>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="5"
                  className="guideline-control-slider"
                  value={offsetY}
                  onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          </div>

          {/* Reset position settings */}
          <button
            type="button"
            className="otp-demo-btn"
            style={{ height: "30px", fontSize: "11px", padding: "4px 8px !important", marginTop: "6px" }}
            onClick={() => {
              setScale(1.0);
              setOffsetX(0);
              setOffsetY(0);
              setOverlayOpacity(0.4);
              setBlendMode("normal");
            }}
          >
            Reset Alignment Options
          </button>
        </div>
      )}
    </div>
  );
};

export default OtpDemo;
