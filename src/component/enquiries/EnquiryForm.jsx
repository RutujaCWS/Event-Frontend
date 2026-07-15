import { useState } from "react";
import {
    Form,
    Button,
    Row,
    Col,
    Alert,
} from "react-bootstrap";
import { createEnquiry, createPublicEnquiry, } from "../../services/enquiryService";

const EnquiryForm = ({
    handleClose,
    fetchEnquiries,
    isPublicForm = false,
}) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        eventType: "",
        eventDate: "",
        guestCount: "",
        location: "",
        budget: "",
        description: "",
        serviceRequired: [],
    });

    const AVAILABLE_SERVICES = [
        { name: "Decoration", icon: "✨" },
        { name: "Photography", icon: "📷" },
        { name: "Catering", icon: "🍽️" },
        { name: "Entertainment", icon: "🎉" },
        { name: "Venue", icon: "📍" }
    ];

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");


    const handleServiceTypeChange = (service) => {
        setFormData((prev) => ({
            ...prev,
            serviceTypes: prev.serviceTypes.includes(service)
                ? prev.serviceTypes.filter((s) => s !== service)
                : [...prev.serviceTypes, service],
        }));

        setErrors({
            ...errors,
            serviceTypes: "",
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setErrors({
            ...errors,
            [e.target.name]: "",
        });
    };

    const validateForm = () => {
        let newErrors = {};
        if (isPublicForm) {
            // Full Name Validation
            if (!formData.fullName.trim()) {
                newErrors.fullName = "Full Name is required";
            } else if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
                newErrors.fullName =
                    "Name should contain only letters";
            } else if (formData.fullName.trim().length < 3) {
                newErrors.fullName =
                    "Name must be at least 3 characters";
            }

            // Mobile Number Validation
            if (!formData.mobileNumber.trim()) {
                newErrors.mobileNumber =
                    "Mobile Number is required";
            } else if (
                !/^[6-9]\d{9}$/.test(formData.mobileNumber)
            ) {
                newErrors.mobileNumber =
                    "Enter a valid 10-digit mobile number";
            }

            // Email Validation
            if (!formData.email.trim()) {
                newErrors.email =
                    "Email Address is required";
            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    formData.email
                )
            ) {
                newErrors.email =
                    "Enter a valid email address";
            }
        }
        if (!formData.eventType.trim()) {
            newErrors.eventType =
                "Event type is required";
        }

        if (!formData.eventDate) {
            newErrors.eventDate =
                "Event date is required";
        }

        if (
            formData.eventDate &&
            new Date(formData.eventDate) <
            new Date().setHours(0, 0, 0, 0)
        ) {
            newErrors.eventDate =
                "Past dates are not allowed";
        }

        if (!formData.guestCount) {
            newErrors.guestCount =
                "Guest count is required";
        }

        if (
            Number(formData.guestCount) <= 0
        ) {
            newErrors.guestCount =
                "Guest count must be greater than 0";
        }

        if (!formData.location.trim()) {
            newErrors.location =
                "Location is required";
        } else if (!/^[A-Za-z\s]+$/.test(formData.location)) {
            newErrors.location =
                "Location should contain only letters";
        } else if (formData.location.length > 50) {
            newErrors.location =
                "Location must be 50 characters or less";
        }
        if (isPublicForm) {
            if (!formData.fullName.trim()) {
                newErrors.fullName =
                    "Full Name is required";
            }

            if (!formData.mobileNumber.trim()) {
                newErrors.mobileNumber =
                    "Mobile Number is required";
            }

            if (!formData.email.trim()) {
                newErrors.email =
                    "Email Address is required";
            }
        }
        if (formData.budget && Number(formData.budget) < 0) {
            newErrors.budget = "Budget cannot be negative";
        }

        if (formData.serviceRequired.length === 0) {
            newErrors.serviceRequired = "Please select at least one service type";
        }

        if (formData.description && formData.description.length > 250) {
            newErrors.description = "Description must be 250 characters or less";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    const handleSubmit = async () => {
        setSuccess("");

        if (!validateForm()) return;

        try {
            const response = isPublicForm
                ? await createPublicEnquiry(
                    formData
                )
                : await createEnquiry(
                    formData
                );

            setSuccess(response.data.message);

            if (fetchEnquiries) {
                await fetchEnquiries();
            }

            setTimeout(() => {
                if (handleClose) {
                    handleClose();
                }

                setFormData({
                    fullName: "",
                    email: "",
                    mobileNumber: "",
                    eventType: "",
                    eventDate: "",
                    guestCount: "",
                    location: "",
                    budget: "",
                    description: "",
                    serviceRequired: [],
                });

                setSuccess("");
            }, 1200);
        } catch (error) {
            setErrors({
                submit:
                    error.response?.data?.message ||
                    "Failed to create enquiry",
            });
        }
    };

    const handleServiceToggle = (service) => {
        setFormData((prev) => {
            const updated = prev.serviceRequired.includes(service)
                ? prev.serviceRequired.filter((s) => s !== service)
                : [...prev.serviceRequired, service];
            return { ...prev, serviceRequired: updated };
        })
    }

    return (
        <>
            {success && (
                <Alert variant="success">
                    {success}
                </Alert>
            )}

            {errors.submit && (
                <Alert variant="danger">
                    {errors.submit}
                </Alert>
            )}

            <Form>
                {isPublicForm && (
                    <>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Full Name *
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                fullName: e.target.value.replace(
                                                    /[^A-Za-z\s]/g,
                                                    ""
                                                ),
                                            })
                                        }
                                        isInvalid={!!errors.fullName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fullName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Mobile Number *
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="mobileNumber"
                                        maxLength={10}
                                        value={formData.mobileNumber}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                mobileNumber: e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                ),
                                            })
                                        }
                                        isInvalid={!!errors.mobileNumber}
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.mobileNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Email Address *
                            </Form.Label>

                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value.trimStart(),
                                    })
                                }
                                isInvalid={!!errors.email}
                            />

                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </>
                )}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Event Type *
                            </Form.Label>

                            <Form.Select
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleChange}
                                isInvalid={
                                    !!errors.eventType
                                }
                            >
                                <option value="">
                                    Select Event Type
                                </option>

                                <option>
                                    Wedding
                                </option>

                                <option>
                                    Birthday
                                </option>

                                <option>
                                    Corporate
                                </option>

                                <option>
                                    Conference
                                </option>

                                <option>
                                    Exhibition
                                </option>

                                <option>
                                    Other
                                </option>
                            </Form.Select>

                            <Form.Control.Feedback type="invalid">
                                {errors.eventType}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold text-secondary mb-2" style={{ fontSize: "15px" }}>
                            Required Services *
                        </Form.Label>
                        <div className="d-flex flex-wrap gap-2 py-1">
                            {AVAILABLE_SERVICES.map((service) => {
                                const isSelected = formData.serviceRequired.includes(service.name);
                                return (
                                    <div
                                        key={service.name}
                                        onClick={() => handleServiceToggle(service.name)}
                                        style={{
                                            padding: "10px 18px",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            fontWeight: "500",
                                            fontSize: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            userSelect: "none",
                                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                            border: isSelected ? "2px solid #7c3aed" : "2px solid #e5e7eb",
                                            background: isSelected
                                                ? "linear-gradient(135deg, #9333ea, #7c3aed)"
                                                : "#ffffff",
                                            color: isSelected ? "#ffffff" : "#4b5563",
                                            boxShadow: isSelected
                                                ? "0 4px 12px rgba(124, 58, 237, 0.25)"
                                                : "0 2px 4px rgba(0, 0, 0, 0.02)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            if (!isSelected) {
                                                e.currentTarget.style.borderColor = "#c084fc";
                                                e.currentTarget.style.background = "#faf5ff";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            if (!isSelected) {
                                                e.currentTarget.style.borderColor = "#e5e7eb";
                                                e.currentTarget.style.background = "#ffffff";
                                            }
                                        }}
                                    >
                                        <span>{service.icon}</span>
                                        <span>{service.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {errors.serviceRequired && (
                            <div
                                className="text-danger small mt-2 d-flex align-items-center gap-1"
                                style={{ fontWeight: "500" }}
                            >
                                ⚠️ {errors.serviceRequired}
                            </div>
                        )}
                    </Form.Group>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Event Date *
                            </Form.Label>

                            <Form.Control
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                isInvalid={!!errors.eventDate}
                                min={new Date().toISOString().split("T")[0]}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.eventDate}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Expected Guests *
                            </Form.Label>

                            <Form.Control
                                type="number"
                                name="guestCount"
                                min="1"
                                placeholder="Enter guest count"
                                value={
                                    formData.guestCount
                                }
                                onChange={
                                    handleChange
                                }
                                isInvalid={
                                    !!errors.guestCount
                                }
                            />

                            <Form.Control.Feedback type="invalid">
                                {errors.guestCount}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Budget
                            </Form.Label>

                            <Form.Control
                                type="number"
                                name="budget"
                                min="0"
                                placeholder="Enter estimated budget"
                                value={
                                    formData.budget
                                }
                                onChange={
                                    handleChange
                                }
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.budget}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>
                        Event Location *
                    </Form.Label>

                    <Form.Control
                        type="text"
                        name="location"
                        placeholder="Enter event location"
                        maxLength={50}
                        value={formData.location}
                        onChange={(e) => {
                            const filtered = e.target.value.replace(/[^A-Za-z\s]/g, '');
                            setFormData({ ...formData, location: filtered });
                            setErrors({ ...errors, location: "" });
                        }}
                        isInvalid={
                            !!errors.location
                        }
                    />

                    <Form.Control.Feedback type="invalid">
                        {errors.location}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>
                        Description
                    </Form.Label>

                    <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        placeholder="Enter event requirements..."
                        maxLength={250}
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                        isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.description}
                    </Form.Control.Feedback>
                    <div className="text-muted small text-end mt-1">
                        {formData.description ? formData.description.length : 0}/250
                    </div>
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                    >
                        Submit Enquiry
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default EnquiryForm;