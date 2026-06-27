import { Card } from "react-bootstrap";

const Notifications = () => {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <div className="card-header-custom">
          <h5>Notifications</h5>
          <span>Mark all read</span>
        </div>

        <div className="notification-item">
          <h6>Quotation Ready</h6>
          <p>
            Your quotation is now available to review.
          </p>
        </div>

        <div className="notification-item">
          <h6>Payment Due Reminder</h6>
          <p>
            Payment due for booking #BK-8821.
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Notifications;