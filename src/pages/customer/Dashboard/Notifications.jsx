import React, { useState, useEffect } from 'react';
import { Card } from "react-bootstrap";
import { 
  FiBell, FiMail, FiCheckCircle, FiXCircle, 
  FiCalendar, FiUser, FiAlertCircle 
} from "react-icons/fi";
import { getNotifications, markAllAsRead } from '../../../services/notificationService';
import "../Styles/customerDashboard.css";

// ========== nutan changes -26-06-2026 ==========

const getIconForType = (type) => {
  const icons = {
    ENQUIRY: FiMail,
    QUOTATION_SENT: FiCheckCircle,
    QUOTATION_APPROVED: FiCheckCircle,
    QUOTATION_REJECTED: FiXCircle,
    BOOKING_CONFIRMED: FiCalendar,
    BOOKING_CANCELLED: FiXCircle,
    PAYMENT_RECEIVED: FiCheckCircle,
    LEAD_ASSIGNED: FiUser,
    SYSTEM_ALERT: FiAlertCircle,
    ENQUIRY_STATUS_UPDATED: FiBell,
  };
  return icons[type] || FiBell;
};

// FAINT/PASTEL colors for square icon box
const getFaintColorHex = (type) => {
  const colors = {
    ENQUIRY: '#bfdbfe',          // light blue
    QUOTATION_SENT: '#ddd6fe',   // light purple
    QUOTATION_APPROVED: '#bbf7d0', // light green
    QUOTATION_REJECTED: '#fecaca', // light red
    BOOKING_CONFIRMED: '#a7f3d0',  // light emerald
    BOOKING_CANCELLED: '#fecdd3',  // light rose
    PAYMENT_RECEIVED: '#99f6e4',   // light teal
    LEAD_ASSIGNED: '#fed7aa',      // light orange
    SYSTEM_ALERT: '#e5e7eb',       // light gray
    ENQUIRY_STATUS_UPDATED: '#a5f3fc', // light cyan
  };
  return colors[type] || '#e5e7eb';
};

const getTypeLabel = (type) => {
  const labels = {
    ENQUIRY: 'New Enquiry',
    QUOTATION_SENT: 'Quotation Sent',
    QUOTATION_APPROVED: 'Quotation Approved',
    QUOTATION_REJECTED: 'Quotation Rejected',
    BOOKING_CONFIRMED: 'Booking Confirmed',
    BOOKING_CANCELLED: 'Booking Cancelled',
    PAYMENT_RECEIVED: 'Payment Received',
    LEAD_ASSIGNED: 'Lead Assigned',
    SYSTEM_ALERT: 'System Alert',
    ENQUIRY_STATUS_UPDATED: 'Status Updated',
  };
  return labels[type] || 'Notification';
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications(1, 5);
      setNotifications(res.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const DOT_COLOR = '#14B8A6'; // dark teal

  if (loading) {
    return (
      <Card className="dashboard-section-card">
        <Card.Body>
          <div className="dash-section-header">
            <div className="dash-section-title">
              <FiBell size={22} />
              <span>Notifications</span>
            </div>
            <button className="view-all-btn">Mark all read</button>
          </div>
          <div className="text-center py-4 text-gray-400">Loading...</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="dashboard-section-card">
      <Card.Body>
        <div className="dash-section-header">
          <div className="dash-section-title">
            <FiBell size={22} />
            <span>Notifications</span>
          </div>
          <button onClick={handleMarkAllAsRead} className="view-all-btn">
            Mark all read
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-4 text-gray-400">No notifications yet</div>
        ) : (
          notifications.map((item) => {
            const Icon = getIconForType(item.type);
            const bgColor = getFaintColorHex(item.type);

            return (
              <div key={item._id} className="notification-row">
                <div className="notification-left">
                  {/* Square icon box with faint/pastel background */}
                  <div 
                    className="notification-icon-box" 
                    style={{ backgroundColor: bgColor }}
                  >
                    <Icon size={15} color="#4a5568" />  {/* dark grey icon for contrast */}
                  </div>

                  <div className="notification-content">
                    <h6>{getTypeLabel(item.type)}</h6>
                    <p>{item.message}</p>
                    <small>{formatTime(item.createdAt)}</small>
                  </div>
                </div>

                {/* Dot with dark teal color */}
                <span 
                  className="notification-dot" 
                  style={{ backgroundColor: DOT_COLOR }}
                />
              </div>
            );
          })
        )}
      </Card.Body>
    </Card>
  );
};

export default Notifications;