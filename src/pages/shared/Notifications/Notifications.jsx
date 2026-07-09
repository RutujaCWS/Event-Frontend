import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiBell, 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiCalendar, 
  FiUser, 
  FiAlertCircle,
  FiArrowLeft,
  FiCheck,
  FiCheckCircle as FiCheckAll
} from 'react-icons/fi';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../../../services/notificationService';
import './notification.css';

// ========== nutan changes -26-06-2026 ==========

// ✅ Icon mapping for the box (same as customer dashboard)
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

// ✅ Color mapping for the box (same as customer dashboard)
const getColorForType = (type) => {
  const colors = {
    ENQUIRY: 'blue',
    QUOTATION_SENT: 'purple',
    QUOTATION_APPROVED: 'green',
    QUOTATION_REJECTED: 'red',
    BOOKING_CONFIRMED: 'emerald',
    BOOKING_CANCELLED: 'rose',
    PAYMENT_RECEIVED: 'teal',
    LEAD_ASSIGNED: 'orange',
    SYSTEM_ALERT: 'gray',
    ENQUIRY_STATUS_UPDATED: 'cyan',
  };
  return colors[type] || 'gray';
};

// ✅ Label mapping (shorter for the meta, can keep full for message)
const getTypeLabel = (type) => {
  const labels = {
    ENQUIRY: 'Enquiry',
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
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications(page, 20);
      const seen = new Set();
      const unique = res.data.filter((n) => {
        const key = `${n.message}|${n.type}|${n.enquiryRef?._id || n.enquiryRef || ''}|${n.quotationRef?._id || n.quotationRef || ''}|${n.bookingRef?._id || n.bookingRef || ''}|${n.paymentRef?._id || n.paymentRef || ''}|${n.staffRef?._id || n.staffRef || ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setNotifications(unique);
      setTotalPages(res.pagination?.pages || 1);
      setUnreadCount(res.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
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

  const goBack = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?.role === 'admin') navigate('/admin/dashboard');
    else if (user?.role === 'staff') navigate('/staff/dashboard');
    else navigate('/customer/dashboard');
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

  if (loading && page === 1) {
    return (
      <div className="notif-page-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="notif-page">
      {/* Header – unchanged */}
      <div className="notif-page-header">
        <div className="notif-page-header-left">
          <button onClick={goBack} className="notif-page-back" aria-label="Go back">
            <FiArrowLeft size={22} />
          </button>
          <h1 className="notif-page-title">Notifications</h1>
          {unreadCount > 0 && (
            <span className="notif-page-badge">{unreadCount} new</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="notif-page-mark-all">
            <FiCheckAll size={18} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list – now with icon boxes, like the dashboard widget */}
      {notifications.length === 0 ? (
        <div className="notif-empty">
          <FiBell size={48} />
          <p>No notifications</p>
          <span>You're all caught up!</span>
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map((notification) => {
            const Icon = getIconForType(notification.type);
            const color = getColorForType(notification.type);
            const isUnread = !notification.isRead;

            return (
              <div
                key={notification._id}
                className={`notification-row ${isUnread ? 'bg-blue-50/50' : ''}`}
                style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}
              >
                <div className="notification-left">
                  {/* ✅ Icon Box – same as dashboard widget */}
                  <div className={`notification-icon-box ${color}`}>
                    <Icon size={15} />
                  </div>

                  <div className="notification-content">
                    <h6 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                      {notification.message}
                    </h6>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0' }}>
                      {getTypeLabel(notification.type)}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: '#94a3b8' }}>
                      <span>{formatTime(notification.createdAt)}</span>
                      {notification.triggeredBy?.name && (
                        <span>• {notification.triggeredBy.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ Dot for unread + Mark as read button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="notif-item-mark-read"
                      title="Mark as read"
                    >
                      <FiCheck size={16} />
                    </button>
                  )}
                  <span className={`notification-dot ${isUnread ? '' : 'bg-transparent'}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination – unchanged */}
      {totalPages > 1 && (
        <div className="notif-pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
// ========== end nutan changes ==========