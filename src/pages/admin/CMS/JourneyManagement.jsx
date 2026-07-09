import React, { useEffect, useState } from "react";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../services/cmsService";

const JourneyManagement = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    badge: "",
    title: "",
    description: "",
    feature1: "",
    feature2: "",
    feature3: "",
    feature4: "",
  });

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
const [preview4, setPreview4] = useState("");

  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");

  useEffect(() => {
    fetchJourneyContent();
  }, []);

  const fetchJourneyContent = async () => {
    try {
      const res = await getCmsSection("journey");

      if (res.data?.data?.content) {
        const content = res.data.data.content;

        setFormData({
          badge: content.badge || "",
          title: content.title || "",
          description: content.description || "",
          feature1: content.feature1 || "",
          feature2: content.feature2 || "",
          feature3: content.feature3 || "",
          feature4: content.feature4 || "",
        });

        setPreview1(content.image1 || "");
        setPreview2(content.image2 || "");
        setPreview3(content.image3 || "");
        setPreview4(content.image4 || "");
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

  const handleImage = (e, setImage, setPreview) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = (setImage, setPreview) => {
    setImage(null);
    setPreview("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (image1) data.append("image1", image1);
      if (image2) data.append("image2", image2);
      if (image3) data.append("image3", image3);
      

      if (!preview1) data.append("removeImage1", "true");
      if (!preview2) data.append("removeImage2", "true");
      if (!preview3) data.append("removeImage3", "true");
      if (image4) data.append("image4", image4);

if (!preview4) data.append("removeImage4", "true");

      await updateCmsSection("journey", data);

      alert("Journey section updated successfully.");

      fetchJourneyContent();
    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4">Journey Section Management</h4>

      <div className="mb-3">
        <label className="form-label fw-bold">Badge</label>
        <input
          className="form-control"
          name="badge"
          value={formData.badge}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Title</label>
        <input
          className="form-control"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Description</label>
        <textarea
          rows="4"
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <h5 className="mt-4 mb-3">Features</h5>

      <input
        className="form-control mb-2"
        name="feature1"
        placeholder="Feature 1"
        value={formData.feature1}
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        name="feature2"
        placeholder="Feature 2"
        value={formData.feature2}
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        name="feature3"
        placeholder="Feature 3"
        value={formData.feature3}
        onChange={handleChange}
      />

      <input
        className="form-control mb-4"
        name="feature4"
        placeholder="Feature 4"
        value={formData.feature4}
        onChange={handleChange}
      />

      {[1, 2, 3, 4].map((num) => {
       const imageSetter =
        num === 1
            ? setImage1
            : num === 2
            ? setImage2
            : num === 3
            ? setImage3
            : setImage4;

        const previewSetter =
  num === 1
    ? setPreview1
    : num === 2
    ? setPreview2
    : num === 3
    ? setPreview3
    : setPreview4;

        const preview =
  num === 1
    ? preview1
    : num === 2
    ? preview2
    : num === 3
    ? preview3
    : preview4;

        return (
          <div className="mb-4" key={num}>
            <label className="form-label fw-bold">
              Image {num}
            </label>

            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) =>
                handleImage(e, imageSetter, previewSetter)
              }
            />

            {preview && (
              <>
                <img
                  src={preview}
                  alt=""
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
                  className="btn btn-danger btn-sm d-block mt-2"
                  onClick={() =>
                    removeImage(imageSetter, previewSetter)
                  }
                >
                  Remove Image
                </button>
              </>
            )}
          </div>
        );
      })}

      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default JourneyManagement;