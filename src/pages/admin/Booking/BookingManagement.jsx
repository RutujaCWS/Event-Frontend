import { Container } from "react-bootstrap";

import StatsCards from "./StatsCards";
import ActiveBookings from "./ActiveBookings";
import BookingsTable from "./BookingsTable";
import "../Styles/bookingManagement.css";

import {
  stats,
  activeBookings,
  bookings,
} from "../../../services/bookingData";

const BookingManagement = () => {
    console.log("bookings",bookings)
  return (
  <div className="booking-page p-3 p-md-4">

      <StatsCards stats={stats} />

      <div className="mt-3">
        <ActiveBookings
          bookings={activeBookings}
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