import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  TbUsers,
  TbAlertTriangle,
  TbUserCheck,
  TbTrendingUp,
  TbUserPlus,
} from "react-icons/tb";
import StatsCards from "./StatsCards";
import ActiveBookings from "./ActiveBookings";
import BookingsTable from "./BookingsTable";
import "../Styles/bookingManagement.css";

import { bookingData } from "../../../services/bookingData";


const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const response =
      await bookingData.getBookingStats();
  
    const data = response.data;
  
    setStats([
      {
        icon: TbUsers,
        value: data.totalBookings,
        title: "TOTAL BOOKINGS",
        footer: "+16 this month",
        bgColor: "#DDF5F0",
        iconColor: "#0F766E",
        footerClass: "metric-growth text-success",
      },
      {
        icon: TbAlertTriangle,
        value: data.pendingBookings,
        title: "PENDING",
        footer: "Needs action",
        bgColor: "#FEF3D7",
        iconColor: "#D97706",
        footerClass: "metric-alert",
      },
      {
        icon: TbUserCheck,
        value: data.confirmedBookings,
        title: "CONFIRMED",
        footer: "Confirmed bookings",
        bgColor: "#E7F4EE",
        iconColor: "#14B8A6",
        footerClass: "metric-growth text-success",
      },
      {
        icon: TbTrendingUp,
        value: `₹${data.revenue}`,
        title: "REVENUE",
        footer: "Total revenue",
        bgColor: "#FDE8E8",
        iconColor: "#EF4444",
        footerClass: "metric-growth text-success",
      },
      {
        icon: TbUserPlus,
        value: data.upcomingBookings,
        title: "UPCOMING",
        footer: "Upcoming events",
        bgColor: "#E8F0FE",
        iconColor: "#2563EB",
        footerClass: "metric-growth text-success",
      },
    ]);
  };

  const fetchBookings = async () => {
    try {
      const response =
        await bookingData.getAllBookings();

      setBookings(response.data);
    } catch (error) {
      console.log(error);
    }
  };

    console.log("bookings",bookings)
  return (
  <div className="booking-page p-3 p-md-4">

      <StatsCards stats={stats} />

      <div className="mt-3">
        <ActiveBookings
          bookings={bookings}
        />
      </div>

      <div className="mt-3">
        <BookingsTable
          data={bookings}
        />
      </div>

    </div>
  );
};

export default BookingManagement;