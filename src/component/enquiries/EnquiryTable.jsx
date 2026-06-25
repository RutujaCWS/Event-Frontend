import Badge from "react-bootstrap/Badge";

const getStatusBadge = (status) => {
    switch (status) {
        case "Confirmed":
            return "success";

        case "Quoted":
            return "primary";

        case "Reviewed":
            return "info";

        case "Cancelled":
            return "danger";

        default:
            return "warning";
    }
};

const EnquiryTable = ({
    enquiries,
    handleDelete,
    handleEdit,
    handleView,
}) => {
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>Event Type</th>
                                <th>Date</th>
                                <th>Guests</th>
                                <th>Location</th>
                                <th>Budget</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {enquiries.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.eventType}</td>

                                    <td>
                                        {new Date(
                                            item.eventDate
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>{item.guestCount}</td>

                                    <td>{item.location}</td>

                                    <td>
                                        ₹
                                        {Number(
                                            item.budget || 0
                                        ).toLocaleString()}
                                    </td>

                                    <td>
                                        <Badge
                                            bg={getStatusBadge(
                                                item.status
                                            )}
                                        >
                                            {item.status}
                                        </Badge>
                                    </td>

                                    <td>
                                        <button
  className="btn btn-sm btn-outline-primary"
  onClick={() => handleView(item)}
>
  View
</button>

                                        <button
                                            className="btn btn-sm btn-outline-warning ms-2"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-danger ms-2"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EnquiryTable;