import { useState, useEffect } from "react";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../services/cmsService";

const ContactManagement = () => {
  const [contactData, setContactData] = useState({
    heroTitle: "",
    heroDescription: "",
    companyName: "",
    address: "",
    phone: "",
    email: "",
    businessHours: "",
    whatsappNumber: "",
  });
useEffect(() => {
  fetchContactData();
}, []);

const fetchContactData = async () => {
  try {
    const res = await getCmsSection("contact");

    console.log("Contact Data:", res.data);
    console.log(res.data.data.content);

    if (res.data?.data?.content) {
  setContactData(res.data.data.content);
}
  } catch (error) {
    console.log(error);
  }
};

  const handleChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };
const handleSave = async () => {
  try {
    const res = await updateCmsSection(
      "contact",
      contactData
    );

    alert(res.data.message);
  } catch (error) {
    console.log(error);
  }
};
  return (
    <div>
      <h4 className="mb-4">Contact Page Management</h4>

      <div className="mb-3">
        <label className="form-label fw-bold">
          Hero Title
        </label>
        <input
          type="text"
          name="heroTitle"
          value={contactData.heroTitle}
          onChange={handleChange}
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
          value={contactData.heroDescription}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <hr />

      <div className="mb-3">
        <label className="form-label fw-bold">
          Company Name
        </label>
        <input
          type="text"
          name="companyName"
          value={contactData.companyName}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">
          Address
        </label>
        <textarea
          rows="2"
          name="address"
          value={contactData.address}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={contactData.phone}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={contactData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">
          Business Hours
        </label>
        <input
          type="text"
          name="businessHours"
          value={contactData.businessHours}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-bold">
          WhatsApp Number
        </label>
        <input
          type="text"
          name="whatsappNumber"
          value={contactData.whatsappNumber}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <button
        className="btn btn-primary px-4"
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  );
};

export default ContactManagement;