import { Card } from "react-bootstrap";
import StatusPill from "./StatusPill";

const BookingCard = ({ booking }) => {
  return (
    <Card className="booking-card">
      <Card.Body>

        <div className="booking-id">
          {booking.id}
        </div>

        <h6>{booking.customer}</h6>

        <div className="booking-meta">
          {booking.eventType} · {booking.date}
        </div>

        <div className="booking-amount">
          {booking.amount}
        </div>

        <div className="booking-footer">

         <StatusPill {...booking.status1} />
         <StatusPill {...booking.status2} />

        </div>

      </Card.Body>
    </Card>
  );
};

export default BookingCard;