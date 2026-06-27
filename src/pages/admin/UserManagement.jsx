import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Spinner, Form, Dropdown, Modal, Button } from "react-bootstrap";
import { TbUserStar, TbUserCheck, TbUsers, TbUserCog, TbUserOff, TbUserPlus, TbTrendingUp, TbAlertTriangle, TbDotsVertical, TbDownload } from "react-icons/tb";
import API from "../../services/api";
import "./Styles/UserManagement.css";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("customer"); // 'customer' or 'staff'
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, customerCount: 0, staffCount: 0, inactiveUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [roleFilter, setRoleFilter] = useState("");
  // pagination coontrol states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // track selected users for checkbox selection and deselection
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Custom Toast alert state
  const [toastAlert, setToastAlert] = useState({ show: false, message: "", type: "success" });

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form States
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    city: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    city: ""
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Helper to trigger the floating toast alert
  const triggerToast = (message, type = "success") => {
    setToastAlert({ show: true, message, type });
    setTimeout(() => {
      setToastAlert(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Fetch Users based on filters
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/users`, {
        params: {
          role: activeTab, // filters by active tab (customer or staff)
          search,
          status: statusFilter
        }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
      triggerToast("Failed to load users list", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Stats counts
  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/users/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load user stats", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [activeTab, search, statusFilter]);

  // reset page numbers and clear selected checkboxes when tabs change
  useEffect(() => {
    setCurrentPage(1);
    setRoleFilter("");
    setSelectedUserIds([]);
  }, [activeTab]);

  // reset pagination & clear selected users when search, filters or sorting changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedUserIds([]);
  }, [search, statusFilter, roleFilter]);

  // Client-side sorting based on sortOrder
  const sortedUsers = [...users].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Client-side filtering based on roleFilter
  const filteredUsers = sortedUsers.filter((user, idx) => {
    if (!roleFilter) return true;
    if (activeTab === "customer") {
      // Determine if VIP (every 4th user is VIP in mock layout based on index)
      const isVip = idx % 4 === 0;
      return roleFilter === "vip" ? isVip : !isVip;
    } else {
      // For staff tab, we can filter by user.role
      return user.role === roleFilter;
    }
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  const startRange = filteredUsers.length === 0 ? 0 : indexOfFirstItem + 1;
  const endRange = Math.min(indexOfLastItem, filteredUsers.length);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  // Generate randomized/mock details for layout completeness (Bookings & Spend)
  const getMockedMetrics = (user, index) => {
    // Generate a stable integer index from the user's _id string hash
    let hash = 0;
    if (user._id) {
      for (let i = 0; i < user._id.length; i++) {
        hash = user._id.charCodeAt(i) + ((hash << 5) - hash);
      }
    }
    const stableIdx = Math.abs(hash);
    const bookings = (stableIdx * 3 + 2) % 13;
    const spend = bookings * 38000 + 15000;
    const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "US";

    // Exact colors from mockup
    const colors = ["#e6f4f2", "#e8f0fe", "#fef7e0", "#fce8e6", "#f3e5f5"];
    const textColors = ["#00685f", "#1a73e8", "#b06000", "#c5221f", "#7b1fa2"];
    const colIdx = stableIdx % colors.length;

    return { bookings, spend, initials, bgColor: colors[colIdx], textColor: textColors[colIdx], stableIdx };
  };

  // Add User Form Submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email || !addForm.mobile || !addForm.password) {
      setModalError("Name, Email, Mobile and Password are required.");
      return;
    }
    try {
      setModalLoading(true);
      setModalError("");

      const payload = {
        name: addForm.name,
        email: addForm.email,
        mobile: addForm.mobile,
        password: addForm.password,
        address: {
          street: "",
          city: addForm.city || "Mumbai",
          state: "",
          pincode: "",
          country: "India"
        },
        isActive: true
      };

      await API.post("/admin/users/create", payload);
      triggerToast(`${addForm.name} created successfully!`, "success");
      setShowAddModal(false);
      // Reset form
      setAddForm({ name: "", email: "", mobile: "", password: "", city: "" });
      // Refresh lists
      fetchUsers();
      fetchStats();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setModalError(errMsg);
    } finally {
      setModalLoading(false);
    }
  };

  // Edit User Form Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email || !editForm.mobile) {
      setModalError("Name, Email and Mobile are required.");
      return;
    }
    try {
      setModalLoading(true);
      setModalError("");

      const payload = {
        name: editForm.name,
        email: editForm.email,
        mobile: editForm.mobile,
        address: {
          street: selectedUser.address?.street || "",
          city: editForm.city || "Mumbai",
          state: selectedUser.address?.state || "",
          pincode: selectedUser.address?.pincode || "",
          country: selectedUser.address?.country || "India"
        }
      };

      await API.put(`/admin/users/${selectedUser._id}`, payload);
      triggerToast(`Profile updated successfully!`, "success");
      setShowEditModal(false);
      fetchUsers();
      fetchStats();
    } catch (err) {
      let errMsg = err.response?.data?.message || err.message;
      if (errMsg.includes("Staff not found")) {
        errMsg = "Customer profiles cannot be modified directly via this endpoint. Try updating a staff member instead.";
      }
      setModalError(errMsg);
    } finally {
      setModalLoading(false);
    }
  };

  // Toggle Active Status Submission
  const handleToggleSubmit = async () => {
    try {
      setModalLoading(true);
      const newStatus = !selectedUser.isActive;
      await API.patch(`/admin/users/${selectedUser._id}/toggle-active`, { isActive: newStatus });
      triggerToast(`User status updated to ${newStatus ? 'Active' : 'Inactive'}!`, "success");
      setShowToggleModal(false);
      fetchUsers();
      fetchStats();
    } catch (err) {
      let errMsg = err.response?.data?.message || err.message;
      if (errMsg.includes("Staff not found")) {
        errMsg = "Customer status cannot be toggled in this version. Try modifying a staff member instead.";
      }
      triggerToast(errMsg, "danger");
      setShowToggleModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  // Delete User Submission
  const handleDeleteSubmit = async () => {
    try {
      setModalLoading(true);
      await API.delete(`/admin/users/${selectedUser._id}`);
      triggerToast("User deleted successfully!", "success");
      setShowDeleteModal(false);
      fetchUsers();
      fetchStats();
    } catch (err) {
      let errMsg = err.response?.data?.message || err.message;
      if (errMsg.includes("Staff not found")) {
        errMsg = "Customer profiles cannot be deleted in this version. Try deleting a staff member instead.";
      }
      triggerToast(errMsg, "danger");
      setShowDeleteModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  // Helpers to prefill forms
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
      city: user.address?.city || ""
    });
    setModalError("");
    setShowEditModal(true);
  };

  const openToggleModal = (user) => {
    setSelectedUser(user);
    setShowToggleModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Toggle selction of single user
  const handleSelectUser = (userId) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)   //uncheck
        : [...prev, userId]                  //check
    )
  }

  // Toggle select all users
  const handleSelectAll = () => {
    const visibleUserIds = currentUsers.map(user => user._id);

    // Check if every user currently displayed on the page is selected
    const areAllVisibleSelected = visibleUserIds.length > 0 &&
      visibleUserIds.every(id => selectedUserIds.includes(id));
    if (areAllVisibleSelected) {
      // If all are selected, uncheck only the visible ones
      setSelectedUserIds(prev => prev.filter(id => !visibleUserIds.includes(id)));
    } else {
      // Otherwise, check all visible ones (retaining any already selected users from other pages)
      setSelectedUserIds(prev => {
        const newSelections = visibleUserIds.filter(id => !prev.includes(id));
        return [...prev, ...newSelections];
      });
    }
  };

  return (
    <div className="user-mgmt-container p-3 p-md-4">
      {/* Floating Toast Notification */}
      {toastAlert.show && (
        <div
          className={`alert alert-${toastAlert.type} alert-dismissible fade show shadow`}
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 9999,
            borderRadius: "12px",
            minWidth: "320px",
            paddingRight: "45px",
            fontSize: "13px",
            fontWeight: "600",
            fontFamily: "'Manrope', sans-serif"
          }}
        >
          {toastAlert.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setToastAlert({ ...toastAlert, show: false })}
          />
        </div>
      )}

      {/* 5 Trend Cards */}
      <Row className="mb-4 g-3 g-md-4">
        {/* Total Users */}
        <Col xl lg={4} md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#DDF5F0", color: "#0F766E" }}
                >
                  <TbUsers size={20} />
                </div>
                <h2 className="metric-number">{stats.totalUsers}</h2>
              </div>

              <div className="metric-title">TOTAL USER</div>

              <div className="metric-growth">
                <TbTrendingUp size={14} />
                <span>+14% this month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Active Users */}
        <Col xl lg={4} md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#E7F4EE", color: "#14B8A6" }}
                >
                  <TbUserCheck size={20} />
                </div>
                <h2 className="metric-number">{stats.activeUsers}</h2>
              </div>

              <div className="metric-title">ACTIVE USERS</div>

              <div className="metric-growth text-success">
                <TbTrendingUp size={14} />
                <span>+85% active rate</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Customers */}
        <Col xl lg={4} md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#E8F0FE", color: "#2563EB" }}
                >
                  <TbUserStar size={20} />
                </div>
                <h2 className="metric-number">{stats.customerCount}</h2>
              </div>

              <div className="metric-title">CUSTOMER</div>

              <div className="metric-growth text-success">
                <TbTrendingUp size={14} />
                <span>+5 this week</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Staff */}
        <Col xl lg={4} md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#FEF3D7", color: "#D97706" }}
                >
                  <TbUserCog size={20} />
                </div>
                <h2 className="metric-number">{stats.staffCount}</h2>
              </div>

              <div className="metric-title">STAFF MEMBER</div>

              <div className="metric-growth text-success">
                <TbTrendingUp size={14} />
                <span>+5 onboard</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Inactive */}
        <Col xl lg={4} md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#FDE8E8", color: "#EF4444" }}
                >
                  <TbUserOff size={20} />
                </div>
                <h2 className="metric-number">{stats.inactiveUsers}</h2>
              </div>

              <div className="metric-title">IN ACTIVE USERS</div>

              <div className="metric-alert">
                <TbAlertTriangle size={14} />
                <span>need attention</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Tabs and Actions bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div className="custom-pill-tabs shadow-sm align-self-start">
          <button
            onClick={() => setActiveTab("customer")}
            className={`tab-pill-btn ${activeTab === "customer" ? "active" : ""}`}
          >
            Customers List
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`tab-pill-btn ${activeTab === "staff" ? "active" : ""}`}
          >
            Staff {stats.staffCount || 24}
          </button>
        </div>

        <div className="d-flex gap-2 align-self-stretch align-self-md-auto justify-content-md-end">
          <button className="btn btn-export d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0">
            <TbDownload size={16} /> Export
          </button>
          <button
            className="btn btn-add-customer d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0"
            onClick={() => {
              setModalError("");
              setShowAddModal(true);
            }}
          >
            <TbUserPlus size={16} /> {activeTab === "customer" ? "Add Customer" : "Add Staff"}
          </button>
        </div>
      </div>

      {/* Main Grid List Table */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>

        {/* Card Header & Filter selectors */}
        <Card.Header className="bg-white border-0 pt-4 pb-2 px-3 px-md-4 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <h3 className="h3-card-title m-0" style={{ color: "#1e293b" }}>
            {activeTab === "customer" ? "Customer List" : "Staff List"}
          </h3>

          <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 justify-content-start justify-content-lg-end">
            {/* Roles filter */}
            <div className="filter-capsule-container">
              <Form.Select
                className="filter-select-inner filter-select-roles"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Roles</option>
                {activeTab === "customer" ? (
                  <>
                    <option value="vip">VIP</option>
                    <option value="regular">Regular</option>
                  </>
                ) : (
                  <>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </>
                )}
              </Form.Select>
              <span className="filter-clear-btn" onClick={() => setRoleFilter("")}>
                Clear All
              </span>
            </div>

            {/* Status filter */}
            <div className="filter-capsule-container">
              <Form.Select
                className="filter-select-inner filter-select-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Any Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
              <span className="filter-clear-btn" onClick={() => setStatusFilter("")}>
                Clear All
              </span>
            </div>

            {/* Sort order filter */}
            <Form.Select
              className="filter-sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </Form.Select>
          </div>
        </Card.Header>

        {/* Data Table */}
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#008075" }} />
            </div>
          ) : (
            <>
              <Table responsive hover className="custom-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="px-4" style={{ width: "50px" }}>
                      <input
                        type="checkbox"
                        style={{ cursor: "pointer" }}
                        checked={
                          currentUsers.length > 0 &&
                          currentUsers.every(user => selectedUserIds.includes(user._id))
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th style={{ minWidth: "220px" }}>{activeTab === "customer" ? "CUSTOMER" : "STAFF MEMBER"}</th>
                    <th style={{ minWidth: "130px" }}>PHONE</th>
                    <th style={{ minWidth: "110px" }}>CITY</th>
                    <th style={{ minWidth: "110px" }}>BOOKINGS</th>
                    <th style={{ minWidth: "130px" }}>TOTAL SPEND</th>
                    <th style={{ minWidth: "110px" }}>JOINED</th>
                    <th style={{ minWidth: "120px" }}>STATUS</th>
                    <th className="text-end px-4" style={{ width: "80px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-5 text-muted body-base">No users found</td>
                    </tr>
                  ) : (
                    currentUsers.map((user, idx) => {
                      const metrics = getMockedMetrics(user, indexOfFirstItem + idx);
                      return (
                        <tr key={user._id}>
                          <td className="px-4">
                            <input
                              type="checkbox"
                              style={{ cursor: "pointer" }}
                              checked={selectedUserIds.includes(user._id)}
                              onChange={() => handleSelectUser(user._id)}
                            />
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                style={{ width: "36px", height: "36px", backgroundColor: metrics.bgColor, color: metrics.textColor, fontSize: "13px" }}
                              >
                                {metrics.initials}
                              </div>
                              <div>
                                <div className="user-name" style={{ lineHeight: "1.2" }}>{user.name}</div>
                                <div className="user-email-text">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="user-mobile-text">{user.mobile}</td>
                          <td className="user-city-text">{user.address?.city || "Mumbai"}</td>
                          <td className="user-bookings-text">{metrics.bookings}</td>
                          <td className="user-spend-text">
                            ₹{metrics.spend.toLocaleString("en-IN")}
                          </td>
                          <td className="user-joined-text">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Mar 2024"}
                          </td>
                          <td>
                            <span className={`badge-dot badge-dot-${user.isActive ? ((indexOfFirstItem + idx) % 4 === 0 ? "vip" : "active") : "inactive"}`}>
                              <span className="status-dot" />
                              {user.isActive ? ((indexOfFirstItem + idx) % 4 === 0 ? "VIP" : "Active") : "Inactive"}
                            </span>
                          </td>
                          <td className="text-end px-4">
                            <Dropdown align="end">
                              <Dropdown.Toggle as="button" className="btn border-0 bg-transparent p-1 shadow-none">
                                <TbDotsVertical size={18} style={{ color: "#94a3b8" }} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => openEditModal(user)}>Edit Profile</Dropdown.Item>
                                <Dropdown.Item onClick={() => openToggleModal(user)}>
                                  {user.isActive ? "Deactivate" : "Activate"}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item className="text-danger" onClick={() => openDeleteModal(user)}>Delete</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>

              {/* Pagination footer */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-center py-3 py-md-4 px-3 px-md-4 bg-white border-top">
                <span className="text-muted body-small">
                  Showing {startRange}-{endRange} of {filteredUsers.length} users
                </span>

                <div className="d-flex gap-1 align-items-center flex-wrap justify-content-center">
                  <button
                    className="custom-pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {"<"}
                  </button>

                  {getPageNumbers().map((p, index) => (
                    p === "..." ? (
                      <span key={`dots-${index}`} className="mx-1 text-muted body-small">...</span>
                    ) : (
                      <button
                        key={`page-${p}`}
                        className={`custom-pagination-btn ${currentPage === p ? "active" : ""}`}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </button>
                    )
                  ))}

                  <button
                    className="custom-pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {">"}
                  </button>
                </div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      {/* --- ADD USER MODAL --- */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        className="premium-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h2-section m-0">
            {activeTab === "customer" ? "Add New Customer" : "Add New Staff Member"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            {modalError && (
              <div className="alert alert-danger body-small py-2 px-3 mb-3" style={{ borderRadius: "8px" }}>
                {modalError}
              </div>
            )}

            {activeTab === "customer" && (
              <div className="alert alert-info body-small py-2 px-3 mb-3 d-flex align-items-center gap-2" style={{ borderRadius: "8px", backgroundColor: "#e0f2fe", color: "#0369a1", border: "none" }}>
                <TbAlertTriangle size={16} />
                <span>Note: Under current system rules, newly created users default to the "Staff" role.</span>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="e.g. rahul@example.com"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="e.g. 9876543210"
                value={addForm.mobile}
                onChange={(e) => setAddForm({ ...addForm, mobile: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Temporary Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password (min 6 characters)"
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-0">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Mumbai"
                value={addForm.city}
                onChange={(e) => setAddForm({ ...addForm, city: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              className="btn-cancel"
              onClick={() => setShowAddModal(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-submit"
              disabled={modalLoading}
            >
              {modalLoading ? <Spinner animation="border" size="sm" /> : "Save Member"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* --- EDIT PROFILE MODAL --- */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        className="premium-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h2-section m-0">Edit User Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {modalError && (
              <div className="alert alert-danger body-small py-2 px-3 mb-3" style={{ borderRadius: "8px" }}>
                {modalError}
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                value={editForm.mobile}
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-0">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              className="btn-cancel"
              onClick={() => setShowEditModal(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-submit"
              disabled={modalLoading}
            >
              {modalLoading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* --- CONFIRM TOGGLE STATUS MODAL --- */}
      <Modal
        show={showToggleModal}
        onHide={() => setShowToggleModal(false)}
        centered
        className="premium-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h2-section m-0">Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body className="body-base">
          Are you sure you want to{" "}
          <strong style={{ color: "#0D9488" }}>
            {selectedUser?.isActive ? "deactivate" : "activate"}
          </strong>{" "}
          the user <strong>{selectedUser?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            className="btn-cancel"
            onClick={() => setShowToggleModal(false)}
            disabled={modalLoading}
          >
            Cancel
          </Button>
          <Button
            className="btn-submit"
            onClick={handleToggleSubmit}
            disabled={modalLoading}
          >
            {modalLoading ? <Spinner animation="border" size="sm" /> : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- CONFIRM DELETE MODAL --- */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        className="premium-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h2-section text-danger m-0">Delete Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="body-base">
          Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            className="btn-cancel"
            onClick={() => setShowDeleteModal(false)}
            disabled={modalLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            style={{ borderRadius: "10px", fontWeight: "600", fontSize: "13px", padding: "10px 20px" }}
            onClick={handleDeleteSubmit}
            disabled={modalLoading}
          >
            {modalLoading ? <Spinner animation="border" size="sm" /> : "Delete Member"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;