import React, { useState, useEffect } from "react";

import {
  Row,
  Col,
  Card,
  Button,
  Form,
} from "react-bootstrap";

import {
  SlidersHorizontal,
  Pencil,
  Send,
  MessageSquare,
  Smartphone,
  Mail,
} from "lucide-react";

import "./NotificationTemplates.css";
import {
  getNotificationSettings,
  updateNotificationSettings,
  updateNotificationTemplate,
  resetNotificationTemplates,
} from "../../../services/notificationTemplateService";

const NotificationTemplates = () => {
  const [notificationSettings, setNotificationSettings] = useState({
  globalSettings: {
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: true,
    senderEmail: "",
    replyToEmail: "",
  },
  templates: {},
});

const [tempValues, setTempValues] = useState({});
const [editing, setEditing] = useState({});
 // const [editing, setEditing] = useState({});

  const [emailSendVia, setEmailSentVia] = useState(false);
  const [smsSendVia, setSmsSendVia] = useState(false);
  const [whatsappSendVia, setWhatsappSendVia] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
{/*
  const data = {
  venue: "Wedding court yard",
  payment_reminder: "Full decor + entertainment",
  quotation_email: "vevora@gmail.com",
  variable_value: "vevora@gmail.co",
  };
 */}
  useEffect(() => {
    fetchNotificationSettings();
}, []);

const fetchNotificationSettings = async () => {
    try {

        const res = await getNotificationSettings();

        const settings = res.data;

        setNotificationSettings(settings);

        setTempValues({
            bookingConfirmation:
                settings.templates.bookingConfirmation.content,

            paymentReminder:
                settings.templates.paymentReminder.content,

            quotationSent:
                settings.templates.quotationSent.content,

            insertVariables:
                settings.templates.insertVariables.content,
        });

        setEditing({
            bookingConfirmation: false,
            paymentReminder: false,
            quotationSent: false,
            insertVariables: false,
        });

    } catch (err) {
        console.log(err);
    }
};
const handleGlobalChange = (name, value) => {

    setNotificationSettings(prev => ({
        ...prev,
        globalSettings: {
            ...prev.globalSettings,
            [name]: value
        }
    }));

};
const handleSaveSettings = async () => {

    try {

        await updateNotificationSettings(
            notificationSettings.globalSettings
        );

        alert("Settings Updated");

    } catch (err) {
        console.log(err);
    }

};

  const handleEdit = (key) => {
  setEditing((prev) => ({
    ...prev,
    [key]: true,
  }));
  };

const handleSave = async (key) => {
  try {
    const template = notificationSettings.templates[key];

    await updateNotificationTemplate(key, {
      title: template.title,
      channels: template.channels,
      content: tempValues[key],
    });

    setNotificationSettings((prev) => ({
      ...prev,
      templates: {
        ...prev.templates,
        [key]: {
          ...prev.templates[key],
          content: tempValues[key],
        },
      },
    }));

    setEditing((prev) => ({
      ...prev,
      [key]: false,
    }));

    // Show success message
    alert("Template saved successfully.");

  } catch (err) {
    console.log(err);
    alert("Failed to save template.");
  }
};
const handleReset = async () => {

    await resetNotificationTemplates();

    fetchNotificationSettings();

};
  const TemplateCard = ({
  cardKey,
  title,
  channels,
  badgeClasses,
}) => {
    return (
      <Card className="global-card mb-4">
  
    <Card.Body>
      <div>

        <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6>{title}</h6>
{editing[cardKey] ? (
  <div className="mb-2">
    {["EMAIL", "SMS", "WHATSAPP"].map((channel) => (
      <Form.Check
        inline
        key={channel}
        label={channel}
        type="checkbox"
        checked={
          notificationSettings.templates[cardKey]?.channels?.includes(channel)
        }
        onChange={(e) => {
          const checked = e.target.checked;

          setNotificationSettings((prev) => {
            const oldChannels =
              prev.templates[cardKey].channels || [];

            const updatedChannels = checked
              ? [...oldChannels, channel]
              : oldChannels.filter((c) => c !== channel);

            return {
              ...prev,
              templates: {
                ...prev.templates,
                [cardKey]: {
                  ...prev.templates[cardKey],
                  channels: updatedChannels,
                },
              },
            };
          });
        }}
      />
    ))}
  </div>
) : (
  channels.map((channel, index) => (
    <span
      key={channel}
      className={`${badgeClasses[index]} me-2`}
    >
      {channel}
    </span>
  ))
)}
            </div>

          <div className="ms-3 d-flex gap-3">
            <Pencil
              size={18}
              style={{ cursor: "pointer" ,color:"#6b7280"}}
              onClick={() => handleEdit(cardKey)}
            />

            <Send
              size={18}
              style={{
                color: "#6b7280",
                cursor: editing[cardKey]
                  ? "pointer"
                  : "not-allowed",
                opacity: editing[cardKey] ? 1 : 0.5,
              }}
              onClick={() =>
                editing[cardKey] &&
                handleSave(cardKey)
              }
              />
          </div>
      </div>
        <div>
            <Form.Control
            type="text"
           className="form-control"
            value={
            editing[cardKey]
            ? tempValues[cardKey]
            : notificationSettings.templates[cardKey]?.content || ""
            }
            readOnly={!editing[cardKey]}
            onChange={(e) =>
              setTempValues((prev) => ({
                ...prev,
                [cardKey]: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </Card.Body>
  </Card>
      );
  
    };

  return (
    <>
      <div className="main">
        <Card className="global-card">
          <Card.Body className="global-card-body">
            <div className="Payment-Gateway-flex">
            <div>
              <h5>Notification Templates</h5>
              <p>Connect payment providers, configure API keys, and set payment policies</p>
            </div>
            <div className="PaymentGateway_buttons">
             <Button
className="ResetDefault"
onClick={handleReset}
>
Reset Default
</Button>
              <Button
className="SaveChanges"
onClick={handleSaveSettings}
>
Save Changes
</Button>
            </div>
            </div>
          </Card.Body>
        </Card>
      </div>
      
      <div>
        <Card className="global-card">
          <Card.Body className="global-card-body">
            
            <div className="Global-Notification-header">
              <h6 className="mb-0 fw-semibold">
                <SlidersHorizontal className="Global-Notification-icon"/> Global Notification Settings
              </h6>
            </div>

            <Row className="Global-Notification-row2">

              {/* Email Notifications */}

              <Col md={4}>
                <Card className="setting-option-card">
                  <Card.Body className="Email-Notification-card">
                    <div>
                      <Mail className="setting-option-icon"/>
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ fontSize: "12px" }}>
                        Email Notifications
                      </div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>
                        Send booking emails
                      </div>
                    </div>

                    <Form.Check
                      type="switch"
                      checked={notificationSettings.globalSettings.emailNotifications}
                      onChange={(e)=>
                      handleGlobalChange(
                      "emailNotifications",
                      e.target.checked
                      )
                      }
                    />
                  </Card.Body>
                </Card>
              </Col>

              {/* SMS Notifications */}

              <Col md={4}>
                <Card className="setting-option-card">
                  <Card.Body className="SMS-Notification-card">
                    <div>
                      <Smartphone className="setting-option-icon"/>
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ fontSize: "12px" }}>
                        SMS Notifications
                      </div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>
                        Text alerts and SMS
                      </div>
                    </div>

                    <Form.Check
                      type="switch"
                      checked={
notificationSettings.globalSettings.smsNotifications
}

onChange={(e)=>
handleGlobalChange(
"smsNotifications",
e.target.checked
)
}
                    />
                  </Card.Body>
                </Card>
              </Col>

              {/* WhatsApp Alerts */}

              <Col md={4}>
                <Card className="setting-option-card">
                  <Card.Body className="WhatsApp-Notification-card">
                    <div>
                      <MessageSquare className="setting-option-icon"/>
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ fontSize: "12px" }}>
                        WhatsApp Alerts
                      </div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>
                        WhatsApp messages
                      </div>
                    </div>

                    <Form.Check
                      type="switch"
                      checked={
notificationSettings.globalSettings.whatsappNotifications
}

onChange={(e)=>
handleGlobalChange(
"whatsappNotifications",
e.target.checked
)
}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

              <Row className="Global-Notification-3rd-row">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="email-label">
                    SENDER EMAIL
                  </Form.Label>

                  <Form.Control
                    type="email"
                   value={
notificationSettings.globalSettings.senderEmail
}

onChange={(e)=>
handleGlobalChange(
"senderEmail",
e.target.value
)
}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="email-label">
                    EMAIL REPLY-TO
                  </Form.Label>

                  <Form.Control
                    type="email"
                    value={
notificationSettings.globalSettings.replyToEmail
}

onChange={(e)=>
handleGlobalChange(
"replyToEmail",
e.target.value
)
}
                  />
                </Form.Group>
              </Col>
            </Row>

          </Card.Body>
        </Card>
      </div>

      <div>
        <h5 className="mb-3">Booking Confirmation</h5>

        <TemplateCard
          cardKey="bookingConfirmation"
          title={
notificationSettings.templates.bookingConfirmation?.title
}
         channels={
  notificationSettings.templates.bookingConfirmation?.channels || []
}
          badgeClasses={[
            "channel-badge-whatsapp",
            "channel-badge-email",
            "channel-badge-sms"
          ]}
        />

        <h5 className="mb-3">Payment Reminder</h5>

        <TemplateCard
          cardKey="paymentReminder"
          title="Deposit Due Reminder"
          channels={
  notificationSettings.templates.paymentReminder?.channels || []
}
          badgeClasses={[
            "channel-badge-whatsapp",
            "channel-badge-email",
            "channel-badge-sms"
          ]}
        />

        <h5 className="mb-3">Quotation Sent</h5>

        <TemplateCard
          cardKey="quotationSent"
          title="New Quote Notification"
        channels={
  notificationSettings.templates.quotationSent?.channels || []
}
          badgeClasses={[
            "channel-badge-whatsapp",
            "channel-badge-email",
            "channel-badge-sms"
          ]}
        />

        <h5 className="mb-3">Insert Variables</h5>

        <TemplateCard
          cardKey="insertVariables"
          title="Insert Variables"
        channels={
  notificationSettings.templates.insertVariables?.channels || []
}
           badgeClasses={[
            "channel-badge-whatsapp",
            "channel-badge-email",
            "channel-badge-sms"
          ]}
        />
      </div>

      <div>
        <h5 className="mb-3">Insert Variables</h5>
        <Card className="global-card">
          <Card.Body className="global-card-body">
            <div>
              <h6>Send Via</h6>
            </div>
  <div className="Send-Via-Flex">
    {(notificationSettings.templates.insertVariables?.channels || []).map(
      (channel) => (
        <Button
          key={channel}
          className={`Send-Via-Buttons ${
            selectedChannel === channel ? "active-send-via" : ""
          }`}
          onClick={() => setSelectedChannel(channel)}
        >
          {channel}
        </Button>
      )
    )}
  </div>
            {selectedChannel && (
    <div className="Send-Via-Flex">
      <Button
        className="save-temp"
        onClick={() => handleSave("insertVariables")}
      >
        Save Template
      </Button>

      <Button
        className="Send"
        onClick={() => {
          console.log("Sending via:", selectedChannel);
          // Call your Send API here
        }}
      >
        Send {selectedChannel}
      </Button>
    </div>
  )}
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default NotificationTemplates