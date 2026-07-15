import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Card, Spinner, InputGroup } from "react-bootstrap";
import { FaSave, FaShieldAlt, FaCheckCircle, FaSlidersH } from "react-icons/fa";
import { getGSTSettings, updateGSTSettings } from "../../../services/settingsService";

const filingStatus = [
  {
    title: "GSTR-1",
    subtitle: "Filed Jun 11, 2026",
    status: "Filed",
    color: "#10B981",
    bg: "#E6FFF7",
  },
  {
    title: "GSTR-3B",
    subtitle: "Due Jun 20, 2026",
    status: "Filed",
    color: "#10B981",
    bg: "#E6FFF7",
  },
  {
    title: "Annual Return",
    subtitle: "FY 2024–25 complete",
    status: "Pending",
    color: "#F59E0B",
    bg: "#FFF1D8",
  },
];

const GSTConfiguration = () => {
  const [saving, setSaving] = useState(false);

  const [gstConfig, setGstConfig] = useState({
    gstNumber: "27AABCE1234F1Z5",
    legalBusinessName: "Vevora Management Pvt Ltd",
    panNumber: "AABCE1234F",
    hsnCode: "998554 – Event Management",
    registrationState: "MAHARASHTRA",
    accountantEmail: "info@vevora.in",
  });

  const [gstSettings, setGstSettings] = useState({
    defaultRate: 18,
    supplyType: "Intra-state (CGST + SGST)",
    filingFrequency: "Monthly",
  });

  useEffect(() => {
    const fetchGst = async () => {
      try {
        const res = await getGSTSettings();
        if (res.success) {
          const data = res.data;
          setGstConfig({
            gstNumber: data.gstNumber || "",
            legalBusinessName: data.legalBusinessName || "",
            panNumber: data.panNumber || "",
            hsnCode: data.hsnCode || "",
            registrationState: data.registrationState || "",
            accountantEmail: data.accountantEmail || "",
          })
          setGstSettings({
            defaultRate: data.defaultRate || 18,
            supplyType: data.supplyType || "Intra-state (CGST + SGST)",
            filingFrequency: data.filingFrequency || "Monthly",
          })
        }
      } catch (error) {
        console.error("failed to fetch GST settings", error);
      }
    }
    fetchGst();
  }, []);

  const handleGSTSettingsChange = (e) => {
    const { name, value } = e.target;
    setGstSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const gstRates = [
    { value: 0, label: "Exempt" },
    { value: 5, label: "Basic" },
    { value: 12, label: "Standard" },
    { value: 18, label: "Service" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setGstConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const totalRate = gstSettings.defaultRate || 18;
      const payload = {
        gstNumber: gstConfig.gstNumber,
        legalBusinessName: gstConfig.legalBusinessName,
        panNumber: gstConfig.panNumber,
        hsnCode: gstConfig.hsnCode,
        registrationState: gstConfig.registrationState,
        accountantEmail: gstConfig.accountantEmail,
        defaultRate: totalRate,
        cgstRate: totalRate / 2,
        sgstRate: totalRate / 2,
        supplyType: gstSettings.supplyType,
        filingFrequency: gstSettings.filingFrequency
      };
      const res = await updateGSTSettings(payload);

      if (res.success) {
        alert("GST Configuration saved Successfully");
      }
    } catch (error) {
      console.error("Error saving GST settings:", error);
      alert("Failed to save GST Configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div

    >
      {/* Header */}
      <Card
        className="mb-4"
        style={{
          border: "1px solid #E2E8F0",
          borderRadius: "3px",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        }}
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h4
                style={{
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 6,
                }}
              >
                GST Configuration
              </h4>

              <p
                style={{
                  color: "#6B7280",
                  marginBottom: 0,
                  fontSize: 14,
                }}
              >
                Manage GSTIN details, tax rates, and GST return filing
                preferences
              </p>
            </div>

            <div className="d-flex gap-2">
             <Button
                variant="light"
                style={{
                  padding: "6px 18px",
                  border: "1px solid #E2E8F0",
                  background: "#FFFFFF",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#374151",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#F9FAFB";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#FFFFFF";
                }}
              >
                Reset Default
              </Button>

              <Button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: "#0D9488",
                  border: 0,
                  padding: "10px 22px",
                }}
              >
                {saving ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : (
                  <>

                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* GST Details */}
      <Card
        className="mb-4"
        style={{
          border: "1px solid #E2E8F0",
          borderRadius: "3px",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        }}
      >
        <Card.Body>
          <div className="d-flex align-items-center mb-2">
            <FaShieldAlt
              color="#0D9488"
              className="me-2"
            />

            <h5
              className="mb-0"
              style={{
                fontWeight: 700,
                color: "#111827",
              }}
            >
              GSTIN Details
            </h5>
          </div>

          <p
            style={{
              color: "#6B7280",
              fontSize: 14,
            }}
          >
            Enter and verify your GST registration information for tax
            compliance.
          </p>

          <hr style={{ borderColor: "#cdcecf" }} />

          <Row className="g-4">
            {/* GST Number */}
            <Col md={6}>
  <Form.Group>
    <Form.Label
      style={{
        fontWeight: 600,
        color: "#111827",
        marginBottom: "8px",
      }}
    >
      GSTIN Number
    </Form.Label>

    <InputGroup>
      <Form.Control
        name="gstNumber"
        value={gstConfig.gstNumber}
        onChange={handleChange}
        style={{
          height: "46px",
          borderColor: "#E2E8F0",
          borderRight: "0",
          background: "#FFFFFF",
          color: "#111827",
          fontSize: "14px",
        }}
      />
      <InputGroup.Text
        style={{
          background: "#fff",
          color: "#10B981",
          fontWeight: 600,
          borderColor: "#E2E8F0",
          borderLeft: "0",
        }}
      >
        <FaCheckCircle className="me-1" />
        Verified
      </InputGroup.Text>
    </InputGroup>

    <small
      style={{
        color: "#10B981",
        marginTop: "8px",
        display: "block",
        fontSize: "13px",
      }}
    >
      Registered: Maharashtra, India
    </small>
  </Form.Group>
</Col>

            {/* Business Name */}
            <Col md={6}>
              <Form.Label
                style={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Legal Business Name
              </Form.Label>

              <Form.Control
                name="legalBusinessName"
                value={gstConfig.legalBusinessName}
                onChange={handleChange}
                style={{
                  height: "46px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  background: "#FFFFFF",
                  color: "#111827",
                  fontSize: "14px",
                  //boxShadow: "none",
                }}
                 />
            </Col>

            {/* PAN */}
            <Col md={6}>
              <Form.Label
                style={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                PAN Number
              </Form.Label>

              <Form.Control
                name="panNumber"
                value={gstConfig.panNumber}
                onChange={handleChange}
                 style={{
                  height: "46px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  background: "#FFFFFF",
                  color: "#111827",
                  fontSize: "14px",
                  //boxShadow: "none",
                }}
              />
            </Col>

            {/* HSN */}
            <Col md={6}>
              <Form.Label
                style={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                HSN / SAC Code
              </Form.Label>

              <Form.Control
                name="hsnCode"
                value={gstConfig.hsnCode}
                onChange={handleChange}
                 style={{
                  height: "46px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  background: "#FFFFFF",
                  color: "#111827",
                  fontSize: "14px",
                  //boxShadow: "none",
                }}
              />
            </Col>

            {/* State */}
            <Col md={6}>
              <Form.Label
                style={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Registration State
              </Form.Label>

              <Form.Control
                name="registrationState"
                value={gstConfig.registrationState}
                onChange={handleChange}
                 style={{
                  height: "46px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  background: "#FFFFFF",
                  color: "#111827",
                  fontSize: "14px",
                  //boxShadow: "none",
                }}
              />
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Label
                style={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Accountant Email
              </Form.Label>

              <Form.Control
                type="email"
                name="accountantEmail"
                value={gstConfig.accountantEmail}
                onChange={handleChange}
                style={{
                  height: "46px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  background: "#FFFFFF",
                  color: "#111827",
                  fontSize: "14px",
                  //boxShadow: "none",
                }}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card
        className="mb-4"
        style={{
          border: "1px solid #E2E8F0",
          borderRadius: "3px",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        }}
      >
        <Card.Body>
          <div className="d-flex align-items-center mb-2">
            <span
              style={{
                color: "#0D9488",
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              %
            </span>

            <h5
              className="mb-0 ms-2"
              style={{
                fontWeight: 700,
                color: "#111827",
              }}
            >
              GST Rate & Supply Type
            </h5>
          </div>

          <p
            style={{
              color: "#6B7280",
              fontSize: 14,
            }}
          >
            Set default tax rates applied to all invoices and quotations.
          </p>

          <hr style={{ borderColor: "#E2E8F0" }} />

          <Form.Label
            style={{
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Default GST Rate
          </Form.Label>

          <Row className="g-3 mb-4">
            {gstRates.map((rate) => (
              <Col xs={6} md={3} key={rate.value}>
                <div
                  onClick={() =>
                    setGstSettings({
                      ...gstSettings,
                      defaultRate: rate.value,
                    })
                  }
                  style={{
                    cursor: "pointer",
                    border:
                      gstSettings.defaultRate === rate.value
                        ? "2px solid #0D9488"
                        : "1px solid #E2E8F0",
                    background:
                      gstSettings.defaultRate === rate.value
                        ? "#E0FAF7"
                        : "#FFFFFF",
                    borderRadius: "8px",
                    textAlign: "center",
                    padding: "14px",
                    transition: ".2s",
                  }}
                >
                  <h4
                    style={{
                      marginBottom: 2,
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {rate.value}%
                  </h4>

                  <small
                    style={{
                      color: "#6B7280",
                    }}
                  >
                    {rate.label}
                  </small>
                </div>
              </Col>
            ))}
          </Row>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label
                  style={{
                    fontWeight: 600,
                  }}
                >
                  Supply Type
                </Form.Label>

                <Form.Select
                  name="supplyType"
                  value={gstSettings.supplyType}
                  onChange={handleGSTSettingsChange}
                  style={{
                    height: 46,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <option>Intra-state (CGST + SGST)</option>
                  <option>Inter-state (IGST)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label
                  style={{
                    fontWeight: 600,
                  }}
                >
                  GSTR-1 Filing Frequency
                </Form.Label>

                <Form.Select
                  name="filingFrequency"
                  value={gstSettings.filingFrequency}
                  onChange={handleGSTSettingsChange}
                  style={{
                    height: 46,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annually</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div
            className="mt-4"
            style={{
              background: "#E0FAF7",
              border: "1px solid #B9EFE8",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div
              style={{
                color: "#0D9488",
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Tax breakdown — {gstSettings.supplyType.includes("Intra-state") ? "Intra-state" : "Inter-state"} ({gstSettings.defaultRate}%)
            </div>

            {gstSettings.supplyType.includes("Intra-state") ? (
              <>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#0D9488" }}>CGST</span>
                  <strong style={{ color: "#0D9488" }}>{gstSettings.defaultRate / 2}%</strong>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: "#0D9488" }}>SGST</span>
                  <strong style={{ color: "#0D9488" }}>{gstSettings.defaultRate / 2}%</strong>
                </div>
              </>
            ) : (
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: "#0D9488" }}>IGST</span>
                <strong style={{ color: "#0D9488" }}>{gstSettings.defaultRate}%</strong>
              </div>
            )}

            <hr
              style={{
                margin: "10px 0",
                borderColor: "#bfc1c4",
              }}
            />

            <div className="d-flex justify-content-between">
              <strong style={{
                color: "#0D9488",
              }}>Total GST</strong>
              <strong style={{
                color: "#0D9488",
              }}>{gstSettings.defaultRate}%</strong>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card
        className="mb-4"
        style={{
          border: "1px solid #E2E8F0",
          borderRadius: "3px",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        }}
      >
        <Card.Body>
          <div className="d-flex align-items-center mb-4">
            <FaSlidersH
              size={16}
              color="#0D9488"
              className="me-2"
            />

            <h5
              className="mb-0"
              style={{
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Filing Status
            </h5>
          </div>

          {filingStatus.map((item, index) => (
            <React.Fragment key={index}>
              <div className="d-flex justify-content-between align-items-center py-2">
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#111827",
                      fontSize: "16px",
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6B7280",
                    }}
                  >
                    {item.subtitle}
                  </div>
                </div>

                <span
                  style={{
                    background: item.bg,
                    color: item.color,
                    fontSize: "13px",
                    fontWeight: 700,
                    padding: "6px 14px",
                    borderRadius: "20px",
                    minWidth: "70px",
                    textAlign: "center",
                  }}
                >
                  {item.status}
                </span>
              </div>

              {index !== filingStatus.length - 1 && (
                <hr
                  style={{
                    margin: "12px 0",
                    borderColor: "#E2E8F0",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};



export default GSTConfiguration
