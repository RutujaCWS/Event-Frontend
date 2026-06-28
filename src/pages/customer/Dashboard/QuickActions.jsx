import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { TbBolt } from "react-icons/tb";
import "../Styles/customerDashboard.css";

const QuickActions = ({ data }) => {
  return (
    <Card className="dashboard-section-card">
      <Card.Body>
        <div className="dash-section-header">
          <div className="dash-section-title">
            <TbBolt size={22} />
            <span>Quick Actions</span>
          </div>
        </div>

        <Row className="g-3">
          {data.map((item, index) => {
            const Icon = item.icon;

            return (
              <Col xs={6} key={index}>
                <Card className="quick-action-card">
                  <Card.Body className="quick-action-body">
                    <div className="quick-action-icon">
                      <Icon size={36} />
                    </div>

                    <h6>{item.title}</h6>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QuickActions;