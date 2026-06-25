import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  createGalleryEvent,
  getGalleryEvents,
  deleteGalleryEvent,
   updateGalleryEvent,
} from "../../../services/galleryService";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../services/cmsService";

const GalleryManagement = () => {
    const [galleryEvents, setGalleryEvents] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

const [editData, setEditData] = useState({
  eventName: "",
  category: "",
  location: "",
  description: "",
  image: null,
});
  // Hero Section State
  const [heroData, setHeroData] = useState({
    heroTitle: "",
    heroDescription:
      "",
  });

  // Gallery Event State
  const [eventData, setEventData] = useState({
    eventName: "",
    category: "",
    location: "",
    description: "",
    image: null,
  });

  // Hero Change Handler
  const handleHeroChange = (e) => {
    setHeroData({
      ...heroData,
      [e.target.name]: e.target.value,
    });
  };

  // Event Change Handler
  const handleEventChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  // Image Change Handler
  const handleImageChange = (e) => {
    setEventData({
      ...eventData,
      image: e.target.files[0],
    });
  };
useEffect(() => {
  fetchHeroData();
  fetchGalleryEvents();
}, []);

const fetchGalleryEvents = async () => {
  try {
    const res = await getGalleryEvents();

    setGalleryEvents(res.data.data);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchHeroData();
}, []);

const fetchHeroData = async () => {
  try {
    const res = await getCmsSection(
      "gallery"
    );

    if (res.data.data?.content) {
      setHeroData(
        res.data.data.content
      );
    }
  } catch (error) {
    console.log(error);
  }
};

  // Save Gallery Event
  const handleEventSave = async () => {
  try {
    const formData = new FormData();

    Object.keys(eventData).forEach((key) => {
      formData.append(key, eventData[key]);
    });

    const res = await createGalleryEvent(formData);

    alert(res.data.message);

    setEventData({
      eventName: "",
      category: "",
      location: "",
      description: "",
      image: null,
    });
  } catch (error) {
    console.log(error);
  }
};
const handleHeroSave = async () => {
  try {
    const res = await updateCmsSection(
      "gallery",
      heroData
    );

    alert(res.data.message);
  } catch (error) {
    console.log(error);
  }
};
const handleDelete = async (id) => {
  try {
    if (
      !window.confirm(
        "Are you sure you want to delete this event?"
      )
    ) {
      return;
    }

    await deleteGalleryEvent(id);

    alert("Event Deleted Successfully");

    fetchGalleryEvents();
  } catch (error) {
    console.log(error);
  }
};
const handleEdit = (event) => {
  setEditId(event._id);

  setEditData({
    eventName: event.eventName,
    category: event.category,
    location: event.location,
    description: event.description,
    image: null,
  });

  setShowEditModal(true);
};
const handleEditChange = (e) => {
  setEditData({
    ...editData,
    [e.target.name]: e.target.value,
  });
};

const handleEditImageChange = (e) => {
  setEditData({
    ...editData,
    image: e.target.files[0],
  });
};
const handleUpdate = async () => {
  try {
    const formData = new FormData();

    Object.keys(editData).forEach((key) => {
      if (editData[key]) {
        formData.append(key, editData[key]);
      }
    });

    await updateGalleryEvent(
      editId,
      formData
    );

    alert("Gallery Event Updated Successfully");

    setShowEditModal(false);

    fetchGalleryEvents();
  } catch (error) {
    console.log(error);
  }
};
  return (
    <div className="container-fluid">
      <h4 className="mb-4">Gallery Page Management</h4>

      {/* Hero Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="mb-4">Hero Section</h5>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Hero Title
            </label>
            <input
              type="text"
              name="heroTitle"
              value={heroData.heroTitle}
              onChange={handleHeroChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Hero Description
            </label>
            <textarea
              rows="3"
              name="heroDescription"
              value={heroData.heroDescription}
              onChange={handleHeroChange}
              className="form-control"
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleHeroSave}
          >
            Save Hero Section
          </button>
        </div>
      </div>

      {/* Add Gallery Event */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="mb-4">Add Gallery Event</h5>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Event Name
            </label>
            <input
              type="text"
              name="eventName"
              value={eventData.eventName}
              onChange={handleEventChange}
              className="form-control"
              placeholder="Enter Event Name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Category
            </label>
            <select
              name="category"
              value={eventData.category}
              onChange={handleEventChange}
              className="form-select"
            >
              <option value="">Select Category</option>
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
              <option value="Corporate">Corporate</option>
              <option value="Cultural Event">
                Cultural Event
              </option>
              <option value="Engagement">
                Engagement
              </option>
              <option value="Anniversary">
                Anniversary
              </option>
              <option value="Engagement">
               Custom Events
              </option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleEventChange}
              className="form-control"
              placeholder="Enter Event Location"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Description
            </label>
            <textarea
              rows="4"
              name="description"
              value={eventData.description}
              onChange={handleEventChange}
              className="form-control"
              placeholder="Enter Event Description"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">
              Upload Image
            </label>
            <input
              id="galleryImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>

          <button
            className="btn btn-success px-4"
            onClick={handleEventSave}
          >
            Add Gallery Event
          </button>
        </div>
      </div>
      <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">
            <h5 className="mb-4">
            Gallery Events
            </h5>

            <div className="row">
            {galleryEvents.map((event) => (
                <div
                key={event._id}
                className="col-md-4 mb-4"
                >
                <div className="card h-100 shadow-sm">
                    <img
                    src={event.image}
                    alt={event.eventName}
                    style={{
                        height: "220px",
                        objectFit: "cover",
                    }}
                    className="card-img-top"
                    />

                    <div className="card-body">
                    <h6 className="fw-bold">
                        {event.eventName}
                    </h6>

                    <p className="mb-1">
                        <strong>
                        Category:
                        </strong>{" "}
                        {event.category}
                    </p>

                    <p className="mb-2">
                        <strong>
                        Location:
                        </strong>{" "}
                        {event.location}
                    </p>

                    <div className="d-flex gap-2">
                        <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(event)}
                        >
                        Edit
                        </button>

                        <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                            handleDelete(
                            event._id
                            )
                        }
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
        <Modal
  show={showEditModal}
  onHide={() => setShowEditModal(false)}
  centered
  size="lg"
>
  <Modal.Header closeButton>
    <Modal.Title>
      Edit Gallery Event
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <div className="mb-3">
      <label className="form-label">
        Event Name
      </label>
      <input
        type="text"
        name="eventName"
        value={editData.eventName}
        onChange={handleEditChange}
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <label className="form-label">
        Category
      </label>

      <select
        name="category"
        value={editData.category}
        onChange={handleEditChange}
        className="form-select"
      >
        <option value="Wedding">
          Wedding
        </option>
        <option value="Birthday">
          Birthday
        </option>
        <option value="Corporate">
          Corporate
        </option>
        <option value="Cultural Event">
          Cultural Event
        </option>
        <option value="Engagement">
          Engagement
        </option>
        <option value="Anniversary">
          Anniversary
        </option>
      </select>
    </div>

    <div className="mb-3">
      <label className="form-label">
        Location
      </label>

      <input
        type="text"
        name="location"
        value={editData.location}
        onChange={handleEditChange}
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <label className="form-label">
        Description
      </label>

      <textarea
        rows="4"
        name="description"
        value={editData.description}
        onChange={handleEditChange}
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <label className="form-label">
        Change Image
      </label>

      <input
        type="file"
        className="form-control"
        onChange={handleEditImageChange}
      />
    </div>
  </Modal.Body>

  <Modal.Footer>
    <button
      className="btn btn-secondary"
      onClick={() =>
        setShowEditModal(false)
      }
    >
      Cancel
    </button>

    <button
      className="btn btn-warning"
      onClick={handleUpdate}
    >
      Update Event
    </button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default GalleryManagement;