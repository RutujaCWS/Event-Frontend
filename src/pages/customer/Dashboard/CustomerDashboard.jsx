import { Container, Row, Col } from "react-bootstrap";
import WelcomeSection from "./WelcomeSection";
import StatsCards from "./StatsCards";
import UpcomingEvents from "./UpcomingEvents";
import EnquiryStatus from "./EnquiryStatus";
import PendingPayments from "./PendingPayments";
import Notifications from "./Notifications";
import QuickActions from "./QuickActions";
import {
  dashboardStats,
  upcomingEvents,
  enquiryStatus,
  pendingPayments
}from "../../../services/dashboardData"

const CustomerDashboard = () => {
  return (
    <Container fluid className="customer-dashboard">
      <WelcomeSection />

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
          <Notifications />
        </Col>

        <Col lg={4}>
          <QuickActions />
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerDashboard;