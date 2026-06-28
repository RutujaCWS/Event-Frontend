import React from "react";
import { Card } from "react-bootstrap";
import { FiBell } from "react-icons/fi";
import "../Styles/customerDashboard.css";

const Notifications = ({ data }) => {
  return (
    <Card className="dashboard-section-card">
      <Card.Body>
        <div className="dash-section-header">
          <div className="dash-section-title">
            <FiBell size={22} />
            <span>Notifications</span>
          </div>

          <button className="view-all-btn">Mark all read</button>
        </div>

        {data.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={index} className="notification-row">
              <div className="notification-left">
                <div
                  className={`notification-icon-box ${item.color}`}
                >
                  <Icon size={15} />
                </div>

                <div className="notification-content">
                  <h6>{item.title}</h6>
                  <p>{item.message}</p>
                  <small>{item.time}</small>
                </div>
              </div>

              <span className="notification-dot"></span>
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default Notifications;