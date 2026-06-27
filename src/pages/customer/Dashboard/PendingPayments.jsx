import { Card, Table } from "react-bootstrap";
import { TbCreditCard, TbDotsVertical } from "react-icons/tb";
import StatusPill from "../../admin/Booking/StatusPill";
import "../Styles/customerDashboard.css";

const PendingPayments = ({ payments }) => {
  return (
    <Card className="dashboard-section-card">
      <Card.Body>
        <div className="dash-section-header">
          <div className="dash-section-title">
            <TbCreditCard size={22} />
            <span>Pending Payments</span>
          </div>

          <button className="view-all-btn">
            View All
          </button>
        </div>

        <Table responsive borderless className="pending-payment-table">
          <thead style={{backgroundColor:"#fff !important",marginTop:"0px"}}>
            <tr>
              <th>BOOKING ID</th>
              <th>EVENT</th>
              <th>DUE DATE</th>
              <th>PENDING AMOUNT</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((item, index) => (
              <tr key={index}>
                <td style={{fontWeight: "400"}}>{item.bookingId}</td>

                <td style={{fontWeight: "400"}}>{item.event}</td>

                <td style={{fontWeight: "400"}}>{item.dueDate}</td>

                <td>{item.amount}</td>

                <td>
                  <StatusPill
                    text={item.status.text}
                    color={item.status.color}
                  />
                </td>

                <td>
                  <button className="action-btn">
                    <TbDotsVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default PendingPayments;