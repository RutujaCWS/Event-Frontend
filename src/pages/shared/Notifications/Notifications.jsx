import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './notification.css';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../../../services/notificationService';

// ========== nutan changes -26-06-2026 ==========
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
      setNotifications(res.data);
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
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'staff') {
      navigate('/staff/dashboard');
    } else {
      navigate('/customer/dashboard');
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

  const getTypeColor = (type) => {
    const colors = {
      ENQUIRY: 'bg-blue-100 text-blue-700',
      QUOTATION_SENT: 'bg-purple-100 text-purple-700',
      QUOTATION_APPROVED: 'bg-green-100 text-green-700',
      QUOTATION_REJECTED: 'bg-red-100 text-red-700',
      BOOKING_CONFIRMED: 'bg-emerald-100 text-emerald-700',
      BOOKING_CANCELLED: 'bg-rose-100 text-rose-700',
      PAYMENT_RECEIVED: 'bg-teal-100 text-teal-700',
      LEAD_ASSIGNED: 'bg-orange-100 text-orange-700',
      SYSTEM_ALERT: 'bg-gray-100 text-gray-700',
      ENQUIRY_STATUS_UPDATED: 'bg-cyan-100 text-cyan-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
          >
            <CheckCheck size={18} />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50 rounded-lg">
          <Bell size={64} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">No notifications</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border transition ${
                !notification.isRead
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                  {getTypeLabel(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{formatTime(notification.createdAt)}</span>
                    {notification.triggeredBy?.name && (
                      <span>• By {notification.triggeredBy.name}</span>
                    )}
                    {!notification.isRead && (
                      <span className="text-blue-600 font-medium">• New</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
