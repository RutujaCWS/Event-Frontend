import React from "react";

const CoreFeatures = () => {
  const features = [
    {
      icon: "📋",
      title: "Service & Event Catalog",
      points: [
        "Browse event categories",
        "View service details",
        "Image galleries & pricing",
      ],
    },
    {
      icon: "📝",
      title: "Event Enquiry System",
      points: [
        "Submit event enquiries",
        "Capture event requirements",
        "Track enquiry status",
      ],
    },
    {
      icon: "💰",
      title: "Quotation Management",
      points: [
        "Customized quotations",
        "GST & discounts",
        "Approval / Rejection",
      ],
    },
    {
      icon: "📅",
      title: "Booking Management",
      points: [
        "Booking confirmation",
        "Event scheduling",
        "Status tracking",
      ],
    },
    {
      icon: "💳",
      title: "Payment Management",
      points: [
        "UPI, Cards, Net Banking",
        "Advance & Full Payments",
        "Payment Tracking",
      ],
    },
    {
      icon: "🧾",
      title: "Invoice & GST",
      points: [
        "Auto-generated invoices",
        "GST breakdown",
        "Downloadable PDFs",
      ],
    },
    {
      icon: "👤",
      title: "Customer Dashboard",
      points: [
        "Track bookings",
        "View quotations",
        "Payment history",
      ],
    },
    {
      icon: "⚙️",
      title: "Admin Panel",
      points: [
        "Manage enquiries",
        "Create quotations",
        "Manage payments",
      ],
    },
    {
      icon: "📢",
      title: "Notifications & Alerts",
      points: [
        "Booking updates",
        "Payment reminders",
        "Quotation notifications",
      ],
    },
    {
      icon: "📊",
      title: "Reports & Analytics",
      points: [
        "Revenue insights",
        "Booking performance",
        "Event trends",
      ],
    },
  ];

  return (
    <section className="py-5 bg-light"  style={{ scrollMarginTop: "90px" }}>
      <div className="container-fluid px-5">

        <div className="text-center mb-5">
          <h2
            className="fw-bold"
            style={{
              fontSize: "42px",
              color: "#111827",
            }}
          >
            Everything You Need to Plan and Manage Events
          </h2>

          <p
            style={{
              color: "#6b7280",
              fontSize: "18px",
            }}
          >
            Powerful tools to manage enquiries, bookings,
            quotations, payments and event execution from one place.
          </p>
        </div>

        <div className="row g-4">

  <div className="col-lg-3">
    <div className="p-4 bg-white rounded-4 text-center">
      <div className="fs-1 mb-3">📝</div>
      <h5>Enquiries</h5>
      <p>Submit and track event requests.</p>
    </div>
  </div>

  <div className="col-lg-3">
    <div className="p-4 bg-white rounded-4 text-center">
      <div className="fs-1 mb-3">💰</div>
      <h5>Quotations</h5>
      <p>Receive customized pricing instantly.</p>
    </div>
  </div>

  <div className="col-lg-3">
    <div className="p-4 bg-white rounded-4 text-center">
      <div className="fs-1 mb-3">📅</div>
      <h5>Bookings</h5>
      <p>Manage schedules and confirmations.</p>
    </div>
  </div>

  <div className="col-lg-3">
    <div className="p-4 bg-white rounded-4 text-center">
      <div className="fs-1 mb-3">💳</div>
      <h5>Payments</h5>
      <p>Secure online and offline payments.</p>
    </div>
  </div>

</div>

      </div>
    </section>
  );
};

export default CoreFeatures;