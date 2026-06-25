import { useEffect, useState } from "react";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../services/cmsService";

const VisibilityManagement = () => {
    const [visibility, setVisibility] = useState({
    home: {
      hero: true,
      about: true,
      services: true,
      gallery: true,
      testimonials: false,
      faq: true,
      contact: true,
    },
  });

  useEffect(() => {
    fetchVisibility();
  }, []);

  const fetchVisibility = async () => {
    try {
      const res = await getCmsSection("visibility");

      if (res.data?.data?.content) {
        setVisibility(res.data.data.content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = (page, section) => {
  setVisibility((prev) => ({
    ...prev,
    [page]: {
      ...prev[page],
      [section]: !prev[page][section],
    },
  }));
};
const handleSave = async () => {
  try {
    await updateCmsSection(
      "visibility",
      visibility
    );

    alert("Visibility settings updated");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div>
      <h4>Homepage Section Visibility</h4>

      <div className="form-check form-switch mb-2">
        <input
  className="form-check-input"
  type="checkbox"
  checked={visibility.home.about}
  onChange={() => handleToggle("home", "about")}
/>
        <label className="form-check-label">About Us</label>
      </div>

      <div className="form-check form-switch mb-2">
        <input
  className="form-check-input"
  type="checkbox"
  checked={visibility.home.services}
  onChange={() => handleToggle("home", "services")}
/>
        <label className="form-check-label">Services</label>
      </div>

      <div className="form-check form-switch mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={visibility.home.gallery}
          onChange={() => handleToggle("home", "gallery")}
        />
        <label className="form-check-label">Gallery</label>
      </div>

      <div className="form-check form-switch mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={visibility.home.contact}
          onChange={() => handleToggle("home", "contact")}
        />
        <label className="form-check-label">Contact Us</label>
      </div>

      <div className="form-check form-switch mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={visibility.home.pricing}
          onChange={() => handleToggle("home", "pricing")}
        />
        <label className="form-check-label">Pricing</label>
      </div>

      <button
        className="btn btn-primary mt-3"
        onClick={handleSave}
        >
        Save Changes
        </button>
    </div>
  );
};

export default VisibilityManagement;