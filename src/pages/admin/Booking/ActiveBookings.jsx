import { Row, Col, Button } from "react-bootstrap";
import BookingCard from "./BookingCard";
import { TbUserStar,TbPlus, TbUserCheck, TbUsers, TbUserCog, TbUserOff, TbUserPlus, TbTrendingUp, TbAlertTriangle, TbDotsVertical, TbDownload } from "react-icons/tb";
const ActiveBookings = ({ bookings }) => {
  return (
    <>
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div className="align-self-start">
               <h2 className="page-title">Active Bookings</h2>
          </div>
  
          <div className="d-flex gap-2 align-self-stretch align-self-md-auto justify-content-md-end">
            <button className="btn btn-add-customer d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0">
              <TbPlus size={16} /> Add Bookings 
            </button>

          </div>
        </div>

      <div className="row g-2">

        {bookings.map((booking) => (
          <div className="col-lg-3 col-md-6" key={booking.id}>
            <BookingCard booking={booking} />
          </div>
        ))}

      </div>
    </>
  );
};

export default ActiveBookings;