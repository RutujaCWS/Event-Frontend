import React, { useState } from "react";
import { Row, Col, Card, Form, Button,} from "react-bootstrap";
import { FaWhatsapp, FaRegSave,} from "react-icons/fa";
import { HiMiniDevicePhoneMobile } from "react-icons/hi2";
import { HiOutlineRefresh } from "react-icons/hi";
import { LiaSmsSolid } from "react-icons/lia";
import { PiSlidersBold } from "react-icons/pi";
import { TbTestPipe } from "react-icons/tb";
import "./WhatsAppSMS.css";

const WhatsAppSMS = () => {
  const [channels, setChannels] = useState({
    booking: true,
    reminder: true,
    otp: true,
    marketing: false,
    email: true,
  });

  const handleToggle = (key) => {
    setChannels({
      ...channels,
      [key]: !channels[key],
    });
  };

  return (
    <div className="whatsapp-sms-wrapper mt-2"> 
      <div className="whatsapp-page">

      <Card className="header-card mb-4" >
          <Card.Body style={{ padding: '17px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h5 style={{ 
                  fontWeight: '700', 
                  fontSize: '20px',
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  WhatsApp / SMS Setup
                </h5>
                <small style={{ 
                  color: '#6B7280', 
                  fontSize: '13px'
                }}>
                  Connect WhatsApp Business API and SMS gateway for automated communications
                </small>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <Button
                  variant="outline-secondary"
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
                  style={{
                    backgroundColor: '#0D9488',
                    border: 'none',
                    fontSize: '13px',
                    padding: '6px 20px',
                    borderRadius: '6px',
                    color: '#FFFFFF'
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Row className="g-4">
          <Col lg={6}>
            <Card className="setup-card">
              <Card.Body>
                <div className="card-title">
                  <FaWhatsapp className="text-success me-2"/>
                  <div>
                    <h5>WhatsApp Business API</h5>
                    <small style={{fontSize:"12px"}}>Connect Meta Official WABA for automated messaging.</small>
                  </div>
                </div>
                <hr/>
                <Form.Group className="mb-3">
                  <Form.Label >Provider</Form.Label>
                  <Form.Select>
                    <option>Meta (Official WABA)</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ marginBottom: '3px' }}>Phone Number ID</Form.Label>
                  <Form.Control value="109789056712345" readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ marginBottom: '3px' }}>Access Token</Form.Label>
                  <Form.Control value="EAAxxxxxxxxxxxxxxxxxxxx" readOnly />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label style={{ marginBottom: '3px' }}>Webhook Verify Token</Form.Label>
                  <Form.Control value="eventpro_wh_verify_2026" readOnly />
                </Form.Group>
                <Button className="test-btn me-2" style={{ height: '45px' }}><TbTestPipe className="me-2"/>Test Connection</Button>
                <Button variant="outline-secondary" style={{ height: '45px' }}><FaRegSave className="me-2"/>Save</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="setup-card">
              <Card.Body>
                <div className="card-title">
                  <PiSlidersBold className="text-success me-2"/>
                  <div>
                    <h5>Channel Preferences</h5>
                    <small style={{fontSize:"12px"}}>Choose which events trigger automated messages.</small>
                  </div>
                </div>
                <hr/>
                <div className="channel-item">
                  <div>
                    <strong>WA — booking confirmations</strong>
                    <p>Auto-send on booking creation</p>
                  </div>
                  <Form.Check type="switch" checked={channels.booking} onChange={() => handleToggle("booking")} />
                </div>
                <div className="channel-item">
                  <div>
                    <strong>WA — payment reminders</strong>
                    <p>3 days before balance due date</p>
                  </div>
                  <Form.Check type="switch" checked={channels.reminder} onChange={() => handleToggle("reminder")} />
                </div>
                <div className="channel-item">
                  <div>
                    <strong>SMS — OTP verification</strong>
                    <p>Login and payment OTPs</p>
                  </div>
                  <Form.Check type="switch" checked={channels.otp} onChange={() => handleToggle("otp")} />
                </div>
                <div className="channel-item">
                  <div>
                    <strong>SMS — marketing messages</strong>
                    <p>Promotional campaigns</p>
                  </div>
                  <Form.Check type="switch" checked={channels.marketing} onChange={() => handleToggle("marketing")} />
                </div>
                <div className="channel-item border-0">
                  <div>
                    <strong>Email — all notifications (backup)</strong>
                    <p>Parallel to WA/SMS delivery</p>
                  </div>
                  <Form.Check type="switch" checked={channels.email} onChange={() => handleToggle("email")} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mt-1">
          <Col lg={6}>
            <Card className="setup-card">
              <Card.Body>
                <div className="card-title">
                  <LiaSmsSolid className="text-success me-2"/>
                  <div>
                    <h5>SMS Gateway</h5>
                    <small>Configure DLT-registered SMS sender details.</small>
                  </div>
                </div>
                <hr/>
                <Form.Group className="mb-3">
                  <Form.Label>Provider</Form.Label>
                  <Form.Select>
                    <option>Textlocal</option>
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ marginBottom: '3px' }}>Sender ID</Form.Label>
                      <Form.Control value="EVTPRO" readOnly />
                      <small className="text-muted" style={{fontSize:"11px"}}>6 char DLT registered ID</small>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ marginBottom: '3px' }}>DLT Entity ID</Form.Label>
                      <Form.Control value="1301234567890" readOnly />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="credit-box">
                  <small className="text-muted">SMS credits balance</small>
                  <h2 className="credit-count">2,480 credits</h2>
                  <div className="progress mt-3">
                    <div className="progress-bar bg-success" style={{ width: "80%" }}></div>
                  </div>
                  <small className="text-muted">&lt;620 messages before top-up</small>
                </div>
                <Button variant="outline-success" className="w-100 mt-4">+ Top Up Credits</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="setup-card">
              <Card.Body>
                <div className="card-title">
                  <HiMiniDevicePhoneMobile className="text-success me-2"/>
                  <div>
                    <h5>WhatsApp Preview</h5>
                    <small>How messages appear to customers on WhatsApp.</small>
                  </div>
                </div>
                <hr/>
                <div className="preview-box">
                  <div className="preview-header">
                    <div className="preview-logo">V</div>
                    <div>
                      <strong>Vevora Management</strong>
                      <small className="d-block">Business Account</small>
                    </div>
                  </div>
                  <div className="preview-message">
                    Hi Anjali Sharma, your booking <strong> #BK-2026-427 </strong> for Wedding on <strong> Jul 12, 2026 </strong> is confirmed.
                    <br /><br />
                    Total ₹2,85,856. — Team Vevora.
                  </div>
                  <div className="preview-time">12:34 PM</div>
                </div>
                <div className="d-flex mt-4">
                  <Button className="flex-fill me-2 save-btn">Send Test</Button>
                  <Button variant="outline-secondary" className="flex-fill"><HiOutlineRefresh className="me-2"/>Refresh</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default WhatsAppSMS;


