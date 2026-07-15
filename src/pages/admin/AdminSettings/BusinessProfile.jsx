import React from 'react';
import { FaSave, FaBuilding } from 'react-icons/fa';
import { BsSliders } from 'react-icons/bs';
import { TbShieldCheck } from 'react-icons/tb';   // ← New import
import { Spinner } from 'react-bootstrap';
import './BusinessProfile.css';

const BusinessProfile = ({ business, handleBusinessChange, handleBusinessSave, saving, fetchBusinessSettings }) => {
  return (
    <div className="bp-container mt-2">
      {/* Header */}
      <header className="bp-header">
        <div className="bp-header-title-container">
          <h1 className="bp-header-title">Business Profile</h1>
          <p className="bp-header-desc">
            Configure your business details, branding, and localization preferences across the platform.
          </p>
        </div>
        <div className="bp-header-actions">
          <button type="button" className="bp-btn-outline" onClick={fetchBusinessSettings}>
            Discard
          </button>
          <button type="button" className="bp-btn-filled" onClick={handleBusinessSave} disabled={saving}>
            {saving ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : <FaSave className="me-2" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* General Information */}
      <section className="bp-card">
        <div className="bp-card-header">
          <div className="d-flex align-items-center gap-2 mb-0">
            <span className="bp-brand-teal-text"><FaBuilding size={16} /></span>
            <h2 className="bp-section-title">General Information</h2>
          </div>
          <p className="bp-section-desc">Primary details for your organization identity</p>
        </div>
        <div className="bp-card-body">
          <div className="bp-grid mb-3">
            <div>
              <label className="bp-label">Business Name</label>
              <input
                className="bp-input"
                type="text"
                name="companyName"
                value={business.companyName}
                onChange={handleBusinessChange}
                placeholder="EventPro Management"
              />
            </div>
            <div>
              <label className="bp-label">Website URL</label>
              <input
                className="bp-input"
                type="url"
                name="website"
                value={business.website}
                onChange={handleBusinessChange}
                placeholder="https://www.eventpro.in"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="mb-3">
            <label className="bp-label">Business Logo</label>
            <div className="bp-upload-box">
              {business.logo ? (
                <div className="bp-preview-container">
                  <img
                    src={typeof business.logo === 'string' ? business.logo : URL.createObjectURL(business.logo)}
                    alt="Business Logo"
                    className="bp-preview-img"
                  />
                  <button
                    type="button"
                    className="bp-preview-remove"
                   onClick={() =>
                    handleBusinessChange({
                      target: {
                        name: "logo",
                        type: "file",
                        files: [],
                      },
                    })
                  }
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div className="bp-upload-icon-container">
                    <svg className="bp-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 m-0">
                    <label className="bp-brand-teal-text font-semibold cursor-pointer m-0">
                      Upload a file
                      <input type="file" name="logo" accept="image/*" onChange={handleBusinessChange} style={{ display: 'none' }} />
                    </label>{' '}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1 mb-0">PNG, JPG up to 2MB (Recommended: 256x256px)</p>
                </>
              )}
            </div>
          </div>

          <div className="bp-grid">
            <div>
              <label className="bp-label">Email Address</label>
              <input
                className="bp-input"
                type="email"
                name="companyEmail"
                value={business.companyEmail}
                onChange={handleBusinessChange}
                placeholder="info@vevora.in"
              />
            </div>
            <div>
              <label className="bp-label">Contact Number</label>
              <div className="bp-input-group">
                <span className="bp-input-group-addon">+91</span>
                <input
                  className="bp-input"
                  type="text"
                  name="companyPhone"
                  value={business.companyPhone}
                  onChange={handleBusinessChange}
                  placeholder="98200 00000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Address & Contact */}
      <section className="bp-card">
        <div className="bp-card-header">
          <div className="d-flex align-items-center gap-2 mb-0">
            <span className="bp-brand-teal-text">
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </span>
            <h2 className="bp-section-title">Address &amp; Contact</h2>
          </div>
          <p className="bp-section-desc">Physical location and contact preferences</p>
        </div>
        <div className="bp-card-body">
          <div>
            <label className="bp-label">Address</label>
            <textarea
              className="bp-textarea"
              rows="3"
              name="address"
              value={business.address}
              onChange={handleBusinessChange}
              placeholder="Enter business address..."
            />
          </div>
          <div className="bp-security-banner">
            <div className="bp-security-content">
              <div className="bp-security-icon-container">
                {/* ✅ Replaced SVG with TbShieldCheck */}
                <TbShieldCheck size={18} className="bp-brand-teal-text" />
              </div>
              <div className="bp-security-text-container">
                <h4 className="bp-security-title">Security Verification</h4>
                <p className="bp-security-desc">
                  Your business address is used for automated tax invoicing and regulatory compliance documents.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="bp-map-link"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`,
                  '_blank'
                )
              }
            >
              View Map
            </button>
          </div>
        </div>
      </section>

      {/* General Preferences – Bold icon */}
      <section className="bp-card">
        <div className="bp-card-header" style={{ borderBottom: 'none' }}>
          <div className="d-flex align-items-center gap-2 mb-0">
            <span 
              className="bp-brand-teal-text" 
              style={{ 
                display: 'inline-flex', 
                filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.15))'
              }}
            >
              <BsSliders size={16} />
            </span>
            <h2 className="bp-section-title">General Preferences</h2>
          </div>
        </div>
        <div className="bp-pref-list">
          <div className="bp-pref-row">
            <div className="bp-pref-info">
              <div className="bp-pref-icon-container blue">
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <p className="bp-pref-title">Language</p>
                <p className="bp-pref-desc">System display language</p>
              </div>
            </div>
            <select name="language" value={business.language} onChange={handleBusinessChange} className="bp-select-badge">
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
          <div className="bp-pref-row">
            <div className="bp-pref-info">
              <div className="bp-pref-icon-container amber">
                <span style={{ fontSize: '14px', fontWeight: '700' }}>₹</span>
              </div>
              <div>
                <p className="bp-pref-title">Currency</p>
                <p className="bp-pref-desc">INR — Indian Rupee</p>
              </div>
            </div>
            <select name="currency" value={business.currency} onChange={handleBusinessChange} className="bp-select-text">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className="bp-pref-row">
            <div className="bp-pref-info">
              <div className="bp-pref-icon-container emerald">
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <p className="bp-pref-title">Dark Mode</p>
                <p className="bp-pref-desc">Interface appearance</p>
              </div>
            </div>
            <label className="bp-switch">
              <input type="checkbox" name="darkMode" checked={business.darkMode} onChange={handleBusinessChange} />
              <span className="bp-slider"></span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessProfile;