// ResetPasswordDemo.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import mailImg from "../assets/images/mail-forgot-pass.png";
import mobileImg from "../assets/images/mobile.png";
import registrationImg from "../assets/images/registration.png";
import "./ResetPasswordDemo.css";

const ResetPasswordDemo = () => {
  // Password inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Real-time password requirement flags
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpperAndLower, setHasUpperAndLower] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  // Design Guideline Overlay Tool States
  const [panelOpen, setPanelOpen] = useState(false);
  const [overlayEnabled, setOverlayEnabled] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.4);
  const [selectedImgName, setSelectedImgName] = useState("mobile.png"); // Matches screenshot's background
  const [blendMode, setBlendMode] = useState("normal");
  const [scale, setScale] = useState(1.0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const imgMap = {
    "mail-forgot-pass.png": mailImg,
    "mobile.png": mobileImg,
    "registration.png": registrationImg,
  };

  // Run real-time validators
  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUpperAndLower(/[a-z]/.test(password) && /[A-Z]/.test(password));
    setHasSpecialChar(/[^A-Za-z0-9]/.test(password));
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasMinLength || !hasUpperAndLower || !hasSpecialChar) {
      setError("Please satisfy all security requirements before proceeding.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both inputs.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    // Simulate reset API delay
    setTimeout(() => {
      setLoading(false);
      setSuccess("Password updated successfully! Redirecting to login...");
      setPassword("");
      setConfirmPassword("");
    }, 1200);
  };

  return (
    <div className="reset-demo-container">
      {/* LEFT PANEL: branding & visual cover page using mobile.png (green smoke) */}
      <div
        className="reset-demo-left-panel"
        style={{ backgroundImage: `url(${mobileImg})` }}
      >
        <div className="reset-demo-left-content">
          <div className="reset-demo-logo-section">
            <span className="reset-demo-logo-brand">Vevora</span>
            <span className="reset-demo-logo-sub">Event Management</span>
          </div>

          <div className="reset-demo-middle">
            <h1 className="reset-demo-headline">
              Secure Your Professional<br />
              Workspace
            </h1>
            <p className="reset-demo-description">
              Vevora ensures your event data remains private and secure. Updating your password regularly is a best practice for corporate security standards.
            </p>

            <div className="reset-demo-stats-row">
              <div className="reset-demo-stat-card">
                <div className="reset-demo-stat-value">12K+</div>
                <div className="reset-demo-stat-label">Events Hosted</div>
              </div>
              <div className="reset-demo-stat-card">
                <div className="reset-demo-stat-value">99.9%</div>
                <div className="reset-demo-stat-label">Security</div>
              </div>
            </div>
          </div>

          <div className="reset-demo-footer">
            © 2026 Vevora Event Management. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Reset Form */}
      <div className="reset-demo-right-panel">
        <div className="reset-demo-form-wrapper">
          <h2 className="reset-demo-title">Reset Password</h2>
          <p className="reset-demo-subtitle">
            Create a new, strong password for your account
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

          <form onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div className="reset-demo-group">
              <label className="reset-demo-label">New Password</label>
              <div className="reset-demo-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="reset-demo-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  required
                />
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} reset-demo-password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="reset-demo-group">
              <label className="reset-demo-label">Confirm Password</label>
              <div className="reset-demo-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="reset-demo-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  required
                />
                <i
                  className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} reset-demo-password-toggle`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
            </div>

            {/* Security Requirements Checklist Box */}
            <div className="reset-demo-requirements-box">
              <div className="reset-demo-req-title">Security Requirements</div>
              <div className="reset-demo-req-list">
                <div className="reset-demo-req-item">
                  <i className={`bi ${hasMinLength ? "bi-check-circle-fill" : "bi-check-circle"} reset-demo-req-icon ${hasMinLength ? "checked" : "unchecked"}`}></i>
                  <span>At least 8 characters</span>
                </div>
                <div className="reset-demo-req-item">
                  <i className={`bi ${hasUpperAndLower ? "bi-check-circle-fill" : "bi-check-circle"} reset-demo-req-icon ${hasUpperAndLower ? "checked" : "unchecked"}`}></i>
                  <span>Uppercase & lowercase letters</span>
                </div>
                <div className="reset-demo-req-item">
                  <i className={`bi ${hasSpecialChar ? "bi-check-circle-fill" : "bi-check-circle"} reset-demo-req-icon ${hasSpecialChar ? "checked" : "unchecked"}`}></i>
                  <span>At least one special character</span>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="reset-demo-btn"
              disabled={loading || !password || !confirmPassword}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>
                  Update Password <i className="bi bi-arrow-right" style={{ fontSize: "14px", strokeWidth: "3px" }}></i>
                </>
              )}
            </button>

            {/* Bottom Centered Nav Back to Login */}
            <div className="reset-demo-bottom-nav">
              <Link to="/login" className="reset-demo-login-link">
                Back to Login
              </Link>
            </div>
          </form>
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
        style={{ backgroundColor: panelOpen ? "var(--primary-color)" : "#0f172a", right: "80px" }} // offset slightly to not overlap OTP inspector button if both pages are open or on screen
      >
        <i className={panelOpen ? "bi bi-x-lg" : "bi bi-aspect-ratio"}></i>
      </div>

      {/* OVERLAY CONTROL PANEL CONTROL BOX */}
      {panelOpen && (
        <div className="guideline-control-panel" style={{ right: "80px" }}>
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
                style={{ accentColor: "var(--primary-color)", cursor: "pointer" }}
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
              <option value="mobile.png">mobile.png</option>
              <option value="mail-forgot-pass.png">mail-forgot-pass.png</option>
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
            className="reset-demo-btn"
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

export default ResetPasswordDemo;
