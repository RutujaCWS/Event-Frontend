import { Card } from "react-bootstrap";
import { TbCalendarEvent } from "react-icons/tb";
import StatusPill from "../../admin/Booking/StatusPill";
import "../Styles/customerDashboard.css";

const UpcomingEvents = ({ events }) => {
  return (
    <Card className="dashboard-section-card">
      <Card.Body>
        <div className="dash-section-header">
          <div className="dash-section-title">
            <TbCalendarEvent size={22} />
            <span>Upcoming Events</span>
          </div>

          <button className="view-all-btn">
            View All
          </button>
        </div>

        {events.map((event, index) => (
          <div
            key={index}
            className="event-row"
          >
            <div className="event-left">
              <div className="event-date-box">
                <span>{event.day}</span>
                <small>{event.month}</small>
              </div>

              <div>
                <h6>{event.title}</h6>

                <p>
                  {event.venue} • {event.guests}
                </p>
              </div>
            </div>

            <StatusPill
              text={event.status.text}
              color={event.status.color}
            />
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default UpcomingEvents;