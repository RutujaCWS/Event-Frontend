import { Row, Col, Card } from "react-bootstrap";
import "../Styles/customerDashboard.css";

const StatsCards = ({ stats }) => {
  return (
    <Row className="g-4 mb-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <Col xl={3} lg={6} md={6} sm={6} xs={12} key={index}>
            <Card className="metric-card dashboard-metric-card">
              <Card.Body className="dashboard-metric-body">
                <div
                  className="metric-icon-box"
                  style={{
                    backgroundColor: item.bgColor,
                    color: item.iconColor,
                  }}
                >
                  <Icon size={20} />
                </div>

                <h4 className="dashboard-metric-number">
                  {item.value}
                </h4>

                <div className="dashboard-metric-title">
                  {item.title}
                </div>

                <div className={item.footerClass}>
                  {item.footer}
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default StatsCards;