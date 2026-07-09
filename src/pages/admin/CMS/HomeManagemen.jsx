import React, { useEffect, useState } from "react";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../services/cmsService";

const HomeManagement = () => {
  const [loading, setLoading] = useState(false);

 const [formData, setFormData] = useState({
  badgeText: "",
  bannerTitle: "",
  bannerDescription: "",
  button1: "",
  button2: "",
  welcomeMessage: "",
  phoneNumber: "",
});

  const [heroImage1, setHeroImage1] = useState(null);
  const [heroImage2, setHeroImage2] = useState(null);
  const [heroImage3, setHeroImage3] = useState(null);

  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");
const removeImage1 = () => {
  setHeroImage1(null);
  setPreview1("");
};

const removeImage2 = () => {
  setHeroImage2(null);
  setPreview2("");
};

const removeImage3 = () => {
  setHeroImage3(null);
  setPreview3("");
};
  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const res = await getCmsSection("home");

      if (res.data?.data?.content) {
        const content = res.data.data.content;

        setFormData({
  badgeText: content.badgeText || "",
  bannerTitle: content.bannerTitle || "",
  bannerDescription: content.bannerDescription || "",
  button1: content.button1 || "",
  button2: content.button2 || "",
  welcomeMessage: content.welcomeMessage || "",
  phoneNumber: content.phoneNumber || "",
});

        setPreview1(content.heroImage1 || "");
        setPreview2(content.heroImage2 || "");
        setPreview3(content.heroImage3 || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage1Change = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setHeroImage1(file);
    setPreview1(URL.createObjectURL(file));
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setHeroImage2(file);
    setPreview2(URL.createObjectURL(file));
  };

  const handleImage3Change = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setHeroImage3(file);
    setPreview3(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      data.append("badgeText", formData.badgeText);
      data.append("bannerTitle", formData.bannerTitle);
      data.append("bannerDescription", formData.bannerDescription);

      data.append("button1", formData.button1);


      data.append("button2", formData.button2);


      data.append("welcomeMessage", formData.welcomeMessage);

      data.append("phoneNumber", formData.phoneNumber);

      if (heroImage1) {
        data.append("heroImage1", heroImage1);
      }

      if (heroImage2) {
        data.append("heroImage2", heroImage2);
      }

      if (heroImage3) {
        data.append("heroImage3", heroImage3);
      }
        if (!preview1) {
          data.append("removeHeroImage1", "true");
        }

        if (!preview2) {
          data.append("removeHeroImage2", "true");
        }

        if (!preview3) {
          data.append("removeHeroImage3", "true");
        }

      await updateCmsSection("home", data);

      alert("Home page content updated successfully");

      fetchHomeContent();
    } catch (error) {
      console.error(error);
      alert("Failed to update home page content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4">
        Home Page Management
      </h4>
      <div className="mb-3">
  <label className="form-label fw-bold">
    Badge Text
  </label>
  <input
    type="text"
    name="badgeText"
    value={formData.badgeText}
    onChange={handleChange}
    className="form-control"
  />
</div>

      {/* Banner Title */}
      <div className="mb-3">
        <label className="form-label fw-bold">
          Banner Title
        </label>
        <input
          type="text"
          name="bannerTitle"
          value={formData.bannerTitle}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      {/* Banner Description */}
      <div className="mb-3">
        <label className="form-label fw-bold">
          Banner Description
        </label>
        <textarea
          rows="4"
          name="bannerDescription"
          value={formData.bannerDescription}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      {/* Buttons */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold">
            Primary Button Text
          </label>
          <input
            type="text"
            name="button1"
            value={formData.button1}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold">
            Secondary Button Text
          </label>
          <input
            type="text"
            name="button2"
            value={formData.button2}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mb-4">
        <label className="form-label fw-bold">
          Welcome Message
        </label>
        <textarea
          rows="3"
          name="welcomeMessage"
          value={formData.welcomeMessage}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-4">
  <label className="form-label fw-bold">
    Phone Number
  </label>
  <input
    type="text"
    name="phoneNumber"
    value={formData.phoneNumber}
    onChange={handleChange}
    className="form-control"
  />
</div>

      {/* Hero Image 1 */}
      <div className="mb-4">
        <label className="form-label fw-bold">
          Hero Image 1
        </label>

        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleImage1Change}
        />

       {preview1 && (
        <>
          <img
            src={preview1}
            alt="Hero 1"
            className="mt-3"
            style={{
              width: "220px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />

          <button
            type="button"
            className="btn btn-danger btn-sm mt-2 d-block"
            onClick={removeImage1}
          >
            Remove Image
          </button>
        </>
      )}
      </div>

      {/* Hero Image 2 */}
      <div className="mb-4">
        <label className="form-label fw-bold">
          Hero Image 2
        </label>

        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleImage2Change}
        />

        {preview2 && (
          <>
            <img
              src={preview2}
              alt="Hero 2"
              className="mt-3"
              style={{
                width: "220px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />

            <button
              type="button"
              className="btn btn-danger btn-sm mt-2 d-block"
              onClick={removeImage1}
            >
              Remove Image
            </button>
          </>
        )}
      </div>

      {/* Hero Image 3 */}
      <div className="mb-4">
        <label className="form-label fw-bold">
          Hero Image 3
        </label>

        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleImage3Change}
        />
          {preview3 && (
          <>
            <img
              src={preview3}
              alt="Hero 3"
              className="mt-3"
              style={{
                width: "220px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />

            <button
              type="button"
              className="btn btn-danger btn-sm mt-2 d-block"
              onClick={removeImage1}
            >
              Remove Image
            </button>
          </>
        )}

      </div>

      <button
        className="btn btn-primary px-4"
        onClick={handleSave}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Save Changes"}
      </button>
    </div>
  );
};

export default HomeManagement;