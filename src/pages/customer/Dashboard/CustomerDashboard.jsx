import { Container, Row, Col } from "react-bootstrap";
import WelcomeSection from "./WelcomeSection";
import StatsCards from "./StatsCards";
import UpcomingEvents from "./UpcomingEvents";
import EnquiryStatus from "./EnquiryStatus";
import PendingPayments from "./PendingPayments";
import Notifications from "./../../shared/Notifications/Notifications";
import QuickActions from "./QuickActions";
import {
  dashboardStats,
  upcomingEvents,
  enquiryStatus,
  pendingPayments,
  notifications,
  actions
}from "../../../services/dashboardData"

const CustomerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Container fluid className="customer-dashboard">
      
      <WelcomeSection user={user}/>

      <StatsCards stats={dashboardStats}/>

      <Row className="g-4">
        <Col lg={6}>
            <UpcomingEvents
            events={upcomingEvents}
            />
        </Col>

        <Col lg={6}>
            <EnquiryStatus
            enquiries={enquiryStatus}
            />
        </Col>
    </Row>

      <div className="mt-4">
        <PendingPayments payments={pendingPayments}/>
      </div>

      <Row className="g-4 mt-1">
        <Col lg={8}>
          <Notifications data={notifications}/>
        </Col>

        <Col lg={4}>
          <QuickActions data={actions}/>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerDashboard;