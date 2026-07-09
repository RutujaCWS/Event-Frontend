import React, { useEffect, useState } from "react";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../services/cmsService";

const ProblemSolutionManagement = () => {
  const [loading, setLoading] = useState(false);

  const [problemData, setProblemData] = useState({
    badge: "",
    title: "",
    description: "",
    point1: "",
    point2: "",
    point3: "",
    point4: "",
    point5: "",
    point6: "",
  });
  const [solutionData, setSolutionData] = useState({
  badge: "",
  title: "",
  description: "",
  feature1: "",
  feature2: "",
  feature3: "",
  feature4: "",
});

const [solutionImage, setSolutionImage] = useState(null);
const [solutionPreview, setSolutionPreview] = useState("");

  const [problemImage, setProblemImage] = useState(null);
  const [problemPreview, setProblemPreview] = useState("");

  useEffect(() => {
    fetchProblemSection();
    fetchSolutionSection();
  }, []);

  const fetchProblemSection = async () => {
    try {
      const res = await getCmsSection("problem");

      if (res.data?.data?.content) {
        const content = res.data.data.content;

        setProblemData({
          badge: content.badge || "",
          title: content.title || "",
          description: content.description || "",
          point1: content.point1 || "",
          point2: content.point2 || "",
          point3: content.point3 || "",
          point4: content.point4 || "",
          point5: content.point5 || "",
          point6: content.point6 || "",
        });

        setProblemPreview(content.image || "");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSolutionSection = async () => {
  try {
    const res = await getCmsSection("solution");

    if (res.data?.data?.content) {
      const content = res.data.data.content;

      setSolutionData({
        badge: content.badge || "",
        title: content.title || "",
        description: content.description || "",
        feature1: content.feature1 || "",
        feature2: content.feature2 || "",
        feature3: content.feature3 || "",
        feature4: content.feature4 || "",
      });

      setSolutionPreview(content.image || "");
    }
  } catch (error) {
    console.log(error);
  }
};
const handleSolutionChange = (e) => {
  setSolutionData({
    ...solutionData,
    [e.target.name]: e.target.value,
  });
};
const handleSolutionImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setSolutionImage(file);
  setSolutionPreview(URL.createObjectURL(file));
};

const removeSolutionImage = () => {
  setSolutionImage(null);
  setSolutionPreview("");
};
const handleSaveSolution = async () => {
  try {
    setLoading(true);

    const data = new FormData();

    Object.keys(solutionData).forEach((key) => {
      data.append(key, solutionData[key]);
    });

    if (solutionImage) {
      data.append("solutionImage", solutionImage);
    }

    if (!solutionPreview) {
      data.append("removeSolutionImage", "true");
    }

    await updateCmsSection("solution", data);

    alert("Solution section updated successfully.");

    fetchSolutionSection();
  } catch (error) {
    console.log(error);
    alert("Update Failed");
  } finally {
    setLoading(false);
  }
};

  const handleProblemChange = (e) => {
    setProblemData({
      ...problemData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProblemImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProblemImage(file);
    setProblemPreview(URL.createObjectURL(file));
  };

  const removeProblemImage = () => {
    setProblemImage(null);
    setProblemPreview("");
  };

  const handleSaveProblem = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(problemData).forEach((key) => {
        data.append(key, problemData[key]);
      });

      if (problemImage) {
        data.append("problemImage", problemImage);
      }

      if (!problemPreview) {
        data.append("removeProblemImage", "true");
      }

      await updateCmsSection("problem", data);

      alert("Problem section updated successfully.");

      fetchProblemSection();
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h4 className="mb-4">Problem Section Management</h4>

      <div className="mb-3">
        <label className="form-label fw-bold">Badge</label>
        <input
          className="form-control"
          name="badge"
          value={problemData.badge}
          onChange={handleProblemChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Title</label>
        <input
          className="form-control"
          name="title"
          value={problemData.title}
          onChange={handleProblemChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Description</label>
        <textarea
          rows="4"
          className="form-control"
          name="description"
          value={problemData.description}
          onChange={handleProblemChange}
        />
      </div>

      <h5 className="mt-4 mb-3">Problem Points</h5>

      <input
        className="form-control mb-2"
        placeholder="Problem Point 1"
        name="point1"
        value={problemData.point1}
        onChange={handleProblemChange}
      />

      <input
        className="form-control mb-2"
        placeholder="Problem Point 2"
        name="point2"
        value={problemData.point2}
        onChange={handleProblemChange}
      />

      <input
        className="form-control mb-2"
        placeholder="Problem Point 3"
        name="point3"
        value={problemData.point3}
        onChange={handleProblemChange}
      />

      <input
        className="form-control mb-2"
        placeholder="Problem Point 4"
        name="point4"
        value={problemData.point4}
        onChange={handleProblemChange}
      />

      <input
        className="form-control mb-2"
        placeholder="Problem Point 5"
        name="point5"
        value={problemData.point5}
        onChange={handleProblemChange}
      />

      <input
        className="form-control mb-4"
        placeholder="Problem Point 6"
        name="point6"
        value={problemData.point6}
        onChange={handleProblemChange}
      />

      <div className="mb-4">
        <label className="form-label fw-bold">
          Problem Image
        </label>

        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleProblemImage}
        />

        {problemPreview && (
          <>
            <img
              src={problemPreview}
              alt=""
              className="mt-3"
              style={{
                width: "250px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />

            <button
              type="button"
              className="btn btn-danger btn-sm d-block mt-2"
              onClick={removeProblemImage}
            >
              Remove Image
            </button>
          </>
        )}
      </div>

      <button
        className="btn btn-primary"
        disabled={loading}
        onClick={handleSaveProblem}
      >
        {loading ? "Saving..." : "Save Problem Section"}
      </button>


        <hr className="my-5" />

<h4 className="mb-4">Solution Section Management</h4>

<div className="mb-3">
  <label className="form-label fw-bold">Badge</label>
  <input
    className="form-control"
    name="badge"
    value={solutionData.badge}
    onChange={handleSolutionChange}
  />
</div>

<div className="mb-3">
  <label className="form-label fw-bold">Title</label>
  <input
    className="form-control"
    name="title"
    value={solutionData.title}
    onChange={handleSolutionChange}
  />
</div>

<div className="mb-3">
  <label className="form-label fw-bold">Description</label>
  <textarea
    rows="4"
    className="form-control"
    name="description"
    value={solutionData.description}
    onChange={handleSolutionChange}
  />
</div>

<h5 className="mt-4 mb-3">Features</h5>

<input
  className="form-control mb-2"
  placeholder="Feature 1"
  name="feature1"
  value={solutionData.feature1}
  onChange={handleSolutionChange}
/>

<input
  className="form-control mb-2"
  placeholder="Feature 2"
  name="feature2"
  value={solutionData.feature2}
  onChange={handleSolutionChange}
/>

<input
  className="form-control mb-2"
  placeholder="Feature 3"
  name="feature3"
  value={solutionData.feature3}
  onChange={handleSolutionChange}
/>

<input
  className="form-control mb-4"
  placeholder="Feature 4"
  name="feature4"
  value={solutionData.feature4}
  onChange={handleSolutionChange}
/>

<div className="mb-4">
  <label className="form-label fw-bold">
    Solution Image
  </label>

  <input
    type="file"
    accept="image/*"
    className="form-control"
    onChange={handleSolutionImage}
  />

  {solutionPreview && (
    <>
      <img
        src={solutionPreview}
        alt=""
        className="mt-3"
        style={{
          width: "250px",
          height: "180px",
          objectFit: "cover",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      />

      <button
        type="button"
        className="btn btn-danger btn-sm d-block mt-2"
        onClick={removeSolutionImage}
      >
        Remove Image
      </button>
    </>
  )}
</div>

<button
  className="btn btn-success"
  disabled={loading}
  onClick={handleSaveSolution}
>
  {loading ? "Saving..." : "Save Solution Section"}
</button>
    </div>
  );
};

export default ProblemSolutionManagement;