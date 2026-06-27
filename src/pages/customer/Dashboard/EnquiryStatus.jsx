import { Card } from "react-bootstrap";
import { TbFileDescription } from "react-icons/tb";
import StatusPill from "../../admin/Booking/StatusPill";
import "../Styles/customerDashboard.css";

const EnquiryStatus = ({ enquiries }) => {
  return (
    <Card className="dashboard-section-card">
      <Card.Body>
        <div className="dash-section-header">
          <div className="dash-section-title">
            <TbFileDescription size={22} />
            <span>Latest Enquiry Status</span>
          </div>

          <button className="view-all-btn">
            View All
          </button>
        </div>

        {enquiries.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="enquiry-row"
            >
              <div className="enquiry-left">
                <div
                  className="enquiry-icon-box"
                  style={{
                    background: item.iconBg,
                    color: item.iconColor,
                  }}
                >
                  <Icon size={15} />
                </div>

                <div style={{marginBottom:"2px"}}>
                  <small className="enquiry-id">
                    {item.enquiryId}
                  </small>

                  <h6>{item.title}</h6>

                  <p>{item.updated}</p>
                </div>
              </div>

              <StatusPill
                text={item.status.text}
                color={item.status.color}
              />
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default EnquiryStatus;