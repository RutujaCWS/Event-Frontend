// CustomerQuotation.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Table, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaEye, FaCheck, FaTimes, FaPrint } from 'react-icons/fa';
import { 
  getCustomerQuotations,  
  approveQuotation, 
  rejectQuotation,
  getQuotationByToken
} from '../../../services/quotationService';
import { formatDate } from '../../../utils/formatDate';

const CustomerQuotation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fetch quotations on component mount
  useEffect(() => {
    if (token) {
      fetchQuotationByToken(token);
    } else {
      fetchAllQuotations();
    }
  }, [token]);

  // Apply filters
  useEffect(() => {
    let filtered = [...quotations];
    
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.leadId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.guestName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(q => q.status === statusFilter);
    }
    
    setFilteredQuotations(filtered);
  }, [quotations, searchTerm, statusFilter]);

  // Fetch all quotations for the customer
  const fetchAllQuotations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCustomerQuotations();
      console.log('Customer quotations:', response.data);
      
      if (response.data.success) {
        setQuotations(response.data.data);
        setFilteredQuotations(response.data.data);
      } else {
        setError('Failed to fetch quotations');
      }
    } catch (err) {
      console.error('Error fetching quotations:', err);
      setError(err.response?.data?.message || 'Failed to load quotations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch quotation by token
  const fetchQuotationByToken = async (token) => {
    setLoading(true);
    setError('');
    try {
      const response = await getQuotationByToken(token);
      console.log('Quotation by token:', response.data);
      
      if (response.data.success) {
        setSelectedQuotation(response.data.data);
        setViewMode('detail');
      } else {
        setError('Invalid quotation link');
      }
    } catch (err) {
      console.error('Error fetching quotation:', err);
      setError(err.response?.data?.message || 'Failed to load quotation');
    } finally {
      setLoading(false);
    }
  };

  // Handle approve
  const handleApprove = async () => {
    try {
      const response = await approveQuotation(selectedQuotationId);
      
      if (response.data.success) {
        alert('Quotation approved successfully!');
        setShowApproveModal(false);
        fetchAllQuotations();
        setShowDetailModal(false);
        setSelectedQuotation(null);
      }
    } catch (err) {
      console.error('Error approving quotation:', err);
      alert(err.response?.data?.message || 'Failed to approve quotation');
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await rejectQuotation(selectedQuotationId, { 
        reason: rejectionReason 
      });
      
      if (response.data.success) {
        alert('Quotation rejected successfully!');
        setShowRejectModal(false);
        setRejectionReason('');
        fetchAllQuotations();
        setShowDetailModal(false);
        setSelectedQuotation(null);
      }
    } catch (err) {
      console.error('Error rejecting quotation:', err);
      alert(err.response?.data?.message || 'Failed to reject quotation');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      'DRAFT': { color: 'secondary', label: 'Draft' },
      'SENT': { color: 'info', label: 'Sent' },
      'VIEWED': { color: 'primary', label: 'Viewed' },
      'APPROVED': { color: 'success', label: 'Approved' },
      'REJECTED': { color: 'danger', label: 'Rejected' },
      'SUPERSEDED': { color: 'warning', label: 'Superseded' },
    };
    return statusMap[status] || { color: 'secondary', label: status };
  };

  // Get status count
  const getStatusCount = (status) => {
    if (status === 'TOTAL') return quotations.length;
    return quotations.filter(q => q.status === status).length;
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p>Loading quotations...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
          <Button 
            variant="primary"
            onClick={() => {
              setError('');
              fetchAllQuotations();
            }}
          >
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  // Detail view for single quotation (with token)
  if (viewMode === 'detail' && selectedQuotation) {
    const quotation = selectedQuotation;
    const statusBadge = getStatusBadge(quotation.status);

    return (
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-0">Quotation Details</h3>
            <small className="text-muted">
              View complete quotation information
            </small>
          </div>
          <Button 
            variant="outline-secondary"
            onClick={() => {
              setViewMode('list');
              setSelectedQuotation(null);
              if (token) navigate('/customer/quotations');
            }}
          >
            ← Back to Quotations
          </Button>
        </div>

        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{quotation.quotationNumber}</h5>
              <Badge bg={statusBadge.color}>
                {statusBadge.label}
              </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <Row className="mb-4">
              <Col md={6}>
                <h6 className="text-muted">Quotation Details</h6>
                <p><strong>Date:</strong> {formatDate(quotation.createdAt)}</p>
                {quotation.eventDate && (
                  <p><strong>Event Date:</strong> {formatDate(quotation.eventDate)}</p>
                )}
                {quotation.validUntil && (
                  <p><strong>Valid Until:</strong> {formatDate(quotation.validUntil)}</p>
                )}
                <p><strong>Version:</strong> V{quotation.version || 1}</p>
              </Col>
              <Col md={6}>
                <h6 className="text-muted">Customer Details</h6>
                <p><strong>Name:</strong> {quotation.leadId?.fullName || quotation.guestName || 'N/A'}</p>
                <p><strong>Email:</strong> {quotation.leadId?.email || quotation.guestEmail || 'N/A'}</p>
                {quotation.leadId?.phone && (
                  <p><strong>Phone:</strong> {quotation.leadId.phone}</p>
                )}
              </Col>
            </Row>

            {/* Services Table */}
            {quotation.services && quotation.services.length > 0 && (
              <div className="mb-4">
                <h6 className="text-muted">Services</h6>
                <Table bordered responsive>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Service</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Discount %</th>
                      <th>CGST %</th>
                      <th>SGST %</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.services.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.serviceName || 'N/A'}</td>
                        <td>{item.description || '-'}</td>
                        <td>{item.quantity || 1}</td>
                        <td>{formatCurrency(item.unitPrice || 0)}</td>
                        <td>{item.discountPercent || 0}%</td>
                        <td>{item.cgstPercent || 0}%</td>
                        <td>{item.sgstPercent || 0}%</td>
                        <td>{formatCurrency(item.lineTotal || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="8" className="text-end"><strong>Grand Total</strong></td>
                      <td><strong>{formatCurrency(quotation.totalAmount)}</strong></td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            )}

            {/* Totals Summary */}
            <Row className="justify-content-end mb-4">
              <Col md={5}>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td>Subtotal</td>
                      <td>{formatCurrency(quotation.subtotal || 0)}</td>
                    </tr>
                    <tr>
                      <td>Total Discount</td>
                      <td className="text-danger">-{formatCurrency(quotation.totalDiscount || 0)}</td>
                    </tr>
                    <tr>
                      <td>Taxable Amount</td>
                      <td>{formatCurrency((quotation.subtotal || 0) - (quotation.totalDiscount || 0))}</td>
                    </tr>
                    <tr>
                      <td>CGST</td>
                      <td>{formatCurrency(quotation.totalCGST || 0)}</td>
                    </tr>
                    <tr>
                      <td>SGST</td>
                      <td>{formatCurrency(quotation.totalSGST || 0)}</td>
                    </tr>
                    <tr>
                      <td>Total GST</td>
                      <td>{formatCurrency(quotation.totalGST || 0)}</td>
                    </tr>
                    <tr className="fw-bold bg-light">
                      <td>Grand Total</td>
                      <td>{formatCurrency(quotation.totalAmount)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>

            {/* Notes & Terms */}
            {quotation.notes && (
              <div className="mb-3">
                <h6 className="text-muted">Notes</h6>
                <p className="bg-light p-3 rounded">{quotation.notes}</p>
              </div>
            )}

            {quotation.termsAndConditions && (
              <div className="mb-3">
                <h6 className="text-muted">Terms & Conditions</h6>
                <p className="bg-light p-3 rounded">{quotation.termsAndConditions}</p>
              </div>
            )}

            {/* Action Buttons */}
            {(quotation.status === 'SENT' || quotation.status === 'VIEWED') && (
              <div className="d-flex gap-3 mt-3">
                <Button 
                  variant="success"
                  onClick={() => {
                    setSelectedQuotationId(quotation._id);
                    setShowApproveModal(true);
                  }}
                >
                  <FaCheck className="me-2" /> Approve Quotation
                </Button>
                <Button 
                  variant="danger"
                  onClick={() => {
                    setSelectedQuotationId(quotation._id);
                    setShowRejectModal(true);
                  }}
                >
                  <FaTimes className="me-2" /> Reject Quotation
                </Button>
              </div>
            )}

            {quotation.status === 'APPROVED' && (
              <Alert variant="success" className="mt-3">
                <FaCheck className="me-2" /> This quotation has been approved.
              </Alert>
            )}

            {quotation.status === 'REJECTED' && (
              <Alert variant="danger" className="mt-3">
                <FaTimes className="me-2" /> This quotation has been rejected.
                {quotation.rejectionReason && (
                  <p className="mt-2 mb-0"><strong>Reason:</strong> {quotation.rejectionReason}</p>
                )}
              </Alert>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }

  // List view (all quotations) - Table format like Showquotation
  return (
    <>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-0">My Quotations</h3>
          <small className="text-muted">
            View and manage all your quotations
          </small>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
      <Col md={3}>
  <Card className="border-0 shadow-sm">
    <Card.Body>
      <h6 className="text-muted">Total</h6>
      <h3 className="mb-0">{getStatusCount('TOTAL')}</h3>
    </Card.Body>
  </Card>
</Col>
<Col md={3}>
  <Card className="border-0 shadow-sm">
    <Card.Body>
      <h6 className="text-muted">Sent</h6>
      <h3 className="mb-0 text-info">{getStatusCount('SENT')}</h3>
    </Card.Body>
  </Card>
</Col>
<Col md={3}>
  <Card className="border-0 shadow-sm">
    <Card.Body>
      <h6 className="text-muted">Approved</h6>
      <h3 className="mb-0 text-success">{getStatusCount('APPROVED')}</h3>
    </Card.Body>
  </Card>
</Col>
<Col md={3}>
  <Card className="border-0 shadow-sm">
    <Card.Body>
      <h6 className="text-muted">Rejected</h6>
      <h3 className="mb-0 text-danger">{getStatusCount('REJECTED')}</h3>
    </Card.Body>
  </Card>
</Col>
      </Row>

      {/* Filters */}
      <Card className="mb-3 border-0 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Control
                placeholder="Search quotation no, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="SENT">SENT</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button 
                variant="outline-secondary" 
                onClick={resetFilters}
                className="w-100"
              >
                Reset Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Quotations Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Quotation No</th>
                <th>Event Type</th>
                <th>Event Date</th>
                <th>Amount</th>
                <th>Version</th>
                <th>Valid Till</th>
                <th>Status</th>
                <th width="180">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    <p className="text-muted mb-0">No quotations found</p>
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((quotation) => {
                  const statusBadge = getStatusBadge(quotation.status);
                  const canAct = quotation.status === 'SENT' || quotation.status === 'VIEWED';

                  return (
                    <tr key={quotation._id}>
                      <td className="fw-bold">{quotation.quotationNumber}</td>
                      <td>{quotation.eventType || 'N/A'}</td>
                      <td>{quotation.eventDate ? formatDate(quotation.eventDate) : 'N/A'}</td>
                      <td>{formatCurrency(quotation.totalAmount)}</td>
                      <td>V{quotation.version || 1}</td>
                      <td>{quotation.validUntil ? formatDate(quotation.validUntil) : 'N/A'}</td>
                      <td>
                        <Badge bg={statusBadge.color}>
                          {statusBadge.label}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2 flex-nowrap">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedQuotation(quotation);
                              setShowDetailModal(true);
                            }}
                          >
                            View
                          </Button>
                          {canAct && (
                            <>
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => {
                                  setSelectedQuotationId(quotation._id);
                                  setShowApproveModal(true);
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => {
                                  setSelectedQuotationId(quotation._id);
                                  setShowRejectModal(true);
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {selectedQuotation?.quotationNumber}
            <Badge bg="light" className="ms-2 text-dark">
              {getStatusBadge(selectedQuotation?.status).label}
            </Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuotation && (
            <>
              {/* Basic Details */}
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Customer:</strong> {selectedQuotation.customerId?.name || selectedQuotation.leadId?.fullName || selectedQuotation.guestName || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedQuotation.customerId?.email || selectedQuotation.leadId?.email || selectedQuotation.guestEmail || 'N/A'}</p>
                  <p><strong>Event Type:</strong> {selectedQuotation.eventType || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Event Date:</strong> {selectedQuotation.eventDate ? formatDate(selectedQuotation.eventDate) : 'N/A'}</p>
                  <p><strong>Valid Until:</strong> {selectedQuotation.validUntil ? formatDate(selectedQuotation.validUntil) : 'N/A'}</p>
                  <p><strong>Version:</strong> V{selectedQuotation.version || 1}</p>
                </Col>
              </Row>

              {/* Services */}
              {selectedQuotation.services && selectedQuotation.services.length > 0 && (
                <div className="mb-3">
                  <h6 className="text-muted">Services</h6>
                  <Table bordered responsive size="sm">
                    <thead className="table-light">
                      <tr>
                        <th>Service</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Disc %</th>
                        <th>CGST %</th>
                        <th>SGST %</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuotation.services.map((item, index) => (
                        <tr key={index}>
                          <td>{item.serviceName || 'N/A'}</td>
                          <td>{item.quantity || 1}</td>
                          <td>{formatCurrency(item.unitPrice || 0)}</td>
                          <td>{item.discountPercent || 0}%</td>
                          <td>{item.cgstPercent || 0}%</td>
                          <td>{item.sgstPercent || 0}%</td>
                          <td>{formatCurrency(item.lineTotal || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              {/* Tax Summary */}
              <Row className="justify-content-end">
                <Col md={7}>
                  <Table bordered size="sm" className="mb-0">
                    <tbody>
                      <tr>
                        <td><strong>Subtotal</strong></td>
                        <td className="text-end">{formatCurrency(selectedQuotation.subtotal || 0)}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Discount</strong></td>
                        <td className="text-end text-danger">-{formatCurrency(selectedQuotation.totalDiscount || 0)}</td>
                      </tr>
                      <tr>
                        <td><strong>Taxable Amount</strong></td>
                        <td className="text-end">{formatCurrency((selectedQuotation.subtotal || 0) - (selectedQuotation.totalDiscount || 0))}</td>
                      </tr>
                      <tr>
                        <td><strong>CGST</strong></td>
                        <td className="text-end">{formatCurrency(selectedQuotation.totalCGST || 0)}</td>
                      </tr>
                      <tr>
                        <td><strong>SGST</strong></td>
                        <td className="text-end">{formatCurrency(selectedQuotation.totalSGST || 0)}</td>
                      </tr>
                      <tr>
                        <td><strong>Total GST</strong></td>
                        <td className="text-end">{formatCurrency(selectedQuotation.totalGST || 0)}</td>
                      </tr>
                      <tr className="table-success">
                        <td><strong>Grand Total</strong></td>
                        <td className="text-end fw-bold">{formatCurrency(selectedQuotation.totalAmount)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* Notes */}
              {selectedQuotation.notes && (
                <div className="mt-3">
                  <h6 className="text-muted">Notes</h6>
                  <div className="bg-light p-2 rounded">{selectedQuotation.notes}</div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {(selectedQuotation?.status === 'SENT' || selectedQuotation?.status === 'VIEWED') && (
            <>
              <Button 
                variant="success"
                onClick={() => {
                  setSelectedQuotationId(selectedQuotation._id);
                  setShowDetailModal(false);
                  setShowApproveModal(true);
                }}
              >
                <FaCheck className="me-2" /> Approve
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  setSelectedQuotationId(selectedQuotation._id);
                  setShowDetailModal(false);
                  setShowRejectModal(true);
                }}
              >
                <FaTimes className="me-2" /> Reject
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Approve Modal */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Approve Quotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to approve this quotation?</p>
          <p className="text-muted">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleApprove}>
            Yes, Approve
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => {
        setShowRejectModal(false);
        setRejectionReason('');
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Quotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Reason for Rejection</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this quotation..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowRejectModal(false);
            setRejectionReason('');
          }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Yes, Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerQuotation;