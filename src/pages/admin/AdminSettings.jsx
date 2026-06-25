import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Form, Button, Alert,
  Spinner, Tabs, Tab, Badge
} from "react-bootstrap";
import { FaSave, FaBuilding, FaCreditCard, FaUsersCog, FaBell, FaGlobe } from "react-icons/fa";
import { FaPercent, FaTaxi } from "react-icons/fa";
import { updateTaxDiscountSettings } from "../../services/settingsService";
import API from "../../services/api";

const AdminSettings = () => {
  // ---------- State ----------
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("business");

  // ---------- Business Settings ----------
  const [business, setBusiness] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India"
    },
    gstNumber: "",
    panNumber: "",
    website: "",
    currency: "INR",
    timezone: "Asia/Kolkata",
  });

  // ---------- Payment Gateway ----------
  const [payment, setPayment] = useState({
    razorpayKeyId: "",
    razorpayKeySecret: "",
    paypalClientId: "",
    paypalSecret: "",
    defaultPaymentMode: "razorpay",
    enableTestMode: true,
  });

  // ---------- Staff Default Permissions (GLOBAL) ----------
  const [defaultPermissions, setDefaultPermissions] = useState({
    enquiries: true,
    events: true,
    tasks: true,
    schedule: true,
    statusUpdates: true,
    viewPayments: true,
    recordPayments: false,
  });

  // ---------- Notification Settings ----------
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    smsEnabled: true,
    whatsappEnabled: false,
    enquiryConfirmationTemplate: "Thank you for your enquiry...",
    bookingConfirmationTemplate: "Your booking is confirmed...",
    paymentReceiptTemplate: "Payment received...",
  });

  // Quotation setting
  const [taxDiscount, setTaxDiscount] = useState({
    cgstRate: 9,
    sgstRate: 9,
    defaultDiscountValue: 0,
  });

  const handleTaxDiscountChange = (e) => {
    const { name, value } = e.target;
    setTaxDiscount(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // ---------- Fetch Settings ----------
  // const fetchSettings = async () => {
  //   setLoading(true);
  //   try {
  //     // Dummy API – replace with real endpoints
  //     const res = await API.get("/admin/settings");
  //     const data = res.data;
  //     setBusiness(data.business || business);
  //     setPayment(data.payment || payment);
  //     setDefaultPermissions(data.defaultPermissions || defaultPermissions);
  //     setNotifications(data.notifications || notifications);
  //     setTaxDiscount(data.taxDiscount || taxDiscount);
  //   } catch (error) {
  //     console.error("Error fetching settings:", error);
  //     setMessage("Failed to load settings, using defaults.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ---------- Fetch Settings ----------
  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Fetch only tax & discount settings
      const response = await API.get("/admin/settings/tax-discount");
      if (response.data) {
        setTaxDiscount({
          cgstRate: response.data.cgstRate || 9,
          sgstRate: response.data.sgstRate || 9,
          defaultDiscountValue: response.data.defaultDiscountValue || 0
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setMessage("Failed to load settings, using defaults.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ---------- Save Settings ----------
  // const handleSave = async () => {
  //   setSaving(true);
  //   setMessage("");
  //   try {
  //     await API.put("/admin/settings", {
  //       business,
  //       payment,
  //       defaultPermissions,
  //       notifications,
  //       taxDiscount,
  //     });
  //     setMessage("✅ Settings saved successfully!");
  //   } catch (error) {
  //     setMessage("❌ Failed to save settings.");
  //     console.error(error);
  //   } finally {
  //     setSaving(false);
  //     setTimeout(() => setMessage(""), 3000);
  //   }
  // };

  // ---------- Save Settings ----------
  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await updateTaxDiscountSettings(taxDiscount);
      if (response.data.success) {
        setMessage("Tax & Discount settings saved successfully!");
        await fetchSettings();
      }
    } catch (error) {
      setMessage("Failed to save settings.");
      console.error(error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // ---------- Handle Changes ----------
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBusiness(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setBusiness(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayment(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handlePermissionsChange = (e) => {
    const { name, checked } = e.target;
    setDefaultPermissions(prev => ({ ...prev, [name]: checked }));
  };

  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: "#2c3e50" }}>
          <FaGlobe className="me-2" /> System Settings
        </h2>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : <FaSave className="me-2" />}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {message && (
        <Alert variant={message.includes("✅") ? "success" : "danger"} dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
            fill
          >
            <Tab eventKey="business" title={<><FaBuilding /> Business</>}>
              <h5 className="mt-3">Business Profile</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      value={business.companyName}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="companyEmail"
                      value={business.companyEmail}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyPhone"
                      value={business.companyPhone}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>GST Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="gstNumber"
                      value={business.gstNumber}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>PAN Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="panNumber"
                      value={business.panNumber}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="text"
                      name="website"
                      value={business.website}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <h6>Address</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      type="text"
                      name="address.street"
                      value={business.companyAddress.street}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="address.city"
                      value={business.companyAddress.city}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      name="address.state"
                      value={business.companyAddress.state}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      name="address.pincode"
                      value={business.companyAddress.pincode}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      name="address.country"
                      value={business.companyAddress.country}
                      onChange={handleBusinessChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="payment" title={<><FaCreditCard /> Payment</>}>
              <h5 className="mt-3">Payment Gateway Configuration</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Razorpay Key ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="razorpayKeyId"
                      value={payment.razorpayKeyId}
                      onChange={handlePaymentChange}
                      placeholder="rzp_live_..."
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Razorpay Key Secret</Form.Label>
                    <Form.Control
                      type="password"
                      name="razorpayKeySecret"
                      value={payment.razorpayKeySecret}
                      onChange={handlePaymentChange}
                      placeholder="••••••••"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>PayPal Client ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="paypalClientId"
                      value={payment.paypalClientId}
                      onChange={handlePaymentChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>PayPal Secret</Form.Label>
                    <Form.Control
                      type="password"
                      name="paypalSecret"
                      value={payment.paypalSecret}
                      onChange={handlePaymentChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Default Payment Mode</Form.Label>
                    <Form.Select
                      name="defaultPaymentMode"
                      value={payment.defaultPaymentMode}
                      onChange={handlePaymentChange}
                    >
                      <option value="razorpay">Razorpay</option>
                      <option value="paypal">PayPal</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Enable Test Mode (Sandbox)"
                      name="enableTestMode"
                      checked={payment.enableTestMode}
                      onChange={handlePaymentChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="permissions" title={<><FaUsersCog /> Staff Permissions</>}>
              <h5 className="mt-3">Default Staff Permissions (Global)</h5>
              <p className="text-muted">
                These permissions will be automatically applied to all newly created staff members.
                You can still override them individually in the Staff Management page.
              </p>
              <Card className="bg-light">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Check
                        type="checkbox"
                        label="Assigned Enquiries"
                        name="enquiries"
                        checked={defaultPermissions.enquiries}
                        onChange={handlePermissionsChange}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Assigned Events"
                        name="events"
                        checked={defaultPermissions.events}
                        onChange={handlePermissionsChange}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Tasks"
                        name="tasks"
                        checked={defaultPermissions.tasks}
                        onChange={handlePermissionsChange}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Event Schedule"
                        name="schedule"
                        checked={defaultPermissions.schedule}
                        onChange={handlePermissionsChange}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Check
                        type="checkbox"
                        label="Status Updates"
                        name="statusUpdates"
                        checked={defaultPermissions.statusUpdates}
                        onChange={handlePermissionsChange}
                      />
                      <Form.Check
                        type="checkbox"
                        label="View Payments (assigned)"
                        name="viewPayments"
                        checked={defaultPermissions.viewPayments}
                        onChange={handlePermissionsChange}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Record Payments"
                        name="recordPayments"
                        checked={defaultPermissions.recordPayments}
                        onChange={handlePermissionsChange}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <div className="mt-3">
                <Badge bg="info">Note</Badge>
                <span className="ms-2 text-muted">Changing these defaults will not affect existing staff members.</span>
              </div>
            </Tab>

            <Tab eventKey="notifications" title={<><FaBell /> Notifications</>}>
              <h5 className="mt-3">Notification Settings</h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Enable Email Notifications"
                      name="emailEnabled"
                      checked={notifications.emailEnabled}
                      onChange={handleNotificationChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Enable SMS Alerts"
                      name="smsEnabled"
                      checked={notifications.smsEnabled}
                      onChange={handleNotificationChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Enable WhatsApp Alerts"
                      name="whatsappEnabled"
                      checked={notifications.whatsappEnabled}
                      onChange={handleNotificationChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <h6>Email Templates</h6>
              <Form.Group className="mb-3">
                <Form.Label>Enquiry Confirmation</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="enquiryConfirmationTemplate"
                  value={notifications.enquiryConfirmationTemplate}
                  onChange={handleNotificationChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Booking Confirmation</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="bookingConfirmationTemplate"
                  value={notifications.bookingConfirmationTemplate}
                  onChange={handleNotificationChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Payment Receipt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="paymentReceiptTemplate"
                  value={notifications.paymentReceiptTemplate}
                  onChange={handleNotificationChange}
                />
              </Form.Group>
            </Tab>

            <Tab eventKey="taxdiscount" title={<><FaPercent /> Tax & Discount</>}>
              <h5 className="mt-3">Tax & Discount Settings</h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>CGST Rate (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="cgstRate"
                      value={taxDiscount.cgstRate}
                      onChange={handleTaxDiscountChange}
                      step="0.1"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>SGST Rate (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="sgstRate"
                      value={taxDiscount.sgstRate}
                      onChange={handleTaxDiscountChange}
                      step="0.1"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Default Discount (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="defaultDiscountValue"
                      value={taxDiscount.defaultDiscountValue}
                      onChange={handleTaxDiscountChange}
                      step="0.1"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminSettings;// UserManagement.jsx mein add karein

// import API from "../../services/api";

// const UserManagement = () => {
//   const [defaultPermissions, setDefaultPermissions] = useState(null);

//   // Fetch default permissions
//   useEffect(() => {
//     const fetchDefaultPermissions = async () => {
//       try {
//         const res = await API.get("/admin/settings/default-permissions");
//         setDefaultPermissions(res.data);
//       } catch (error) {
//         console.error("Failed to load default permissions", error);
//         // Fallback defaults
//         setDefaultPermissions({
//           enquiries: true,
//           events: true,
//           tasks: true,
//           schedule: true,
//           statusUpdates: true,
//           viewPayments: true,
//           recordPayments: false,
//           viewCustomerData: true,
//           createQuotations: false,
//           editQuotations: false,
//         });
//       }
//     };
//     fetchDefaultPermissions();
//   }, []);

//   // Jab modal open ho, default permissions set karein
//   const openCreateModal = () => {
//     setFormData({
//       // ... other fields
//       permissions: defaultPermissions, // Global defaults use karein
//       isActive: true,
//     });
//     setShowModal(true);
//   };
// };