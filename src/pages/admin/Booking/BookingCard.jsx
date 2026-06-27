import { Card } from "react-bootstrap";
import StatusPill from "./StatusPill";

const BookingCard = ({ booking }) => {
  return (
    <Card className="booking-card">
      <Card.Body>

        <div className="booking-id">
        #{booking.bookingId}
        </div>

        
        <h6>
  {booking.customerId?.fullName ||
   booking.customerId?.name ||
   "Guest User"}

        </h6>

        <div className="booking-meta">
        {booking.eventType} · {new Date(booking.eventDate).toLocaleDateString()}
        </div>

        <div className="booking-amount">
        ₹{booking.totalAmount}
        </div>

        <div className="booking-footer">

        <StatusPill
  text={booking.status}
  color="success-pill"
/>

        </div>

      </Card.Body>
    </Card>
  );
};

export default BookingCard;