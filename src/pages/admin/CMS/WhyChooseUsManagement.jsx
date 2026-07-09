import React, { useEffect, useState } from "react";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../services/cmsService";

const WhyChooseUsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [leftImage, setLeftImage] = useState(null);
const [rightImage, setRightImage] = useState(null);

const [preview, setPreview] = useState({
  leftImage: "",
  rightImage: "",
});

const [customerPoints, setCustomerPoints] = useState([""]);
const [businessPoints, setBusinessPoints] = useState([""]);
const [benefitPoints, setBenefitPoints] = useState([""]);

  const [formData, setFormData] = useState({
    badge: "",
    title: "",
    heading: "",
    customerTitle: "",
    businessTitle: "",
    benefitTitle: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCmsSection("why-choose-us");

     if (res.data?.data?.content) {
  const content = res.data.data.content;

  setFormData({
    badge: content.badge || "",
    title: content.title || "",
    heading: content.heading || "",
    customerTitle: content.customerTitle || "",
    businessTitle: content.businessTitle || "",
    benefitTitle: content.benefitTitle || "",
  });

  setPreview({
    leftImage: content.leftImage || "",
    rightImage: content.rightImage || "",
  });

  setCustomerPoints(
    Array.isArray(content.customerPoints)
      ? content.customerPoints
      : JSON.parse(content.customerPoints || "[]")
  );

  setBusinessPoints(
    Array.isArray(content.businessPoints)
      ? content.businessPoints
      : JSON.parse(content.businessPoints || "[]")
  );

  setBenefitPoints(
    Array.isArray(content.benefitPoints)
      ? content.benefitPoints
      : JSON.parse(content.benefitPoints || "[]")
  );
}
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      data.append(
  "customerPoints",
  JSON.stringify(customerPoints)
);

data.append(
  "businessPoints",
  JSON.stringify(businessPoints)
);

data.append(
  "benefitPoints",
  JSON.stringify(benefitPoints)
);

if (leftImage) {
  data.append("leftImage", leftImage);
}

if (rightImage) {
  data.append("rightImage", rightImage);
}

      await updateCmsSection("why-choose-us", data);

      alert("Why Choose Us updated successfully.");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4">Why Choose Us Management</h4>

      <div className="mb-3">
        <label className="form-label">Badge</label>
        <input
          className="form-control"
          name="badge"
          value={formData.badge}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Heading</label>
        <textarea
          rows="3"
          className="form-control"
          name="heading"
          value={formData.heading}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
  <label className="form-label">Left Image</label>

  <input
    type="file"
    className="form-control"
    onChange={(e) => setLeftImage(e.target.files[0])}
  />

  {preview.leftImage && (
    <img
      src={preview.leftImage}
      width="120"
      className="mt-2 rounded"
      alt=""
    />
  )}
</div>

<div className="mb-4">
  <label className="form-label">Right Image</label>

  <input
    type="file"
    className="form-control"
    onChange={(e) => setRightImage(e.target.files[0])}
  />

  {preview.rightImage && (
    <img
      src={preview.rightImage}
      width="120"
      className="mt-2 rounded"
      alt=""
    />
  )}
</div>
<h5 className="mb-3">Customer Section</h5>

<div className="mb-3">
  <label>Customer Title</label>

  <input
    className="form-control"
    name="customerTitle"
    value={formData.customerTitle}
    onChange={handleChange}
  />
</div>

{customerPoints.map((item, index) => (
  <div className="d-flex mb-2" key={index}>
    <input
      className="form-control"
      value={item}
      onChange={(e) => {
        const updated = [...customerPoints];
        updated[index] = e.target.value;
        setCustomerPoints(updated);
      }}
    />

    <button
      className="btn btn-danger ms-2"
      type="button"
      onClick={() =>
        setCustomerPoints(customerPoints.filter((_, i) => i !== index))
      }
    >
      Remove
    </button>
  </div>
))}

<button
  className="btn btn-success mb-4"
  type="button"
  onClick={() => setCustomerPoints([...customerPoints, ""])}
>
  + Add Customer Point
</button>
<h5 className="mb-3">Business Section</h5>

<div className="mb-3">
  <label>Business Title</label>

  <input
    className="form-control"
    name="businessTitle"
    value={formData.businessTitle}
    onChange={handleChange}
  />
</div>

{businessPoints.map((item, index) => (
  <div className="d-flex mb-2" key={index}>
    <input
      className="form-control"
      value={item}
      onChange={(e) => {
        const updated = [...businessPoints];
        updated[index] = e.target.value;
        setBusinessPoints(updated);
      }}
    />

    <button
      className="btn btn-danger ms-2"
      type="button"
      onClick={() =>
        setBusinessPoints(businessPoints.filter((_, i) => i !== index))
      }
    >
      Remove
    </button>
  </div>
))}

<button
  className="btn btn-success mb-4"
  type="button"
  onClick={() => setBusinessPoints([...businessPoints, ""])}
>
  + Add Business Point
</button>
<h5 className="mb-3">Benefits Section</h5>

<div className="mb-3">
  <label>Benefits Title</label>

  <input
    className="form-control"
    name="benefitTitle"
    value={formData.benefitTitle}
    onChange={handleChange}
  />
</div>

{benefitPoints.map((item, index) => (
  <div className="d-flex mb-2" key={index}>
    <input
      className="form-control"
      value={item}
      onChange={(e) => {
        const updated = [...benefitPoints];
        updated[index] = e.target.value;
        setBenefitPoints(updated);
      }}
    />

    <button
      className="btn btn-danger ms-2"
      type="button"
      onClick={() =>
        setBenefitPoints(benefitPoints.filter((_, i) => i !== index))
      }
    >
      Remove
    </button>
  </div>
))}

<button
  className="btn btn-success mb-4"
  type="button"
  onClick={() => setBenefitPoints([...benefitPoints, ""])}
>
  + Add Benefit Point
</button>

      <button
        className="btn btn-primary"
        disabled={loading}
        onClick={handleSave}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default WhyChooseUsManagement;