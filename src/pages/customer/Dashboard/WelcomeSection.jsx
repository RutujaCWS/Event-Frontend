import { Button } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import "../Styles/customerDashboard.css";

const WelcomeSection = ({ user }) => {
  const displayName = user?.fullName || user?.name || "Rahul Kapoor";
  const navigate = useNavigate();

  return (
    <div className="welcome-section d-flex justify-content-between align-items-start flex-wrap gap-3">
      <div>
        <h1 className="welcome-title">
          Welcome back, <span className="welcome-name">{displayName}</span> 👋
        </h1>

        <p className="welcome-subtitle">
          Here's what's happening with your events today.
        </p>
      </div>

      <Button className="new-enquiry-btn" onClick={() => navigate("/customer/enquiries", { state: { openCreateModal: true } })}>
        <FiPlus size={20} />
        <span>New Enquiry</span>
      </Button>
    </div>
  );
};

export default WelcomeSection;