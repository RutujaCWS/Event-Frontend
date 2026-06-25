import React, { useState, useEffect } from "react";
import {
  getCmsSection,
  updateLogo,
} from "../../../services/cmsService";

const LogoManagement = () => {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const res = await getCmsSection("logo");

      if (res.data?.data?.content?.logo) {
        setPreview(res.data.data.content.logo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      if (!logo) {
        alert("Please select a logo");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("logo", logo);

      await updateLogo(formData);

      alert("Logo uploaded successfully");

      setLogo(null);

      fetchLogo();
    } catch (error) {
      console.log(error);
      alert("Failed to upload logo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4">
        Company Logo Management
      </h4>

      <div className="mb-3">
        <label className="form-label">
          Upload Logo
        </label>

        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>

      {preview && (
        <div className="mb-4">
          <label className="form-label d-block">
            Preview
          </label>

          <img
            src={preview}
            alt="Logo Preview"
            style={{
              maxWidth: "250px",
              maxHeight: "120px",
              objectFit: "contain",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "10px",
            }}
          />
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Save Logo"}
      </button>
    </div>
  );
};

export default LogoManagement;