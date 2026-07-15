import React, { useState, useMemo, useEffect } from "react";
import { Modal, Button, Form, Table, Row, Col } from "react-bootstrap";
import { formatDate } from "../../../utils/formatDate";
import { createQuotation } from "../../../services/quotationService"
import { getTaxDiscountSettings, getGSTSettings } from "../../../services/settingsService";
import { useNavigate } from "react-router-dom";
import { getCmsSection } from "../../../services/cmsService";

export default function CreateQuotationModal({
  show,
  handleClose,
  lead,
}) {

  const handleFocusTrap = (e) => {
    if (e.key !== "Tab") return;
    const form = e.currentTarget;
    const focusableElements = form.querySelectorAll(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href]'
    );
    if (!focusableElements.length) return;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (
      !e.shiftKey &&
      document.activeElement === lastElement
    ) {
      e.preventDefault();
      firstElement.focus();
    }
    if (
      e.shiftKey &&
      document.activeElement === firstElement
    ) {
      e.preventDefault();
      lastElement.focus();
    }
  };

  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [adminTaxSettings, setAdminTaxSettings] = useState({
    cgstRate: 9,
    sgstRate: 9,
    defaultDiscountValue: 0
  });
  const [dbServices, setDbServices] = useState([]);

  useEffect(() => {
    if (show) {
      // calculate date 7 days from today
      const today = new Date();
      const seventDaysLater = new Date(today);
      seventDaysLater.setDate(today.getDate() + 7);
      const formattedDate = seventDaysLater.toISOString().split("T")[0];
      setValidUntil(formattedDate);

      const fetchSettings = async () => {
        try {
          // fetch both settings in parallel
          const [taxRes, gstRes] = await Promise.all([
            getTaxDiscountSettings().catch(err => ({ data: null })),
            getGSTSettings().catch(err => ({ success: false }))
          ])

          let cgst = 9;
          let sgst = 9;
          let discountVal = 0;

          if (gstRes.success && gstRes.data) {
            cgst = gstRes.data.cgstRate;
            sgst = gstRes.data.sgstRate;
          }

          if (taxRes.data?.data?.defaultDiscountValue !== undefined) {
            discountVal = taxRes.data.data.defaultDiscountValue;
          }
          setAdminTaxSettings({
            cgstRate: cgst,
            sgstRate: sgst,
            defaultDiscountValue: discountVal
          })
        } catch (error) {
          console.error("error fetching settings:", error);
        }
      }

      const fetchCmsServices = async () => {
        try {
          const response = await getCmsSection("services");
          if (response.data.success) {
            setDbServices(response.data.data?.content?.services || []);
          }
        } catch (error) {
          console.error("Error fetching services", error);
        }
      };
      fetchCmsServices();
      fetchSettings();
    }
  }, [show]);

  const DEFAULT_CGST = adminTaxSettings.cgstRate;
  const DEFAULT_SGST = adminTaxSettings.sgstRate;
  const DEFAULT_DISCOUNT = adminTaxSettings.defaultDiscountValue;
  const GST_RATE = adminTaxSettings.cgstRate + adminTaxSettings.sgstRate;
  console.log("lead", lead);

  const addService = () => {
    setServices([
      ...services,
      {
        serviceName: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        discountPercent: DEFAULT_DISCOUNT,
        discountAmount: 0,
        cgstPercent: DEFAULT_CGST,
        cgstAmount: 0,
        sgstPercent: DEFAULT_SGST,
        sgstAmount: 0,
        taxableAmount: 0,
        lineTotal: 0,
      },
    ]);
  };

  const calculateLine = (item) => {
    const baseAmount = item.quantity * item.unitPrice;
    const discountAmount = (baseAmount * item.discountPercent) / 100;
    const taxableAmount = baseAmount - discountAmount;
    const cgstAmount = (taxableAmount * item.cgstPercent) / 100;
    const sgstAmount = (taxableAmount * item.sgstPercent) / 100;
    const lineTotal = taxableAmount + cgstAmount + sgstAmount;

    return {
      ...item,
      discountAmount,
      taxableAmount,
      cgstAmount,
      sgstAmount,
      lineTotal,
    };
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;

    // Auto populate when the service selection changes
    if (field === "serviceName") {
      const matchedService = dbServices.find(s => s.name === value);
      if (matchedService) {
        updated[index].unitPrice = matchedService.basePrice || 0;
        updated[index].discountPercent = matchedService.discountpercent !== undefined ? matchedService.discountpercent : DEFAULT_DISCOUNT;
        updated[index].cgstPercent = DEFAULT_CGST;
        updated[index].sgstPercent = DEFAULT_SGST;
      }
    }

    updated[index] = calculateLine(updated[index]);
    setServices(updated);
  };

  const removeService = (index) => {
    setServices(
      services.filter((_, i) => i !== index)
    );
  };

  const subtotal = useMemo(() => {
    return services.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
  }, [services]);

  const totalDiscount = useMemo(() => {
    return services.reduce(
      (sum, item) => sum + item.discountAmount,
      0
    );
  }, [services]);

  const totalCGST = useMemo(() => {
    return services.reduce(
      (sum, item) => sum + item.cgstAmount,
      0
    );
  }, [services]);

  const totalSGST = useMemo(() => {
    return services.reduce(
      (sum, item) => sum + item.sgstAmount,
      0
    );
  }, [services]);

  const totalGST = totalCGST + totalSGST;

  const totalAmount = useMemo(() => {
    return services.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );
  }, [services]);

  const gstAmount = ((subtotal - discount) * GST_RATE) / 100;
  const grandTotal = subtotal - discount + gstAmount;

  const handleNotesChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    if (filteredValue.length <= 50) {
      setNotes(filteredValue);
    }
  }

  const handleTermsChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    if (filteredValue.length <= 50) {
      setTermsAndConditions(filteredValue);
    }
  }

  const handleSubmit = async (status) => {
    try {
      const payload = {
        leadId: lead._id,
        customerId: lead.customerId ? (lead.customerId._id || lead.customerId) : null,
        eventType: lead.eventType,
        eventDate: lead.eventDate,
        services,
        subtotal,
        totalDiscount,
        totalCGST,
        totalSGST,
        totalGST,
        totalAmount,
        validUntil,
        notes,
        termsAndConditions,
        status,
      };

      const response = await createQuotation(payload);

      if (response.data.success) {
        handleClose();
        navigate("/admin/quotations");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered onKeyDown={handleFocusTrap} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Create Quotation</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#0D9488 #F3F4F6' }}>
        {/* Customer Details */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                value={lead?.customerId?.name || lead?.fullName || ""}
                disabled
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Event Type</Form.Label>
              <Form.Control
                value={lead?.eventType || ""}
                disabled
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                value={formatDate(lead?.eventDate) || ""}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Services */}
        <div className="d-flex justify-content-between mb-3">
          <h5>Services</h5>

          <Button
            variant="success"
            size="sm"
            onClick={addService}
          >
            + Add Service
          </Button>
        </div>

        <Table bordered responsive>
          <thead>
            <tr>
              <th>Service</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount %</th>
              <th>CGST %</th>
              <th>SGST %</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {services.map((item, index) => (
              <tr key={index}>
                <td>
                  <Form.Select
                    value={item.serviceName}
                    onChange={(e) =>
                      updateService(
                        index,
                        "serviceName",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Service
                    </option>

                    {dbServices.filter(s => s.isActive).map(
                      (service) => (
                        <option
                          key={service.id}
                          value={service.name}
                        >
                          {service.name}
                        </option>
                      )
                    )}
                  </Form.Select>
                </td>

                <td>
                  <Form.Control
                    value={item.description}
                    onChange={(e) =>
                      updateService(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateService(
                        index,
                        "quantity",
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </td>

                <td>
                  <Form.Control
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateService(
                        index,
                        "unitPrice",
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </td>

                <td>
                  <Form.Control
                    type="number"
                    value={item.discountPercent}
                    onChange={(e) =>
                      updateService(
                        index,
                        "discountPercent",
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </td>

                <td>
                  <Form.Control
                    type="number"
                    value={item.cgstPercent}
                    onChange={(e) =>
                      updateService(
                        index,
                        "cgstPercent",
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </td>

                <td>
                  <Form.Control
                    type="number"
                    value={item.sgstPercent}
                    onChange={(e) =>
                      updateService(
                        index,
                        "sgstPercent",
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </td>

                <td>
                  ₹
                  {item.lineTotal.toLocaleString()}
                </td>

                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      removeService(index)
                    }
                  >
                    X
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Row className="mt-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Valid Until
              </Form.Label>

              <Form.Control
                type="date"
                value={validUntil}
                onChange={(e) =>
                  setValidUntil(
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Notes</Form.Label>

              <Form.Control
                as="textarea"
                rows={4}
                value={notes}
                maxLength={50}
                onChange={handleNotesChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>
                Terms & Conditions
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={4}
                value={termsAndConditions}
                maxLength={50}
                onChange={handleTermsChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Totals */}
        <Row className="justify-content-end mt-4">
          <Col md={5}>
            <Table bordered>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td>
                    ₹
                    {subtotal.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td>Total Discount</td>
                  <td>
                    ₹
                    {totalDiscount.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td>CGST</td>
                  <td>
                    ₹
                    {totalCGST.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td>SGST</td>
                  <td>
                    ₹
                    {totalSGST.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td>Total GST</td>
                  <td>
                    ₹
                    {totalGST.toLocaleString()}
                  </td>
                </tr>

                <tr className="fw-bold">
                  <td>Grand Total</td>
                  <td>
                    ₹
                    {totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={() =>
            handleSubmit("DRAFT")
          }
        >
          Create Quotation
        </Button>
      </Modal.Footer>
    </Modal>
  );
}