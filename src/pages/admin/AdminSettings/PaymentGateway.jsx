import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Form, Modal, Spinner } from "react-bootstrap";
import "./PaymentGateway.css";
import {
  FaMobileAlt, FaCreditCard, FaUniversity,
} from "react-icons/fa";
import { TbLayoutNavbarInactive } from "react-icons/tb";
import { 
  getPaymentSettings,
  updatePaymentSettings,
  getGateways,
  saveGateway,
  configureGateway,
  toggleGateway,
  setPrimaryGateway,
  testRazorpayConnection
} from "../../../services/settingsService.js";

const PaymentGateway = () => {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [selectedGatewayKey, setSelectedGatewayKey] = useState(null);
  const [toggleAction, setToggleAction] = useState(null);
  const [isConfigureMode, setIsConfigureMode] = useState(false);
  
  const [gateways, setGateways] = useState([]);
  const [preferences, setPreferences] = useState([
    {
      title: "Offline payments (Cash / Cheque / Transfer)",
      desc: "Allow manual payment recording",
      enabled: true,
      key: "allowOfflinePayments"
    },
    {
      title: "Partial payment – advance + balance model",
      desc: "Collect 50% advance on booking confirmation",
      enabled: true,
      key: "allowPartialPayments"
    },
    {
      title: "Auto-send payment link on booking",
      desc: "Via WhatsApp + Email on confirmation",
      enabled: true,
      key: "autoSendPaymentLink"
    },
    {
      title: "Auto-approve refunds under ₹1,000",
      desc: "Without manual review",
      enabled: false,
      key: "autoApproveRefund"
    },
  ]);

  // ===== FORM STATE =====
  const [formData, setFormData] = useState({
    gatewayType: 'RAZORPAY',
    accountName: '',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    upiId: '',
    upiName: '',
    stripePublishableKey: '',
    stripeSecretKey: '',
  });

  const gatewayTypes = [
    { key: 'RAZORPAY', name: 'Razorpay', icon: <FaCreditCard className="text-primary" /> },
    { key: 'UPI', name: 'UPI / PhonePe', icon: <FaMobileAlt className="text-success" /> },
    { key: 'STRIPE', name: 'Stripe', icon: <FaUniversity className="text-secondary" /> },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await fetchGateways();
    await fetchPreferences();
  };

  const fetchGateways = async () => {
    try {
      const response = await getGateways();
      if (response.success) {
        const gatewayList = response.data.gateways.map((g, index) => ({
          id: index + 1,
          key: g.key,
          type: g.type,
          name: g.name,
          email: g.email,
          status: g.status,
          isActive: g.isActive,
          isConfigured: g.isConfigured,
          isPrimary: g.isPrimary || false,
          accountId: g.accountId,
          keyId: g.keyId || '',
          keySecret: g.keySecret || '',
          upiId: g.upiId || '',
          upiName: g.upiName || '',
          stripePublishableKey: g.stripePublishableKey || '',
          stripeSecretKey: g.stripeSecretKey || '',
          icon: g.type === 'RAZORPAY' ? <FaCreditCard className="text-primary" /> :
                g.type === 'UPI' ? <FaMobileAlt className="text-success" /> :
                <FaUniversity className="text-secondary" />
        }));
        setGateways(gatewayList);
      }
    } catch (error) {
      console.error("Error fetching gateways:", error);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await getPaymentSettings();
      if (response) {
        setPreferences(prev => prev.map(p => ({
          ...p,
          enabled: response[p.key] ?? p.enabled
        })));
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceToggle = (index) => {
    const data = [...preferences];
    data[index].enabled = !data[index].enabled;
    setPreferences(data);
  };

  const handleAddNew = () => {
    setIsConfigureMode(false);
    setFormData({
      gatewayType: 'RAZORPAY',
      accountName: '',
      razorpayKeyId: '',
      razorpayKeySecret: '',
      upiId: '',
      upiName: '',
      stripePublishableKey: '',
      stripeSecretKey: '',
    });
    setShowModal(true);
  };

const handleConfigure = (gateway) => {
  setIsConfigureMode(true);
  setSelectedGatewayKey(gateway.key);
  
  setFormData({
    gatewayType: gateway.type,
    accountName: gateway.name,
    razorpayKeyId: gateway.keyId || '',
    razorpayKeySecret: gateway.keySecret || '',
    upiId: gateway.upiId || '',
    upiName: gateway.upiName || '',
    stripePublishableKey: gateway.stripePublishableKey || '',
    stripeSecretKey: gateway.stripeSecretKey || '',
  });
  
  setShowModal(true);
};

  const handleSaveGateway = async () => {
    try {
      setLoading(true);
      
      let response;
      if (isConfigureMode) {
        const configData = {
          razorpayKeyId: formData.razorpayKeyId,
          razorpayKeySecret: formData.razorpayKeySecret,
          upiId: formData.upiId,
          upiName: formData.upiName,
          stripePublishableKey: formData.stripePublishableKey,
          stripeSecretKey: formData.stripeSecretKey,
        };
        response = await configureGateway(selectedGatewayKey, configData);
      } else {
        response = await saveGateway(formData);
      }
      
      if (response.success) {
        alert(response.message || "Gateway saved successfully!");
        setShowModal(false);
        await fetchGateways();
      }
    } catch (error) {
      alert(error.response?.data?.message || "❌ Failed to save gateway");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (gateway, action) => {
    setSelectedGatewayKey(gateway.key);
    setToggleAction(action);
    setShowToggleModal(true);
  };

  const confirmToggle = async () => {
    try {
      setLoading(true);
      const response = await toggleGateway(selectedGatewayKey, toggleAction);
      if (response.success) {
        alert(response.message);
        setShowToggleModal(false);
        await fetchGateways();
      }
    } catch (error) {
      alert(error.response?.data?.message || "❌ Failed to toggle gateway");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimary = async (gatewayKey) => {
    try {
      setLoading(true);
      const response = await setPrimaryGateway(gatewayKey);
      if (response.success) {
        alert(response.message);
        await fetchGateways();
      }
    } catch (error) {
      alert(error.response?.data?.message || "❌ Failed to set primary");
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      const data = {
        keyId: formData.razorpayKeyId,
        keySecret: formData.razorpayKeySecret,
      };
      const response = await testRazorpayConnection(data);
      if (response.success) {
        alert(response.message || "Connection successful!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "❌ Connection failed");
    } finally {
      setTesting(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSaveLoading(true);
      
      const paymentData = {
        allowOfflinePayments: preferences.find(p => p.key === 'allowOfflinePayments')?.enabled ?? true,
        allowPartialPayments: preferences.find(p => p.key === 'allowPartialPayments')?.enabled ?? true,
        advancePercentage: 50,
        autoSendPaymentLink: preferences.find(p => p.key === 'autoSendPaymentLink')?.enabled ?? true,
        autoApproveRefund: preferences.find(p => p.key === 'autoApproveRefund')?.enabled ?? false,
        refundLimit: 1000,
      };
      
      const response = await updatePaymentSettings(paymentData);
      if (response.success) {
        alert(response.message || "Settings saved successfully!");
        await fetchPreferences();
      }
    } catch (error) {
      alert(error.response?.data?.message || "❌ Failed to save settings");
    } finally {
      setSaveLoading(false);
    }
  };


  const handleResetDefault = async () => {
    if (window.confirm("Are you sure you want to reset all payment settings to default?")) {
      try {
        setSaveLoading(true);
        const defaultData = {
          gatewayAccounts: [],
          allowOfflinePayments: true,
          allowPartialPayments: true,
          advancePercentage: 50,
          autoSendPaymentLink: true,
          autoApproveRefund: false,
          refundLimit: 1000,
        };
        await updatePaymentSettings(defaultData);
        alert("Settings reset to default!");
        await fetchAllData();
      } catch (error) {
        alert(error.response?.data?.message || "❌ Failed to reset settings");
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const badgeColor = (status) => {
    if (status === "Primary") {
      return { bg: "#D1FAE5", color: "#059669" };
    }
    if (status === "Active") {
      return { bg: "#DBEAFE", color: "#2563EB" };
    }
    return { bg: "#F3F4F6", color: "#6B7280" };
  };

  const getGatewayDisplayName = (gateway) => {
    if (gateway.type === 'RAZORPAY') return 'Razorpay';
    if (gateway.type === 'UPI') return 'UPI';
    if (gateway.type === 'STRIPE') return 'Stripe';
    return gateway.type;
  };

  const getGatewayDisplayEmail = (gateway) => {
    if (gateway.type === 'RAZORPAY') {
      return gateway.email;
    }
    if (gateway.type === 'UPI') {
      return gateway.email;
    }
    return gateway.email;
  };

  return (
    <div className="payment-gateway-wrapper mt-2"> 
      {/* Header */}
      <Card className="mb-4" style={{ borderRadius: '10px' }}>
        <Card.Body style={{ padding: '17px 24px' }}>
          <div className="header-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h5 style={{ fontWeight: '700', fontSize: '20px', color: '#111827', marginBottom: '4px' }}>
                Payment Gateway
              </h5>
              <small style={{ color: '#6b7280', fontSize: '13px', fontWeight: '300' }}>
                Connect payment providers, configure API keys, and set payment policies
              </small>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <Button
                variant="outline-secondary"
                onClick={handleResetDefault}
                disabled={saveLoading}
                style={{
                  borderColor: '#E5E7EB',
                  color: '#374151',
                  fontSize: '13px',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent'
                }}
              >
                Reset Default
              </Button>

              <Button 
                onClick={handleSavePreferences}
                disabled={saveLoading}
                style={{
                  backgroundColor: '#0D9488',
                  border: 'none',
                  fontSize: '13px',
                  padding: '6px 20px',
                  borderRadius: '6px',
                  color: '#FFFFFF'
                }}
              >
                {saveLoading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Active Gateway */}
      <Card className="mb-4" style={{ borderRadius: '10px' }}>
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <h6 className="fw-bold mb-1" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <TbLayoutNavbarInactive size={18} style={{ color: '#0D9488', stroke: '#0D9488', strokeWidth: '2px' }} />
                Active Gateways
              </h6>
              <small style={{ fontSize: "13px", color: "#6b7280" }}>
                Configured providers for online collections.
              </small>
            </Col>
            <Col xs="auto">
              <Button
                variant="link"
                className="text-success text-decoration-none fw-semibold p-0"
                style={{ fontSize: '15px' }}
                onClick={handleAddNew}
              >
                + Add New
              </Button>
            </Col>
          </Row>

          {gateways.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <p>No gateways configured yet.</p>
              <small>Click "+ Add New" to configure a payment gateway.</small>
            </div>
          ) : (
            gateways.map((gateway) => {
              const color = badgeColor(gateway.isPrimary ? 'Primary' : gateway.status);
              return (
                <div key={gateway.id} className="gateway-card">
                  <Row className="align-items-center">
                    <Col md={7}>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded d-flex justify-content-center align-items-center me-3"
                          style={{
                            width: 45,
                            height: 45,
                            fontSize: 20,
                            backgroundColor: '#F3F4F6',
                          }}
                        >
                          {gateway.icon}
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold" style={{ fontSize: '15px' }}>
                            {getGatewayDisplayName(gateway)}
                            
                          </h6>
                          <small className="text-muted gateway-email">
                            {getGatewayDisplayEmail(gateway)}
                            {gateway.name && (
                              <span className="ms-2" style={{ color: '#9CA3AF', fontSize: '11px' }}>
                                ({gateway.name})
                              </span>
                            )}
                          </small>
                        </div>
                      </div>
                    </Col>
                    <Col md={5} className="text-md-end mt-3 mt-md-0">
                      <span
                        className="me-2 px-2 py-1"
                        style={{
                          backgroundColor: color.bg,
                          color: color.color,
                          border: "none",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "600",
                          display: "inline-block",
                        }}
                      >
                        {gateway.isPrimary ? 'Primary' : gateway.status}
                      </span>
                      
                      {gateway.isConfigured ? (
                        <>
                          {!gateway.isPrimary && gateway.isActive && (
                            <Button 
                              size="sm" 
                              variant="outline-primary" 
                              className="me-1"
                              onClick={() => handleSetPrimary(gateway.key)}
                            >
                              Set Primary
                            </Button>
                          )}
                          {gateway.isActive ? (
                            <Button 
                              size="sm" 
                              variant="outline-danger"
                              onClick={() => handleToggle(gateway, 'disconnect')}
                            >
                              Disconnect
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline-success"
                              onClick={() => handleToggle(gateway, 'connect')}
                            >
                              Connect
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button 
                        size="sm" 
                        variant="outline-success"
                          onClick={() => handleConfigure(gateway)}
                        >
                          Configure
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              );
            })
          )}
        </Card.Body>
      </Card>

      {/* Payment Preferences */}
      <Card>
        <Card.Body>
          <h6 className="fw-bold mb-4">Payment Preferences</h6>
          {preferences.map((item, index) => (
            <div key={index} className={`py-1 ${index !== preferences.length - 1 ? "border-bottom" : ""}`}>
              <Row className="align-items-center">
                <Col>
                  <div className="fw-semibold">{item.title}</div>
                  <small style={{ fontSize: "13px", color: "#6b7280" }}>{item.desc}</small>
                </Col>
                <Col xs="auto">
                  <Form.Check
                    type="switch"
                    id={`switch-${index}`}
                    checked={item.enabled}
                    onChange={() => handlePreferenceToggle(index)}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{isConfigureMode ? 'Configure' : 'Add New'} Payment Gateway</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Gateway Type <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="gatewayType"
                value={formData.gatewayType}
                onChange={handleFormChange}
                style={{ borderRadius: '8px', padding: '10px' }}
                disabled={isConfigureMode}
              >
                {gatewayTypes.map(g => (
                  <option key={g.key} value={g.key}>{g.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Account Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleFormChange}
                placeholder="e.g., My Razorpay Account"
              />
            </Form.Group>

            <hr />

            {/* Razorpay */}
            {formData.gatewayType === 'RAZORPAY' && (
              <>
                <h6 className="fw-bold mb-3">Razorpay Configuration</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Key ID <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="razorpayKeyId"
                    value={formData.razorpayKeyId}
                    onChange={handleFormChange}
                    placeholder="Enter key ID"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Key Secret <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="razorpayKeySecret"
                    value={formData.razorpayKeySecret}
                    onChange={handleFormChange}
                    placeholder="Enter key secret"
                  />
                </Form.Group>
                {isConfigureMode && (
                  <Button
                    variant="outline-primary"
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="mb-3"
                  >
                    {testing ? <Spinner animation="border" size="sm" /> : '🔗 Test Connection'}
                  </Button>
                )}
              </>
            )}

            {/* UPI */}
            {formData.gatewayType === 'UPI' && (
              <>
                <h6 className="fw-bold mb-3">UPI Configuration</h6>
                <Form.Group className="mb-3">
                  <Form.Label>UPI ID <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleFormChange}
                    placeholder="e.g., example@paytm"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>UPI Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="upiName"
                    value={formData.upiName}
                    onChange={handleFormChange}
                    placeholder="e.g., My Business"
                  />
                </Form.Group>
              </>
            )}

            {/* Stripe */}
            {formData.gatewayType === 'STRIPE' && (
              <div className="text-center py-4 text-muted">
                <FaUniversity size={40} className="mb-2" />
                <p>Stripe integration coming soon!</p>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {formData.gatewayType !== 'STRIPE' && (
            <Button 
              variant="success" 
              onClick={handleSaveGateway}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : (isConfigureMode ? 'Save Configuration' : 'Add Gateway')}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showToggleModal} onHide={() => setShowToggleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{toggleAction === 'connect' ? 'Connect' : 'Disconnect'} Gateway</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to <strong>{toggleAction}</strong> this gateway?</p>
          {toggleAction === 'disconnect' && (
            <p className="text-muted small">This will deactivate the gateway. You can reconnect anytime.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowToggleModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={toggleAction === 'connect' ? 'success' : 'danger'} 
            onClick={confirmToggle}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : `Yes, ${toggleAction}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentGateway;