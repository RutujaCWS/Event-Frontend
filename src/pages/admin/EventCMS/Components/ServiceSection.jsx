import React, { useEffect, useState } from "react";

import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../../../services/serviceService";

const ServiceSection = ({
  allView = false,
  showServiceModal,
  setShowServiceModal,
}) => {

  const [services, setServices] = useState([]);

const [selectedService, setSelectedService] = useState(null);



const [formData, setFormData] = useState({
  title: "",
  description: "",
  icon: "bi-heart-fill",
  status: "Published",
  seoScore: 90,
});

const loadServices = async () => {
  try {
    const res = await getServices();

    if (res.data.success) {
      setServices(res.data.data);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadServices();
}, []);

const handleSaveService = async () => {
  try {
    const res = await createService(formData);

    if (res.data.success) {
      alert("Service Added Successfully");

      loadServices();

      setShowServiceModal(false);

      setFormData({
        title: "",
        description: "",
        icon: "bi-heart-fill",
        status: "Published",
        seoScore: 90,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const handleUpdateService = async () => {
  try {
    const res = await updateService(
      selectedService._id,
      formData
    );

    if (res.data.success) {
      alert("Service Updated Successfully");

      loadServices();

      setShowServiceModal(false);

      setSelectedService(null);

      setFormData({
        title: "",
        description: "",
        icon: "bi-heart-fill",
        status: "Published",
        seoScore: 90,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const handleDeleteService = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this service?"
  );

  if (!confirmDelete) return;

  try {
    const res = await deleteService(id);

    if (res.data.success) {
      alert("Service Deleted Successfully");

      loadServices();

      if (selectedService?._id === id) {
        setSelectedService(null);

        setShowServiceModal(false);

        setFormData({
          title: "",
          description: "",
          icon: "bi-heart-fill",
          status: "Published",
          seoScore: 90,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const handleEditService = (service) => {
  setSelectedService(service);

  setFormData({
    title: service.title,
    description: service.description,
    icon: service.icon,
    status: service.status,
    seoScore: service.seoScore,
  });

  setShowServiceModal(true);
};

  return (
    <>
  

<div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="mb-0 fw-semibold"
      style={{
         marginTop:"10px"
       }}>Service Content</h5>

    <button
  className="btn"
  onClick={() => {
    setSelectedService(null);

    setFormData({
      title: "",
      description: "",
      icon: "bi-heart-fill",
      status: "Published",
      seoScore: 90,
    });

    setShowServiceModal(true);
  }}
  style={{
    background: "#0D9488",
    color: "#fff",
    borderRadius: "8px",
    padding: "8px 18px",
    marginTop: "10px",
  }}
>
  Add New Service
</button>
    </div>
<div className="row  ">
   <div className="col-12">
    <div className="row g-3">
   {services.map((service) => (
<div
  key={service._id}
  className={allView ? "col-md-6 d-flex" : "col-lg-4 mt-5 col-md-6 d-flex"}
>
        <div
          className="card w-100 border-0"
          style={{
            height: "220px",
            borderRadius: "12px",
            boxShadow: "0 1px 6px rgba(0,0,0,.08)",
          }}
        >
          <div className="card-body d-flex flex-column">

            <div className="d-flex justify-content-between align-items-start">

              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#E8FAF8",
                }}
              >
               <i className={`bi ${service.icon}`}></i>
                
              </div>

              <span
                className="badge"
                style={{
                  background: "#ECFDF5",
                  color: "#10B981",
                  fontSize: "10px",
                }}
              >
                {service.seoScore}% SEO
              </span>

            </div>

            <h5
              className="fw-semibold mt-3 mb-2"
              style={{ fontSize: "22px" }}
            >
             {service.title}
            </h5>

            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                minHeight: "48px",
              }}
            >
             {service.description}
            </p>

            <hr className="my-2" />

            <div className="d-flex justify-content-between align-items-center mt-auto">

            <span
  className="badge"
  style={{
    background:
      service.status === "Published"
        ? "#ECFDF5"
        : "#F3F4F6",

    color:
      service.status === "Published"
        ? "#10B981"
        : "#6B7280",

    padding: "6px 10px",
  }}
>
  {service.status.toUpperCase()}
</span>
<div className="d-flex align-items-center gap-3">

  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      handleEditService(service);
    }}
    className="text-decoration-none fw-semibold"
    style={{
      color: "#0D9488",
    }}
  >
    Edit <i className="bi bi-chevron-right"></i>
  </a>

  <i
    className="bi bi-trash"
    style={{
      color: "#EF4444",
      cursor: "pointer",
      fontSize: "17px",
    }}
    onClick={() =>
      handleDeleteService(service._id)
    }
  ></i>

</div>

            </div>

          </div>
        </div>
      </div>

  

 ))}

    </div>
</div> 
  </div>
  {showServiceModal && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background: "rgba(0,0,0,.45)",
      zIndex: 1055,
    }}
  >
    <div
      className="bg-white"
      style={{
        width: "700px",
        borderRadius: "12px",
        padding: "25px",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-semibold mb-0">
          {selectedService ? "Edit Service" : "Add New Service"}
        </h5>

        <button
          className="btn btn-sm"
          onClick={() => setShowServiceModal(false)}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      {/* Service Title */}
      <div className="mb-3">
        <label className="fw-semibold mb-2">
          Service Title
        </label>

        <input
          className="form-control"
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
            })
          }
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="fw-semibold mb-2">
          Description
        </label>

        <textarea
          rows="4"
          className="form-control"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />
      </div>

      <div className="row">

        {/* Icon */}
        <div className="col-md-6 mb-3">

          <label className="fw-semibold mb-2">
            Icon
          </label>

          <select
            className="form-select"
            value={formData.icon}
            onChange={(e) =>
              setFormData({
                ...formData,
                icon: e.target.value,
              })
            }
          >
            <option value="bi-heart-fill">❤️ Heart</option>
            <option value="bi-briefcase-fill">💼 Briefcase</option>
            <option value="bi-gift-fill">🎁 Gift</option>
            <option value="bi-camera-fill">📷 Camera</option>
            <option value="bi-music-note-beamed">🎵 Music</option>
            <option value="bi-star-fill">⭐ Star</option>
          </select>

        </div>

        {/* Status */}
        <div className="col-md-6 mb-3">

          <label className="fw-semibold mb-2">
            Status
          </label>

          <select
            className="form-select"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
          >
            <option>Published</option>
            <option>Draft</option>
          </select>

        </div>

      </div>

      {/* SEO Score */}
      <div className="mb-4">

        <label className="fw-semibold mb-2">
          SEO Score
        </label>

        <input
          type="number"
          className="form-control"
          value={formData.seoScore}
          onChange={(e) =>
            setFormData({
              ...formData,
              seoScore: e.target.value,
            })
          }
        />

      </div>

      <div className="d-flex justify-content-end gap-2">

        <button
          className="btn btn-light"
          onClick={() => setShowServiceModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn"
        onClick={
  selectedService
    ? handleUpdateService
    : handleSaveService
}
          style={{
            background: "#0D9488",
            color: "#fff",
          }}
        >
          {selectedService ? "Update" : "Save"}
        </button>

      </div>

    </div>
  </div>
)}
  </>

    
  );
};

export default ServiceSection;