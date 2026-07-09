import React, { useState } from "react";
import { Button, Row, Col ,Card, Table, ButtonGroup } from "react-bootstrap";
import {
  TbDownload,
  TbCurrencyDollar,
  TbCheck,
  TbClock,
  TbFileInvoice,
  TbPlus,
  TbCreditCard, TbHistory, 
} from "react-icons/tb";

const paymentHistory = [
  {
    id: "#TXN-8821",
    type: "Advance · 50%",
    booking: "Sharma Wedding",
    bookingId: "#BK-2026-422",
    method: "GPay (UPI)",
    date: "15 Mar 2026",
    amount: "₹1,42,928",
    status: "Paid",
  },
  {
    id: "#TXN-8910",
    type: "Balance · 50%",
    booking: "Sharma Wedding",
    bookingId: "#BK-2026-422",
    method: "—",
    date: "Due Jul 10, 2026",
    amount: "₹1,42,928",
    status: "Pending",
  },
  {
    id: "#TXN-8612",
    type: "Full payment",
    booking: "Anniversary Dinner",
    bookingId: "#BK-2026-418",
    method: "Card",
    date: "02 Feb 2026",
    amount: "₹1,09,428",
    status: "Paid",
  },
  {
    id: "#TXN-8455",
    type: "Advance · 30%",
    booking: "Engagement",
    bookingId: "#BK-2026-407",
    method: "NEFT",
    date: "18 Jan 2026",
    amount: "₹9,746",
    status: "Failed",
  },
];
const receipts = [
  {
    id: "RCP-8821",
    title: "Receipt #RCP-8821",
    type: "Advance",
    event: "Sharma Wedding",
    date: "15 Mar 2026",
    amount: "₹1,42,928",
  },
  {
    id: "RCP-8612",
    title: "Receipt #RCP-8612",
    type: "Full Payment",
    event: "Anniversary Dinner",
    date: "02 Feb 2026",
    amount: "₹1,09,428",
  },
  {
    id: "RCP-8390",
    title: "Receipt #RCP-8390",
    type: "Full Payment",
    event: "Birthday Gala",
    date: "28 Apr 2026",
    amount: "₹60,488",
  },
  {
    id: "RCP-8201",
    title: "Receipt #RCP-8201",
    type: "Advance",
    event: "Engagement",
    date: "18 Jan 2026",
    amount: "₹22,488",
  },
];
const CustomerPayment = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const cards = [
    {
      icon: <TbCurrencyDollar size={26} />,
      bg: "#E0FAF7",
      color: "#0D9488",
      value: "₹2,85,856",
      title: "TOTAL BILLED",
      caption: "Across 1 active booking",
      captionColor: "#6B7280",
    },
    {
      icon: <TbCheck size={26} />,
      bg: "#E6FFF7",
      color: "#10B981",
      value: "₹1,42,928",
      title: "TOTAL PAID",
      caption: "50% completed",
      captionColor: "#10B981",
    },
    {
      icon: <TbClock size={26} />,
      bg: "#FFF1D8",
      color: "#F59E0B",
      value: "₹1,42,928",
      title: "BALANCE DUE",
      caption: "Due before Jul 10",
      captionColor: "#EF4444",
    },
    {
      icon: <TbFileInvoice size={26} />,
      bg: "#E7F0FF",
      color: "#3B82F6",
      value: "04",
      title: "RECEIPTS",
      caption: "Available to download",
      captionColor: "#0D9488",
    },
  ];

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "#F9FAFB",
        minHeight: "100vh",
        fontFamily: "Manrope",
      }}
    >
      {/* Header */}

      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: 6,
            }}
          >
            Payments
          </h2>

          <p
            style={{
              color: "#6B7280",
              fontSize: 16,
              margin: 0,
              fontWeight: 500,
            }}
          >
            Pay your advance or balance, review your payment history and
            download receipts.
          </p>
        </div>

        <Button
          style={{
            background: "#fff",
            color: "#374151",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: "10px 20px",
            fontWeight: 600,
          }}
        >
          <TbDownload size={18} className="me-2" />
          Export Statement
        </Button>
      </div>

      {/* Cards */}

      <Row className="g-4">
        {cards.map((card, index) => (
          <Col lg={3} md={6} key={index}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 16,
                padding: 20,
                height: 170,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 6px rgba(15,23,42,.04)",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color,
                }}
              >
                {card.icon}
              </div>

              <div>
                <h3
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 4,
                  }}
                >
                  {card.value}
                </h3>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#6B7280",
                    letterSpacing: ".5px",
                  }}
                >
                  {card.title}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    color: card.captionColor,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {card.caption}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
        <Row className="g-4 mt-3 align-items-stretch">
        {/* Advance Payment */}
        <Col lg={6} className="d-flex">
            <div
            className="d-flex flex-column h-100 w-100"
            style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "18px",
                padding: "20px",
                boxShadow: "0 2px 6px rgba(15,23,42,.04)",
            }}
            >
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="d-flex align-items-center">
                <div
                    style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: "#E0FAF7",
                    color: "#0D9488",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    }}
                >
                    <TbPlus size={24} />
                </div>

                <div>
                    <h5
                    style={{
                        fontWeight: 700,
                        marginBottom: 2,
                        color: "#111827",
                    }}
                    >
                    Advance Payment
                    </h5>

                    <small style={{ color: "#6B7280" }}>
                    Booking #BK-2026-422 · Sharma Wedding
                    </small>
                </div>
                </div>

                <span
                style={{
                    background: "#0D9488",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "4px 12px",
                    fontSize: 11,
                    fontWeight: 700,
                }}
                >
                RECOMMENDED
                </span>
            </div>

            <h2
                style={{
                fontSize: 44,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 18,
                }}
            >
                ₹1,42,928
                <span
                style={{
                    fontSize: 20,
                    color: "#6B7280",
                    marginLeft: 6,
                }}
                >
                / 50% of total
                </span>
            </h2>

            <div
                style={{
                background: "#F9FAFB",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: 16,
                color: "#374151",
                lineHeight: 1.6,
                marginBottom: 20,
                }}
            >
                Pay 50% now to confirm your booking and lock your event date.
                The balance can be cleared anytime before the event.
            </div>

            <div className="flex-grow-1">
                <div className="d-flex justify-content-between mb-3">
                <strong>Advance (50%)</strong>
                <strong>₹1,42,928</strong>
                </div>

                <div className="d-flex justify-content-between">
                <strong>Balance (due later)</strong>
                <strong>₹1,42,928</strong>
                </div>

                <hr
                style={{
                    borderStyle: "dashed",
                    borderColor: "#D1D5DB",
                    marginTop: 22,
                }}
                />
            </div>

            <div className="mt-auto">
                <Button
                style={{
                    width: "100%",
                    height: 52,
                    border: 0,
                    borderRadius: 12,
                    background: "#0D9488",
                    fontWeight: 700,
                }}
                >
                <TbCreditCard className="me-2" size={20} />
                Pay Advance ₹1,42,928
                </Button>
            </div>
            </div>
        </Col>

        {/* Full Payment */}
        <Col lg={6} className="d-flex">
            <div
            className="d-flex flex-column h-100 w-100"
            style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "18px",
                padding: "20px",
                boxShadow: "0 2px 6px rgba(15,23,42,.04)",
            }}
            >
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="d-flex align-items-center">
                <div
                    style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: "#E6FFF7",
                    color: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    }}
                >
                    <TbCheck size={24} />
                </div>

                <div>
                    <h5
                    style={{
                        fontWeight: 700,
                        marginBottom: 2,
                        color: "#111827",
                    }}
                    >
                    Full Payment
                    </h5>

                    <small style={{ color: "#6B7280" }}>
                    Booking #BK-2026-422 · Sharma Wedding
                    </small>
                </div>
                </div>

                <span
                style={{
                    background: "#E6FFF7",
                    color: "#10B981",
                    borderRadius: 8,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                }}
                >
                Save 2%
                </span>
            </div>

            <h2
                style={{
                fontSize: 44,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 18,
                }}
            >
                ₹2,80,138
                <span
                style={{
                    fontSize: 20,
                    color: "#6B7280",
                    marginLeft: 6,
                }}
                >
                / after 2% discount
                </span>
            </h2>

            <div
                style={{
                background: "#F9FAFB",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: 16,
                color: "#374151",
                lineHeight: 1.6,
                marginBottom: 20,
                }}
            >
                Clear the entire amount in one go and enjoy a 2% early-settlement
                discount. No balance to track later.
            </div>

            <div className="flex-grow-1">
                <div className="d-flex justify-content-between mb-3">
                <strong>Total Amount</strong>
                <strong>₹2,85,856</strong>
                </div>

                <div className="d-flex justify-content-between mb-3">
                <strong>Early-payment Discount (2%)</strong>

                <strong style={{ color: "#10B981" }}>− ₹5,718</strong>
                </div>

                <div
                className="d-flex justify-content-between"
                style={{
                    borderTop: "1px dashed #D1D5DB",
                    paddingTop: 14,
                }}
                >
                <strong>Payable Now</strong>
                <strong>₹2,80,138</strong>
                </div>
            </div>

            <div className="mt-auto">
                <Button
                style={{
                    width: "100%",
                    height: 52,
                    border: 0,
                    borderRadius: 12,
                    background: "#10B981",
                    fontWeight: 700,
                }}
                >
                <TbCheck className="me-2" size={20} />
                Pay Full ₹2,80,138
                </Button>
            </div>
            </div>
        </Col>

        </Row>
        <Card
        className="border-0 shadow-sm mt-4"
        style={{
            borderRadius: 18,
            border: "1px solid #E2E8F0",
        }}
        >
        <Card.Body className="p-4">

            {/* Header */}

            <div
  className="d-flex justify-content-between align-items-center mb-4 flex-wrap"
  style={{ gap: "12px" }}
>
            <div className="d-flex align-items-center">
                <TbHistory
                size={24}
                color="#0D9488"
                className="me-2"
                />

                <h5
                className="mb-0"
                style={{
                    fontWeight: 700,
                    color: "#111827",
                }}
                >
                Payment History
                </h5>
            </div>

            <div
                 style={{
    display: "inline-flex",
    alignItems: "center",
    padding: "4px",
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    gap: "4px",
    flexShrink: 0,
  }}
              >
                {["All", "Paid", "Pending"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveFilter(item)}
                    style={{
                      minWidth: "65px",
                      height: "34px",
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      borderRadius: "8px",
                      background: activeFilter === item ? "#FFFFFF" : "transparent",
                      color: activeFilter === item ? "#0D9488" : "#6B7280",
                      fontWeight: 600,
                      fontSize: "14px",
                      boxShadow:
                        activeFilter === item
                          ? "0 1px 4px rgba(0,0,0,0.08)"
                          : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <Table responsive hover className="align-middle mb-0">

            <thead>
              <tr>
                <th
                  style={{
                    background: "#F8FAFC",
                    border: 0,
                    borderTopLeftRadius: "12px",
                    borderBottomLeftRadius: "12px",
                  }}
                >
                  Transaction ID
                </th>

                <th style={{ background: "#F8FAFC", border: 0 }}>
                  Booking / Event
                </th>

                <th style={{ background: "#F8FAFC", border: 0 }}>
                  Method
                </th>

                <th style={{ background: "#F8FAFC", border: 0 }}>
                  Date
                </th>

                <th style={{ background: "#F8FAFC", border: 0 }}>
                  Amount
                </th>

                <th
                  style={{
                    background: "#F8FAFC",
                    border: 0,
                    borderTopRightRadius: "12px",
                    borderBottomRightRadius: "12px",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
                {paymentHistory.map((item) => (
                <tr key={item.id}>
                    <td>
                    <div
                        style={{
                        fontWeight: 700,
                        color: "#111827",
                        }}
                    >
                        {item.id}
                    </div>

                    <small
                        style={{
                        color: "#6B7280",
                        }}
                    >
                        {item.type}
                    </small>
                    </td>

                    <td>
                    <div
                        style={{
                        fontWeight: 700,
                        }}
                    >
                        {item.booking}
                    </div>

                    <small
                        style={{
                        color: "#6B7280",
                        }}
                    >
                        {item.bookingId}
                    </small>
                    </td>

                    <td
                    style={{
                        color:
                        item.method === "—"
                            ? "#6B7280"
                            : "#2563EB",
                        fontWeight: 600,
                    }}
                    >
                    {item.method}
                    </td>

                    <td>{item.date}</td>

                    <td
                    style={{
                        fontWeight: 700,
                    }}
                    >
                    {item.amount}
                    </td>

                    <td>
                    <span
                        style={{
                        background:
                            item.status === "Paid"
                            ? "#E6FFF7"
                            : item.status === "Pending"
                            ? "#FFF4E5"
                            : "#FFE9E9",

                        color:
                            item.status === "Paid"
                            ? "#10B981"
                            : item.status === "Pending"
                            ? "#F59E0B"
                            : "#EF4444",

                        padding: "6px 14px",
                        borderRadius: 30,
                        fontSize: 13,
                        fontWeight: 700,
                        }}
                    >
                        ● {item.status}
                    </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </Table>
        </Card.Body>
        </Card>
         <Card
        className="border-0 shadow-sm mt-4"
        style={{
            borderRadius: 18,
            border: "1px solid #E2E8F0",
        }}
        >
       <Card.Body className="p-4">
          {/* Header */}
          <div
            className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4"
            style={{ gap: "12px" }}
          >
            <div className="d-flex align-items-center">
              <TbFileInvoice
                size={24}
                color="#0D9488"
                className="me-2"
              />

              <h5
                className="mb-0"
                style={{
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Receipts
              </h5>
            </div>

            <Button
              variant="link"
              className="text-decoration-none p-0"
              style={{
                color: "#0D9488",
                fontWeight: 700,
              }}
            >
              Download All
              <TbDownload className="ms-1" />
            </Button>
          </div>

          {receipts.map((receipt, index) => (
            <div key={receipt.id}>
              <div
                className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-3"
                style={{ gap: "16px" }}
              >
                {/* Left */}
                <div className="d-flex align-items-start">
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      minWidth: 42,
                      borderRadius: 12,
                      background: "#E0FAF7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#0D9488",
                      marginRight: 14,
                    }}
                  >
                    <TbFileInvoice size={22} />
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "18px",
                        color: "#111827",
                        wordBreak: "break-word",
                      }}
                    >
                      {receipt.title}
                    </div>

                    <div
                      className="text-wrap text-md-nowrap w-100"
                      style={{
                        color: "#6B7280",
                        fontSize: 14,
                        marginTop: 4,
                        lineHeight: 1.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {receipt.type} · {receipt.event} · {receipt.date}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div
                  className="d-flex justify-content-between justify-content-md-end align-items-center w-100"
                  style={{
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "20px",
                      color: "#111827",
                    }}
                  >
                    {receipt.amount}
                  </div>

                  <Button
                    variant="light"
                    style={{
                      width: 42,
                      height: 42,
                      minWidth: 42,
                      borderRadius: 12,
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TbDownload size={20} />
                  </Button>
                </div>
              </div>

              {index !== receipts.length - 1 && (
                <hr
                  style={{
                    margin: 0,
                    borderColor: "#E2E8F0",
                  }}
                />
              )}
            </div>
          ))}
        </Card.Body>
        </Card>
    </div>
  );
};

export default CustomerPayment;