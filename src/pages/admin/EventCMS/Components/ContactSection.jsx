import React, { useEffect, useState } from "react";

import {
  getContact,
  updateContact,
} from "../../../../services/contactService";

const ContactSection = () => {
  const [formData, setFormData] = useState({
  address: "",
  phone: "",
  email: "",
  workingHours: "",
  mapLink: "",
});

const loadContact = async () => {
  try {
    const res = await getContact();

    if (res.data.success && res.data.data) {
      setFormData(res.data.data);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadContact();
}, []);

const handleSave = async () => {
  try {
    const res = await updateContact(formData);

    if (res.data.success) {
      alert("Contact Updated Successfully");
      loadContact();
    }
  } catch (error) {
    console.log(error);
  }
};


  return (
    <>
 
  {/* Right Side */}

    
  <div
    className="card w-100 border-0 mt-2"
    style={{
      height: "520px",
      borderRadius: "12px",
      boxShadow: "0 1px 6px rgba(0,0,0,.08)",
      marginTop:"55px"
      
    }}
  >
    <div className="card-body d-flex flex-column">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div className="d-flex align-items-center">

          <i
            className="bi bi-camera"
            style={{
              color: "#0D9488",
              fontSize: "18px",
            }}
          ></i>

          <h6
            className="mb-0 ms-2 fw-semibold"
            style={{
              fontSize: "18px",
            }}
          >
            Contact Update
          </h6>

        </div>

      <i
  className="bi bi-arrow-clockwise"
  onClick={loadContact}
  style={{
    cursor: "pointer",
    fontSize: "18px",
  }}
></i>

      </div>

      {/* Email & Phone */}

      <div className="row">

        <div className="col-md-6 mb-3">

          <label
            className="fw-semibold mb-2"
            style={{
              fontSize: "11px",
            }}
          >
            ENQUIRY EMAIL
          </label>

      <input
  type="email"
  className="form-control"
  value={formData.email}
  onChange={(e) =>
    setFormData({
      ...formData,
      email: e.target.value,
    })
  }
  style={{
    height: "38px",
    fontSize: "14px",
    background: "#F9FAFB",
  }}
/>
          

        </div>

        <div className="col-md-6 mb-3">

          <label
            className="fw-semibold mb-2"
            style={{
              fontSize: "11px",
            }}
          >
            SUPPORT PHONE
          </label>

       <input
  type="text"
  className="form-control"
  value={formData.phone}
  onChange={(e) =>
    setFormData({
      ...formData,
      phone: e.target.value,
    })
  }
  style={{
    height: "38px",
    fontSize: "14px",
    background: "#F9FAFB",
  }}
/>

        </div>

      </div>

      {/* Address */}

      <div className="mb-4">

        <label
          className="fw-semibold mb-2"
          style={{
            fontSize: "11px",
          }}
        >
          HEAD QUARTER ADDRESS
        </label>

      <textarea
  className="form-control"
  rows={3}
  value={formData.address}
  onChange={(e) =>
    setFormData({
      ...formData,
      address: e.target.value,
    })
  }
  style={{
    resize: "none",
    background: "#F9FAFB",
  }}
/>
<div className="mb-3">

  <label
    className="fw-semibold mb-2"
    style={{
      fontSize: "11px",
    }}
  >
    WORKING HOURS
  </label>

  <input
    type="text"
    className="form-control"
    value={formData.workingHours}
    onChange={(e) =>
      setFormData({
        ...formData,
        workingHours: e.target.value,
      })
    }
    placeholder="Mon - Sat : 9:00 AM - 7:00 PM"
    style={{
      height: "38px",
      fontSize: "14px",
      background: "#F9FAFB",
    }}
  />

</div>

<div className="mb-4">

  <label
    className="fw-semibold mb-2"
    style={{
      fontSize: "11px",
    }}
  >
    GOOGLE MAP LINK
  </label>

  <input
    type="text"
    className="form-control"
    value={formData.mapLink}
    onChange={(e) =>
      setFormData({
        ...formData,
        mapLink: e.target.value,
      })
    }
    placeholder="https://maps.google.com/..."
    style={{
      height: "38px",
      fontSize: "14px",
      background: "#F9FAFB",
    }}
  />

</div>
      </div>

      {/* Bottom Button */}

      <div className="mt-auto">

       <button
  className="btn w-100"
  onClick={handleSave}
  style={{
    height: "42px",
    background: "#0D9488",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
    marginBottom:"35px"
  }}
>
  Update Site Information
</button>

      </div>

    </div>
  </div>




 </>

  );
};

export default ContactSection;