import StatusPill from "./StatusPill";
import { Form, Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";

const BookingRow = ({ row, isSelected, onSelect }) => {
  return (
    <tr>
      <td className="px-4">
        <input
          type="checkbox"
          style={{ cursor: "pointer" }}
          checked={isSelected}
          onChange={onSelect}
        />
      </td>

      <td>
         <div
                  className="fw-bolder body-base"
                  style={{
                    fontWeight: 800,
                    color: "#0F172A",
                  }}
                >
          {row.bookingId}
        </div>
<div
  className="fw-bold text-muted body-base"
  style={{
    fontSize: "8px",
    lineHeight: "1.2"
  }}
>
  {row.description}
</div>
      </td>

      <td>
        <div className="d-flex align-items-center gap-3">
          <div
            className={`avatar ${row.avatarClass}`}
          >
            {row.initials}
          </div>

          <div>
            <div className="fw-bold text-dark body-base" style={{ lineHeight: "1.2" }}>
              {row.customer}
            </div>

            <div className="text-muted caption" style={{ marginTop: "2px" }}>
              {row.email}
            </div>
          </div>
        </div>
      </td>

      <td>
        <span className={`event-pill ${row.eventClass}`}>
          {row.eventType}
        </span>
      </td>

      <td className="fw-bold text-dark body-base" style={{ lineHeight: "1.2" }}>{row.amount}</td>

      <td className="fw-bold text-muted body-base" style={{ lineHeight: "1.2" }}>{row.date}</td>

      <td
  className="fw-bold text-muted body-base"
  style={{
    lineHeight: "1.2",
    whiteSpace: "nowrap"
  }}
>
  {row.venue}
</td>

      <td>
        <StatusPill {...row.status1}/>
      </td>

      <td className="text-start px-4">
        <Dropdown align="end">
          <Dropdown.Toggle
            as="button"
            className="btn border-0 bg-transparent p-1 shadow-none"
          >
            <BsThreeDotsVertical />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>View</Dropdown.Item>
            <Dropdown.Item>Edit</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger">
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export default BookingRow;