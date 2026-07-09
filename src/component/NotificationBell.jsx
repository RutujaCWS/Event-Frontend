import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { getUnreadCount, getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import './../pages/shared/Notifications/notification.css';
import { Link } from 'react-router-dom';

// ========== nutan changes -26-06-2026 ==========
const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // ========== nutan changes -26-06-2026 ==========
  // ✅ Content-based deduplication – removes duplicate notifications
  // ========== end nutan changes ==========
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications(1, 10);
      // Deduplicate based on actual content (message, type, references)
      const seen = new Set();
      const uniqueNotifications = res.data.filter((n) => {
        const key = `${n.message}|${n.type}|${
          n.enquiryRef?._id || n.enquiryRef || ''
        }|${n.quotationRef?._id || n.quotationRef || ''}|${
          n.bookingRef?._id || n.bookingRef || ''
        }|${n.paymentRef?._id || n.paymentRef || ''}|${
          n.staffRef?._id || n.staffRef || ''
        }`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setNotifications(uniqueNotifications);
      setUnreadCount(res.unreadCount);
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
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTypeColor = (type) => {
    const colors = {
      ENQUIRY: 'text-blue-500',
      QUOTATION_SENT: 'text-purple-500',
      QUOTATION_APPROVED: 'text-green-500',
      QUOTATION_REJECTED: 'text-red-500',
      BOOKING_CONFIRMED: 'text-green-600',
      BOOKING_CANCELLED: 'text-red-600',
      PAYMENT_RECEIVED: 'text-emerald-500',
      LEAD_ASSIGNED: 'text-orange-500',
      SYSTEM_ALERT: 'text-gray-500',
      ENQUIRY_STATUS_UPDATED: 'text-cyan-500',
    };
    return colors[type] || 'text-gray-400';
  };

  return (
    <div ref={containerRef} className="notification-bell-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={toggleDropdown}
        className="header-notification-btn"
        aria-label="Notifications"
        style={{
          background: 'transparent',
          border: 'none',
          position: 'relative',
          color: '#64748b',
          fontSize: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '50%',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="header-notification-dot" style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            border: '2px solid white',
          }} />
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="mark-all-read-btn">
                <CheckCheck size={16} /> Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="spinner"><div className="spinner-inner"></div></div>
            ) : notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={40} />
                <span>No notifications</span>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                >
                  <div className={`notification-icon ${getTypeColor(notification.type)}`}>
                    <Bell size={16} />
                  </div>
                  <div className="notification-content">
                    <p className={`notification-message ${!notification.isRead ? 'unread' : ''}`}>
                      {notification.message}
                    </p>
                    <p className="notification-time">{formatTime(notification.createdAt)}</p>
                  </div>
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="notification-action-btn"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="notification-footer">
            <Link to="/notifications" onClick={() => setIsOpen(false)}>
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
