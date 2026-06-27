import {
  TbCalendarEvent,
  TbFileInvoice,
  TbCreditCard,
  TbBell,
  TbCheck,
  TbClock,
  TbMessage
} from "react-icons/tb";

export const dashboardStats = [
  {
    icon: TbCalendarEvent,
    value: "03",
    title: "UPCOMING EVENTS",
    footer: "Next 30 days",
    bgColor: "#DDF5F0",
    iconColor: "#0F766E",
    footerClass: "dashboard-footer-text",
  },
  {
    icon: TbFileInvoice,
    value: "02",
    title: "ACTIVE ENQUIRIES",
    footer: "1 awaiting quote",
    bgColor: "#E8F0FE",
    iconColor: "#2563EB",
    footerClass: "dashboard-footer-primary",
  },
  {
    icon: TbCreditCard,
    value: "₹1.6L",
    title: "PENDING PAYMENTS",
    footer: "2 due soon",
    bgColor: "#FEF3D7",
    iconColor: "#D97706",
    footerClass: "dashboard-footer-danger",
  },
  {
    icon: TbBell,
    value: "04",
    title: "NOTIFICATIONS",
    footer: "3 unread",
    bgColor: "#FDE8E8",
    iconColor: "#EF4444",
    footerClass: "dashboard-footer-text",
  },
];


export const upcomingEvents = [
  {
    day: "18",
    month: "JUN",
    title: "Sharma Wedding",
    venue: "Grand Ballroom",
    guests: "350 guests",
    status: {
      text: "Confirmed",
      color: "success-pill",
    },
  },
  {
    day: "25",
    month: "JUN",
    title: "Anniversary Dinner",
    venue: "Rooftop Terrace",
    guests: "60 guests",
    status: {
      text: "Setup",
      color: "purple-pill",
    },
  },
  {
    day: "02",
    month: "JUL",
    title: "Engagement Ceremony",
    venue: "Garden Venue",
    guests: "120 guests",
    status: {
      text: "Scheduled",
      color: "teal-pill",
    },
  },
];

export const enquiryStatus = [
  {
    icon: TbCheck,
    iconBg: "#DDF5F0",
    iconColor: "#12B76A",
    enquiryId: "#ENQ-2041",
    title: "Sharma Wedding Catering",
    updated: "Updated 2 hours ago",
    status: {
      text: "Quoted",
      color: "success-pill",
    },
  },
  {
    icon: TbClock,
    iconBg: "#FFF3DB",
    iconColor: "#F59E0B",
    enquiryId: "#ENQ-2038",
    title: "Corporate Offsite Decor",
    updated: "Updated yesterday",
    status: {
      text: "In Review",
      color: "orange-pill",
    },
  },
  {
    icon: TbMessage,
    iconBg: "#EEF2FF",
    iconColor: "#4F46E5",
    enquiryId: "#ENQ-2035",
    title: "Anniversary Dinner Setup",
    updated: "Updated 3 days ago",
    status: {
      text: "New",
      color: "purple-pill",
    },
  },
];

export const pendingPayments = [
  {
    bookingId: "#BK-8821",
    event: "Sharma Wedding",
    dueDate: "Jun 15, 2026",
    amount: "₹1,24,500",
    status: {
      text: "Due Soon",
      color: "danger-pill",
    },
  },
  {
    bookingId: "#BK-8829",
    event: "Anniversary Dinner",
    dueDate: "Jun 22, 2026",
    amount: "₹38,000",
    status: {
      text: "Pending",
      color: "orange-pill",
    },
  },
  {
    bookingId: "#BK-8834",
    event: "Engagement Ceremony",
    dueDate: "Jul 01, 2026",
    amount: "₹0",
    status: {
      text: "Paid",
      color: "success-pill",
    },
  },
];