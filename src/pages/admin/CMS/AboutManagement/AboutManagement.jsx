import React, { useState, useEffect } from "react";
import LocationManagement from "./LocationManagement";
import TeamManagement from "./TeamManagement";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../../services/cmsService";

const AboutManagement = () => {
  const [members, setMembers] = useState([
  {
    id: 1,
    name: "",
    role: "",
  },
]);
const [locations, setLocations] = useState([
  {
    id: 1,
    city: "",
  },
]);
  const [formData, setFormData] = useState({
    heroTitle: "",
    heroDescription: "",

    companyImage: "",
    companyTitle: "",
    companyDescription1: "",
    companyDescription2: "",

    missionTitle: "",
    missionDescription: "",
    visionTitle: "",
    visionDescription: "",

    experienceImage: "",
    experienceTitle: "",
    experienceDescription1: "",
    experienceDescription2: "",

    eventsCompleted: "",
    happyClients: "",
    eventPartners: "",
    yearsExperience: "",
  });
useEffect(() => {
  fetchAboutData();
}, []);

const fetchAboutData = async () => {
  try {
    const res = await getCmsSection("about");

    console.log("About Data:", res.data);

    if (res.data?.data?.content) {
      const data = res.data.data.content;

      setFormData({
        ...formData,
        ...data,
      });

      setMembers(
        data.teamMembers?.length
          ? data.teamMembers
          : [{ id: 1, name: "", role: "" }]
      );

      setLocations(
        data.locations?.length
          ? data.locations
          : [{ id: 1, city: "" }]
      );
    }
  } catch (error) {
    console.log(error);
  }
};
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async () => {
  try {
    const payload = {
      ...formData,
      teamMembers: members,
      locations: locations,
    };

    await updateCmsSection("about", payload);

    alert("About Page Updated Successfully");
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="container-fluid">

      <div className="text-center mb-4">
        <h3 className="fw-bold text-primary">
          About Us Content Management
        </h3>
        <p className="text-muted">
          Manage all About Page content from here
        </p>
      </div>

      {/* Hero Section */}
      <div className="card shadow-sm border-0 mb-4">
         <div className="card-header bg-secondary text-white">
          Hero Section
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">
              Hero Title
            </label>

            <input
              type="text"
              className="form-control"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">
              Hero Description
            </label>

            <textarea
              rows="3"
              className="form-control"
              name="heroDescription"
              value={formData.heroDescription}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Company Overview */}
      <div className="card shadow-sm border-0 mb-4">
         <div className="card-header bg-secondary text-white">
          Company Overview
        </div>

        <div className="card-body">

          <div className="mb-3">
            <label className="form-label">
              Company Title
            </label>

            <input
              type="text"
              className="form-control"
              name="companyTitle"
              value={formData.companyTitle}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Description 1
            </label>

            <textarea
              rows="4"
              className="form-control"
              name="companyDescription1"
              value={formData.companyDescription1}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">
              Description 2
            </label>

            <textarea
              rows="4"
              className="form-control"
              name="companyDescription2"
              value={formData.companyDescription2}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-secondary text-white">
          Mission & Vision
        </div>

        <div className="card-body">

          <div className="mb-3">
            <label className="form-label">
              Mission Title
            </label>

            <input
              type="text"
              className="form-control"
              name="missionTitle"
              value={formData.missionTitle}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              Mission Description
            </label>

            <textarea
              rows="3"
              className="form-control"
              name="missionDescription"
              value={formData.missionDescription}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Vision Title
            </label>

            <input
              type="text"
              className="form-control"
              name="visionTitle"
              value={formData.visionTitle}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">
              Vision Description
            </label>

            <textarea
              rows="3"
              className="form-control"
              name="visionDescription"
              value={formData.visionDescription}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="card shadow-sm border-0 mb-4">
         <div className="card-header bg-secondary text-white">
          Experience & Expertise
        </div>

        <div className="card-body">

          <div className="mb-3">
            <label className="form-label">
              Experience Title
            </label>

            <input
              type="text"
              className="form-control"
              name="experienceTitle"
              value={formData.experienceTitle}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Description 1
            </label>

            <textarea
              rows="4"
              className="form-control"
              name="experienceDescription1"
              value={formData.experienceDescription1}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">
              Description 2
            </label>

            <textarea
              rows="4"
              className="form-control"
              name="experienceDescription2"
              value={formData.experienceDescription2}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-secondary text-white">
          Team Members
        </div>
        <div className="card-body">
          <TeamManagement
        members={members}
        setMembers={setMembers}
      />
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-secondary text-white">
          Service Locations
        </div>
        <div className="card-body">
         <LocationManagement
            locations={locations}
            setLocations={setLocations}
          />
        </div>
      </div>

     

      <div className="text-end">
        <button
          className="btn btn-primary px-5 py-2"
          onClick={handleSubmit}
        >
          Save About Page
        </button>
      </div>

    </div>
  );
};

export default AboutManagement;