import React, { useState, useEffect ,useRef} from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import {
  FaCamera,
  FaDownload,
  FaUser,
  FaLock,
  FaBell,
  FaCheck, FaSave, FaEye, FaShieldAlt
} from "react-icons/fa";
import { FiCamera, FiUser, FiHeart, FiLock,FiBell,} from "react-icons/fi";
import {
  getProfile,
  updateProfile,
  getProfileStats,
  getRecentEnquiries,
  changePassword ,
  uploadProfileImage,
} from "../../services/authService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const theme = {
  colors: {
    primary: "#0D9488",
    primaryLight: "#E0FAF7",
    secondary: "#14B8A6",
    tertiaryBg: "#F9FAFB",
    white: "#FFFFFF",

    primaryText: "#111827",
    bodyText: "#374151",
    secondaryText: "#6B7280",

    success: "#10B981",
    successLight: "#E6FFF7",

    warning: "#F59E0B",
    warningLight: "#FFF1D8",

    alert: "#EF4444",
    alertLight: "#FFE9E9",

    info: "#3B82F6",
    infoLight: "#E7F0FF",

    border: "#E2E8F0",
  },

  typography: {
    h1: {
      fontSize: "36px",
      fontWeight: "700",
      lineHeight: "44px",
    },

    h2: {
      fontSize: "28px",
      fontWeight: "600",
      lineHeight: "36px",
    },

    h3: {
      fontSize: "22px",
      fontWeight: "600",
      lineHeight: "30px",
    },

    body: {
      fontSize: "16px",
      fontWeight: "600",
      lineHeight: "24px",
    },

    bodySmall: {
      fontSize: "14px",
      fontWeight: "600",
      lineHeight: "22px",
    },

    caption: {
      fontSize: "12px",
      fontWeight: "500",
      lineHeight: "18px",
    },
  },
};

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const [profile, setProfile] = useState(null);
const [stats, setStats] = useState({});
const [recentEnquiries, setRecentEnquiries] = useState([]);
const [loading, setLoading] = useState(true);
const fileInputRef = useRef(null);
 const [preferences, setPreferences] = useState({
  eventTypes: [],
  catering: [],
  venue: [],
  guests: [],
});
const [passwords, setPasswords] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const [showPassword, setShowPassword] = useState({
  current: false,
  new: false,
  confirm: false,
});
const [securitySettings, setSecuritySettings] = useState({
  emailNotifications: true,
  smsNotifications: true,
  promotionalOffers: false,
  twoFactorAuth: true,
});

useEffect(() => {
  fetchProfileData();
}, []);

const fetchProfileData = async () => {
  try {
    const profileRes = await getProfile();
    setProfile(profileRes.data.user);
    setPreferences(
  profileRes.data.user.eventPreferences || {
    eventTypes: [],
    catering: [],
    venue: [],
    guests: [],
  }
);
   // console.log("Profile API Response:", profileRes.data.user);

    const statsRes = await getProfileStats();
    setStats(statsRes.data);

    const enquiriesRes = await getRecentEnquiries();
    setRecentEnquiries(enquiriesRes.data.enquiries);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const toggleSelection = (category, value) => {
  setPreferences((prev) => {
    const exists = prev[category].includes(value);

    return {
      ...prev,
      [category]: exists
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    };
  });
};

const pillStyle = (selected) => ({
  borderRadius: "999px",
  padding: "8px 18px",
  border: `1px solid ${
    selected ? theme.colors.primary : theme.colors.border
  }`,
  background: selected
    ? theme.colors.primaryLight
    : theme.colors.white,
  color: selected
    ? theme.colors.primary
    : theme.colors.bodyText,
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
});

const handleChange = (e) => {
  const { name, value } = e.target;
  
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    setProfile((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  } else {
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  }
};

const handlePasswordChange = (e) => {
  const { name, value } = e.target;

  setPasswords((prev) => ({
    ...prev,
    [name]: value,
  }));
};
const passwordStrength = () => {
  const password = passwords.newPassword;

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};
const handleUpdatePassword = async () => {
  if (passwords.newPassword !== passwords.confirmPassword) {
    return alert("Passwords do not match");
  }

  try {
    const res = await changePassword(passwords);

    alert(res.data.message);

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (err) {
    alert(
      err.response?.data?.message || "Failed to update password"
    );
  }
};

const strength = passwordStrength();

const togglePassword = (field) => {
  setShowPassword((prev) => ({
    ...prev,
    [field]: !prev[field],
  }));
};

const handleSaveProfile = async () => {
  try {
    const profileData = {
      name: profile?.name,
      email: profile?.email,
      mobile: profile?.mobile,
      gstin: profile?.gstin,
      address: profile?.address || {},
      profileImage: profile?.profileImage
    };
    
    await updateProfile(profileData);
    alert("Profile updated successfully");
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Failed to update profile");
  }
};

const handleSavePreferences = async () => {
  try {
    await updateProfile({
      ...profile,
      eventPreferences: preferences,
    });

    alert("Preferences updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update preferences");
  }
};
const handleProfileImage = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // Show preview immediately
  const previewUrl = URL.createObjectURL(file);

  setProfile((prev) => ({
    ...prev,
    profileImage: previewUrl,
  }));

  // Upload only if backend API exists
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const res = await uploadProfileImage(formData);

    if (res?.data?.profileImage) {
      setProfile((prev) => ({
        ...prev,
        profileImage: res.data.profileImage,
      }));
    }
  } catch (err) {
    console.log(err);
  }
};

const handleExportData = () => {
  try {
    const doc = new jsPDF();
    
    doc.setFontSize(24);
    doc.setTextColor(13, 148, 136);
    doc.text(`My Profile Data`, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 32);
    
    doc.setDrawColor(13, 148, 136);
    doc.setLineWidth(0.5);
    doc.line(14, 36, 200, 36);
    
    let startY = 44;
    
    doc.setFontSize(16);
    doc.setTextColor(13, 148, 136);
    doc.text(`Personal Information`, 14, startY);
    
    startY += 6;
    
    const personalData = [
      ["Name", profile?.name || ""],
      ["Email", profile?.email || ""],
      ["Mobile", profile?.mobile || ""],
      ["Role", profile?.role || "Customer"],
      ["GSTIN", profile?.gstin || "N/A"],
      ["Member Since", profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"],
      ["Verified", profile?.isEmailVerified && profile?.isMobileVerified ? "Yes" : "No"],
    ];
    
    autoTable(doc, {
      startY: startY,
      head: [["Field", "Value"]],
      body: personalData,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255] },
    });
    
    let finalY = doc.lastAutoTable.finalY + 10;
    
    if (profile?.address && (profile.address.street || profile.address.city || profile.address.state)) {
      doc.setFontSize(16);
      doc.setTextColor(13, 148, 136);
      doc.text(`Address Information`, 14, finalY);
      
      finalY += 6;
      
      const addressData = [
        ["Street", profile.address.street || "-"],
        ["City", profile.address.city || "-"],
        ["State", profile.address.state || "-"],
        ["Pincode", profile.address.pincode || "-"],
        ["Country", profile.address.country || "India"],
      ];
      
      autoTable(doc, {
        startY: finalY,
        head: [["Field", "Value"]],
        body: addressData,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255] },
      });
      
      finalY = doc.lastAutoTable.finalY + 10;
    }
    
    if (profile?.eventPreferences) {
      const hasPrefs = Object.values(profile.eventPreferences).some(arr => arr && arr.length > 0);
      
      if (hasPrefs) {
        doc.setFontSize(16);
        doc.setTextColor(13, 148, 136);
        doc.text(`Event Preferences`, 14, finalY);
        
        finalY += 6;
        
        const prefData = [
          ["Event Types", profile.eventPreferences.eventTypes?.join(", ") || "None"],
          ["Catering", profile.eventPreferences.catering?.join(", ") || "None"],
          ["Venue", profile.eventPreferences.venue?.join(", ") || "None"],
          ["Guest Count", profile.eventPreferences.guests?.join(", ") || "None"],
        ];
        
        autoTable(doc, {
          startY: finalY,
          head: [["Category", "Selection"]],
          body: prefData,
          theme: "grid",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255] },
        });
        
        finalY = doc.lastAutoTable.finalY + 10;
      }
    }
    
    if (stats.totalEnquiries > 0 || stats.convertedEvents > 0) {
      doc.setFontSize(16);
      doc.setTextColor(13, 148, 136);
      doc.text(`Account Statistics`, 14, finalY);
      
      finalY += 6;
      
      const statsData = [
        ["Total Enquiries", stats.totalEnquiries || 0],
        ["Converted Events", stats.convertedEvents || 0],
        ["Quotations Sent", stats.quotationsSent || 0],
        ["Pending Enquiries", stats.pendingEnquiries || 0],
      ];
      
      autoTable(doc, {
        startY: finalY,
        head: [["Metric", "Count"]],
        body: statsData,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255] },
      });
      
      finalY = doc.lastAutoTable.finalY + 10;
    }
    
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Generated from Vevora Profile • ${new Date().toLocaleString()}`, 14, finalY + 10);
    
    const fileName = profile?.name 
      ? `${profile.name.replace(/\s+/g, '_')}_Profile_${new Date().toISOString().slice(0,10)}.pdf`
      : `profile_data_${new Date().toISOString().slice(0,10)}.pdf`;
    
    doc.save(fileName);
    
  } catch (error) {
    console.error("PDF Export Error:", error);
    alert("Failed to export data. Please try again.");
  }
};


  const tabs = [
    {
      key: "personal",
      label: "Personal Details",
    },
    {
      key: "preferences",
      label: "Saved Event Preferences",
    },
    {
      key: "password",
      label: "Password Update",
    },
    {
      key: "security",
      label: "Notifications & Security",
    },
  ];
  if (loading) {
  return <div>Loading...</div>;
}


  return (
    <div
      className="container-fluid py-4"
      style={{
      fontFamily: "Manrope, sans-serif",
      background: theme.colors.tertiaryBg,
      minHeight: "100vh",
  }}
    >
      {/* Header */}
      <div className="mb-4">
        <h1
          className="mb-1"
          style={{
            ...theme.typography.h1,
            color: theme.colors.primaryText,
          }}
        >
          Profile Management
        </h1>
        <p
          style={{
            ...theme.typography.body,
            color: theme.colors.secondaryText,
          }}
        >
          Manage your personal details, event preferences and account security.
        </p>
      </div>

      {/* Profile Banner */}
      <Card
          className="mb-4"
          style={{
            borderRadius: "16px",
            background: theme.colors.primaryLight,
            border: "1px solid #E2E8F0",
          }}
        >
        <Card.Body className="p-4">
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleProfileImage}
          />
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  background: "#0D9488",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "28px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
               {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "12px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    profile?.name?.charAt(0)?.toUpperCase()
                  )}

                <button
                 onClick={() => fileInputRef.current.click()}
                  style={{
                    position: "absolute",
                    bottom: "-8px",
                    right: "-8px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "15%",
                    border: "none",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                 <FiCamera
                    size={12}
                    style={{
                      position: "relative",
                      top: "-12px",
                    }}
                  />
                </button>
              </div>

              <div>
                <h2
                  className="mb-1"
                  style={{
                    ...theme.typography.h2,
                    color: theme.colors.primaryText,
                  }}
                >
                  {profile?.name}
                </h2>

                <div
                style={{
                  ...theme.typography.bodySmall,
                  color: theme.colors.bodyText,
                }}
              >
                {profile?.email} • {profile?.mobile}
              </div>

                <div className="d-flex gap-2 flex-wrap mt-2">
                  <span
                    style={{
                      background: theme.colors.successLight,
                      color: theme.colors.success,
                      border: `1px solid ${theme.colors.success}`,
                      borderRadius: "999px",
                      padding: "4px 12px",
                      ...theme.typography.caption,
                    }}
                  >
                   {profile?.isEmailVerified &&
                    profile?.isMobileVerified
                      ? "• Verified"
                      : "Not Verified"}
                  </span>

                  <span
                    style={{
                      background: theme.colors. infoLight,
                      color: theme.colors.primary,
                      border: `1px solid ${theme.colors.primary}`,
                      borderRadius: "999px",
                      padding: "4px 12px",
                      ...theme.typography.caption,
                    }}
                  >
                  Member since{" "}
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </span>

                  <span
                    style={{
                      background: theme.colors.infoLight,
                      color: theme.colors.info,
                      border: `1px solid ${theme.colors.info}`,
                      borderRadius: "999px",
                      padding: "4px 12px",
                      ...theme.typography.caption,
                    }}
                  >
                    {stats.convertedEvents || 0} events booked
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="light"
              className="border d-flex align-items-center gap-2"
              onClick={handleExportData}
            >
              <FaDownload />
              Export My Data
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <div
        className="d-flex flex-wrap mb-4"
        style={{
          borderBottom: `1px solid ${theme.colors.border}`,
          gap: "24px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              border: "none",
              background: "transparent",
              padding: "14px 8px",
              ...theme.typography.bodySmall,
              color:
                activeTab === tab.key
                  ? theme.colors.primary
                  : theme.colors.secondaryText,
              borderBottom:
                activeTab === tab.key
                  ? `3px solid ${theme.colors.primary}`
                  : "3px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <Card

        style={{
          borderRadius: "16px",
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <Card.Body className="p-4">
          {/* Personal Details */}
          {activeTab === "personal" && (
            <>
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2">
                  <FiUser color="#0D9488" size={18} />

                  <h5
                    className="fw-bold mb-0"
                    style={{
                      color: theme.colors.primaryText,
                    }}
                  >
                    Personal Details
                  </h5>
                </div>

                <small
                  style={{
                    color: theme.colors.secondaryText,
                    marginLeft: "26px", // aligns below heading, after icon
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  Keep your contact information up to date.
                </small>
              </div>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      name="name"
                      value={profile?.name || ""}
                      onChange={handleChange}
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      name="name"
                      value={profile?.name || ""}
                      onChange={handleChange}
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                     name="mobile"
                      value={profile?.mobile || ""}
                      onChange={handleChange}
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      name="address.city" 
                      value={profile?.address?.city || ""}
                      onChange={handleChange}
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      name="address.state"
                      value={profile?.address?.state || ""}
                      onChange={handleChange}
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  </Form.Group>
                </Col>

                {/* Address */}
                <Col md={12}>
                  <Form.Group className="mb-4">
                    <Form.Label>Address</Form.Label>
                   <Form.Control
                      name="address.street"
                      value={profile?.address?.street || ""}
                      onChange={handleChange}
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  </Form.Group>
                </Col>

                {/* GSTIN */}
                <Col md={12}>
                  <Form.Group className="mb-2">
                    <Form.Label>GSTIN (optional)</Form.Label>

                   <Form.Control
                      name="gstin"
                      placeholder="Enter GSTIN for business invoices"
                      value={profile?.gstin || ""}
                      onChange={handleChange}
                      style={{
                        height: "48px",
                        borderRadius: "12px",
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  </Form.Group>

                  <small
                    style={{
                      color: theme.colors.secondaryText,
                      fontSize: "13px",
                    }}
                  >
                    Add your GSTIN if you'd like business invoices in your company's name.
                  </small>
                </Col>
              </Row>

              <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
                <Button
                  variant="light"
                  style={{
                    minWidth: "100px",
                    height: "44px",
                    borderRadius: "12px",
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.bodyText,
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>

              
                <Button
                  style={{
                    background: theme.colors.primary,
                    border: "none",
                    borderRadius: "12px",
                    minWidth: "170px",
                    height: "44px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                  onClick={handleSaveProfile}
                >
                  <FaSave size={14} />
                 Save Changes
                </Button>
              </div>             
            </>
          )}

          {/* Event Preferences */}
        {activeTab === "preferences" && (
            <>
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2">
                  <FiHeart color={theme.colors.primary} size={18} />

                  <h5
                    className="mb-0 fw-bold"
                    style={{
                      color: theme.colors.primaryText,
                    }}
                  >
                    Saved Event Preferences
                  </h5>
                </div>

                <small
                  style={{
                    marginLeft: "26px",
                    color: theme.colors.secondaryText,
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  We'll use these to personalise your enquiries.
                </small>
              </div>

              {/* Event Types */}
              <div className="mb-4 pb-4 border-bottom">
                <div
                  className="mb-3"
                  style={{
                    color: theme.colors.bodyText,
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  EVENT TYPES
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {[
                    "Wedding",
                    "Anniversary",
                    "Corporate",
                    "Birthday",
                    "Engagement",
                    "Religious",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      style={pillStyle(
                        preferences.eventTypes.includes(item)
                      )}
                      onClick={() =>
                        toggleSelection("eventTypes", item)
                      }
                    >
                      {preferences.eventTypes.includes(item) && (
                        <FaCheck size={10} />
                      )}
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catering */}
              <div className="mb-4 pb-4 border-bottom">
                <div
                  className="mb-3"
                  style={{
                    color: theme.colors.bodyText,
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  CATERING PREFERENCE
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {["Pure Veg", "Non-Veg", "Jain", "Vegan"].map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        style={pillStyle(
                          preferences.catering.includes(item)
                        )}
                        onClick={() =>
                          toggleSelection("catering", item)
                        }
                      >
                        {preferences.catering.includes(item) && (
                          <FaCheck size={10} />
                        )}
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Venue */}
              <div className="mb-4 pb-4 border-bottom">
                <div
                  className="mb-3"
                  style={{
                    color: theme.colors.bodyText,
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  PREFERRED VENUE STYLE
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {[
                    "Banquet Hall",
                    "Garden / Outdoor",
                    "Rooftop",
                    "Beachside",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      style={pillStyle(
                        preferences.venue.includes(item)
                      )}
                      onClick={() =>
                        toggleSelection("venue", item)
                      }
                    >
                      {preferences.venue.includes(item) && (
                        <FaCheck size={10} />
                      )}
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div className="mb-4">
                <div
                  className="mb-3"
                  style={{
                    color: theme.colors.bodyText,
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  TYPICAL GUEST COUNT
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {[
                    "Under 100",
                    "100 - 300",
                    "300 - 500",
                    "500+",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      style={pillStyle(
                        preferences.guests.includes(item)
                      )}
                      onClick={() =>
                        toggleSelection("guests", item)
                      }
                    >
                      {preferences.guests.includes(item) && (
                        <FaCheck size={10} />
                      )}
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <Button
                onClick={handleSavePreferences}
                  style={{
                    background: theme.colors.primary,
                    border: "none",
                    borderRadius: "12px",
                    minWidth: "170px",
                    height: "44px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                >
                  <FaSave size={14} />
                  Save Preferences
                </Button>
              </div>
            </>
          )}

          {/* Password Update */}
         {activeTab === "password" && (
            <>
              {/* Header */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2">
                  <FiLock color={theme.colors.primary} size={16} />

                  <h5
                    className="mb-0 fw-bold"
                    style={{
                      color: theme.colors.primaryText,
                    }}
                  >
                    Password Update
                  </h5>
                </div>

                <small
                  style={{
                    marginLeft: "24px",
                    color: theme.colors.secondaryText,
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  Choose a strong password to keep your account secure.
                </small>
              </div>

              {/* Current Password */}
              <Form.Group className="mb-4">
                <Form.Label>Current Password</Form.Label>

                <div className="position-relative">
                  <Form.Control
                   type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.colors.border}`,
                      paddingRight: "45px",
                    }}
                  />

                  <FaEye
                    size={14}
                    color="#6B7280"
                    onClick={() => togglePassword("current")}
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </Form.Group>

              {/* New Password */}
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>

                <div className="position-relative">
                  <Form.Control
                    type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.colors.border}`,
                      paddingRight: "45px",
                    }}
                  />

                  <FaEye
                    size={14}
                    color="#6B7280"
                    onClick={() => togglePassword("new")}
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </Form.Group>

              {/* Password Strength */}
              <div className="mb-3">
                <div className="d-flex gap-1 mb-2">
  {[1, 2, 3, 4].map((item) => (
    <div
      key={item}
      style={{
        flex: 1,
        height: "6px",
        borderRadius: "6px",
        background:
          strength >= item ? "#10B981" : "#E2E8F0",
      }}
    />
  ))}
</div>

                <div
  style={{
    color:
      strength >= 3
        ? "#10B981"
        : strength === 2
        ? "#F59E0B"
        : "#EF4444",
    fontWeight: 600,
    fontSize: "14px",
  }}
>
  {strength === 4
    ? "Strong Password"
    : strength === 3
    ? "Good Password"
    : strength === 2
    ? "Medium Password"
    : "Weak Password"}
</div>
              </div>

              {/* Password Rules */}
              {/* Password Rules */}
<Row className="mb-4">
  <Col md={6}>
    <div className="mb-2 d-flex align-items-center gap-2">
      <FaCheck
        size={11}
        color={
          passwords.newPassword.length >= 8
            ? "#10B981"
            : "#CBD5E1"
        }
      />
      <small>At least 8 characters</small>
    </div>

    <div className="d-flex align-items-center gap-2">
      <FaCheck
        size={11}
        color={
          /[0-9]/.test(passwords.newPassword)
            ? "#10B981"
            : "#CBD5E1"
        }
      />
      <small>One number</small>
    </div>
  </Col>

  <Col md={6}>
    <div className="mb-2 d-flex align-items-center gap-2">
      <FaCheck
        size={11}
        color={
          /[A-Z]/.test(passwords.newPassword)
            ? "#10B981"
            : "#CBD5E1"
        }
      />
      <small>One uppercase letter</small>
    </div>

    <div className="d-flex align-items-center gap-2">
      <FaCheck
        size={11}
        color={
          /[^A-Za-z0-9]/.test(passwords.newPassword)
            ? "#10B981"
            : "#CBD5E1"
        }
      />
      <small>One special character</small>
    </div>
  </Col>
</Row>

              {/* Confirm Password */}
              <Form.Group className="mb-4">
                <Form.Label>Confirm New Password</Form.Label>

                <div className="position-relative">
                  <Form.Control
                   type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    style={{
                      height: "48px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.colors.border}`,
                      paddingRight: "45px",
                    }}
                  />

                  <FaEye
                    size={14}
                    color="#6B7280"
                    onClick={() => togglePassword("confirm")}
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </Form.Group>

              {/* Button */}
              <div className="d-flex justify-content-end">
                <Button
                  style={{
                    background: theme.colors.primary,
                    border: "none",
                    borderRadius: "12px",
                    minWidth: "170px",
                    height: "44px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                   onClick={handleUpdatePassword}
                >
                   
                  <FaSave size={13} />
                  Update Password
                </Button>
              </div>
            </>
          )}

          {/* Security */}
         {activeTab === "security" && (
          <>
            {/* Header */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2">
                <FiBell color={theme.colors.primary} size={16} />

                <h5
                  className="mb-0 fw-bold"
                  style={{
                    color: theme.colors.primaryText,
                  }}
                >
                  Notifications & Security
                </h5>
              </div>
            </div>

            {/* Email Notifications */}
            <div
              className="d-flex justify-content-between align-items-center py-3"
              style={{
                borderBottom: `1px dashed ${theme.colors.border}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: theme.colors.bodyText,
                  }}
                >
                  Email Notifications
                </div>

                <small
                  style={{
                    color: theme.colors.secondaryText,
                  }}
                >
                  Quotations, payments & event updates
                </small>
              </div>

              <Form.Check
                type="switch"
                checked={securitySettings.emailNotifications}
                onChange={() =>
                  setSecuritySettings({
                    ...securitySettings,
                    emailNotifications:
                      !securitySettings.emailNotifications,
                  })
                }
              />
            </div>

            {/* SMS Alerts */}
            <div
              className="d-flex justify-content-between align-items-center py-3"
              style={{
                borderBottom: `1px dashed ${theme.colors.border}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: theme.colors.bodyText,
                  }}
                >
                  SMS / WhatsApp Alerts
                </div>

                <small
                  style={{
                    color: theme.colors.secondaryText,
                  }}
                >
                  Reminders for due payments & events
                </small>
              </div>

              <Form.Check
                type="switch"
                checked={securitySettings.smsNotifications}
                onChange={() =>
                  setSecuritySettings({
                    ...securitySettings,
                    smsNotifications:
                      !securitySettings.smsNotifications,
                  })
                }
              />
            </div>

            {/* Promotional Offers */}
            <div
              className="d-flex justify-content-between align-items-center py-3"
              style={{
                borderBottom: `1px dashed ${theme.colors.border}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: theme.colors.bodyText,
                  }}
                >
                  Promotional Offers
                </div>

                <small
                  style={{
                    color: theme.colors.secondaryText,
                  }}
                >
                  Seasonal packages & discounts
                </small>
              </div>

              <Form.Check
                type="switch"
                checked={securitySettings.promotionalOffers}
                onChange={() =>
                  setSecuritySettings({
                    ...securitySettings,
                    promotionalOffers:
                      !securitySettings.promotionalOffers,
                  })
                }
              />
            </div>

            {/* Two Factor Authentication */}
            <div className="d-flex justify-content-between align-items-center pt-4">
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: theme.colors.primaryLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaShieldAlt
                    color={theme.colors.success}
                    size={18}
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: theme.colors.bodyText,
                    }}
                  >
                    Two-Factor Authentication
                  </div>

                  <small
                    style={{
                      color: theme.colors.secondaryText,
                    }}
                  >
                    Add an extra layer of security at login
                  </small>
                </div>
              </div>

              <Form.Check
                type="switch"
                checked={securitySettings.twoFactorAuth}
                onChange={() =>
                  setSecuritySettings({
                    ...securitySettings,
                    twoFactorAuth:
                      !securitySettings.twoFactorAuth,
                  })
                }
              />
            </div>
          </>
        )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CustomerProfile;