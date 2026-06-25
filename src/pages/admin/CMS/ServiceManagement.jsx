import React, { useState, useEffect } from "react";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../services/cmsService";

const ServiceManagement = () => {
 const [serviceData, setServiceData] = useState({
  serviceType: "",
  title: "",
  overview: "",
  price: "",
  inclusions: [""],
  addons: [""],
  process: [""],
});

const [savedData, setSavedData] = useState(null);

useEffect(() => {
  if (serviceData.serviceType) {
    fetchServiceData();
  }
}, [serviceData.serviceType]);

const fetchServiceData = async (
  serviceType = serviceData.serviceType
) => {
  console.log("Selected Service Type:", serviceType);

  try {
    const res = await getCmsSection(serviceType);

    console.log("API Response:", res);

    if (res.data.data?.content) {
      const content = res.data.data.content;

      console.log("Content Data:", content);

      setServiceData((prev) => ({
        ...prev,
        title: content.title || "",
        overview: content.overview || "",
        price: content.price || "",
        inclusions: content.inclusions || [""],
        addons: content.addons || [""],
        process: content.process || [""],
        
      }));

      setSavedData(content);
    }
  } catch (error) {
    console.log("API Error:", error);
    console.log(
      "Failed Service Type:",
      serviceType
    );
  }
};

  const handleChange = (e) => {
    setServiceData({
      ...serviceData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayChange = (
    section,
    index,
    value
  ) => {
    const updated = [
      ...serviceData[section],
    ];

    updated[index] = value;

    setServiceData({
      ...serviceData,
      [section]: updated,
    });
  };

  const addField = (section) => {
    setServiceData({
      ...serviceData,
      [section]: [
        ...serviceData[section],
        "",
      ],
    });
  };

  const removeField = (
    section,
    index
  ) => {
    const updated =
      serviceData[section].filter(
        (_, i) => i !== index
      );

    setServiceData({
      ...serviceData,
      [section]: updated.length
        ? updated
        : [""],
    });
  };

 const handleSubmit = async () => {
  try {
    await updateCmsSection(
      serviceData.serviceType,
      {
        title: serviceData.title,
        overview: serviceData.overview,
        price: serviceData.price,
        inclusions: serviceData.inclusions,
        addons: serviceData.addons,
        process: serviceData.process,
        
      }
    );

    setSavedData({
      title: serviceData.title,
      overview: serviceData.overview,
      price: serviceData.price,
      inclusions: serviceData.inclusions,
      addons: serviceData.addons,
      process: serviceData.process,
      
    });

    alert(
      "Service content saved successfully"
    );
  } catch (error) {
    console.log(error);
    alert("Failed to save content");
  }
};

  const renderDynamicFields = (
    label,
    section,
    buttonText
  ) => (
    <div className="mb-4">
      <label className="form-label fw-bold">
        {label}
      </label>

      {serviceData[section].map(
        (item, index) => (
          <div
            key={index}
            className="d-flex gap-2 mb-2"
          >
            <input
              type="text"
              className="form-control"
              value={item}
              onChange={(e) =>
                handleArrayChange(
                  section,
                  index,
                  e.target.value
                )
              }
            />

            <button
              type="button"
              className="btn btn-danger"
              onClick={() =>
                removeField(
                  section,
                  index
                )
              }
            >
              -
            </button>
          </div>
        )
      )}

      <button
        type="button"
        className="btn btn-success"
        onClick={() =>
          addField(section)
        }
      >
        {buttonText}
      </button>
    </div>
  );

  return (
    <div>
      <h4 className="mb-4">
        Services Management
      </h4>

      <div className="mb-3">
        <label className="form-label">
          Service Type
        </label>

        <select
          className="form-select"
          name="serviceType"
          value={
            serviceData.serviceType
          }
          onChange={handleChange}
        >
          <option value="">
            Select Service
          </option>

          <option value="wedding-events">
            Wedding Events
          </option>

          <option value="birthday-events">
            Birthday Events
          </option>

          <option value="corporate-events">
            Corporate Events
          </option>

          <option value="religious-events">
            Religious & Cultural
            Events
          </option>

          <option value="custom-events">
            Custom Events
          </option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Title
        </label>

        <input
          type="text"
          name="title"
          className="form-control"
          value={serviceData.title}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Overview
        </label>

        <textarea
          rows="4"
          name="overview"
          className="form-control"
          value={serviceData.overview}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Starting Price
        </label>

        <input
          type="text"
          name="price"
          className="form-control"
          value={serviceData.price}
          onChange={handleChange}
        />
      </div>

      {renderDynamicFields(
        "Inclusions",
        "inclusions",
        "+ Add Inclusion"
      )}

      {renderDynamicFields(
        "Add-ons",
        "addons",
        "+ Add Add-on"
      )}

      {renderDynamicFields(
        "Event Process",
        "process",
        "+ Add Step"
      )}


      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={
          !serviceData.serviceType
        }
      >
        Save Service Content
      </button>

      {savedData && (
  <div className="card mt-5">
    <div className="card-header">
      <h5>Saved Service Preview</h5>
    </div>

    <div className="card-body">
      <h3>{savedData.title}</h3>

      <p>
        <strong>Overview:</strong>{" "}
        {savedData.overview}
      </p>

      <p>
        <strong>Starting Price:</strong>{" "}
        {savedData.price}
      </p>

      <h5>Inclusions</h5>
      <ul>
        {savedData.inclusions.map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
      </ul>

      <h5>Add-ons</h5>
      <ul>
        {savedData.addons.map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
      </ul>

      <h5>Event Process</h5>
      <ol>
        {savedData.process.map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
      </ol>

    
    </div>
  </div>
)}
    </div>
    
  );
};

export default ServiceManagement;