import { Card, Row, Col } from "react-bootstrap";

const actions = [
  "New Enquiry",
  "Quotations",
  "Make Payment",
  "Invoice",
];

const QuickActions = () => {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <h5 className="mb-4">
          Quick Actions
        </h5>

        <Row className="g-3">
          {actions.map((item, index) => (
            <Col xs={6} key={index}>
              <div className="action-box">
                {item}
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QuickActions;