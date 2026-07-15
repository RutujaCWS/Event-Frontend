import React, { useEffect, useState, useRef } from "react";

import {
  getGalleryEvents,
  createGalleryEvent,
  updateGalleryEvent,
  deleteGalleryEvent,
} from "../../../../services/galleryService";

const GallerySection = () => {

    const [gallery, setGallery] = useState([]);

const [selectedGallery, setSelectedGallery] = useState(null);

const [showGalleryModal, setShowGalleryModal] = useState(false);

const fileInputRef = useRef(null);

const [preview, setPreview] = useState("");
const [showManageGallery, setShowManageGallery] = useState(false);
const [selectedCategory, setSelectedCategory] = useState("All");
const [formData, setFormData] = useState({
  eventName: "",
  category: "",
  location: "",
  description: "",
  image: null,
});
const filteredGallery =
  selectedCategory === "All"
    ? gallery
    : gallery.filter(
        (item) => item.category === selectedCategory
      );
const loadGallery = async () => {
  try {
    const res = await getGalleryEvents();
 console.log("Gallery API:", res.data);
    if (res.data.success) {
      setGallery(res.data.data);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadGallery();
}, []);

const handleImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setFormData({
    ...formData,
    image: file,
  });

  setPreview(URL.createObjectURL(file));
};

const handleSaveGallery = async () => {
  try {
    const data = new FormData();

    data.append("eventName", formData.eventName);
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("description", formData.description);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const res = await createGalleryEvent(data);

    if (res.data.success) {
      alert("Gallery Added Successfully");

      loadGallery();

      setShowGalleryModal(false);

      setPreview("");

      setFormData({
        eventName: "",
        category: "",
        location: "",
        description: "",
        image: null,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const categoryCount = gallery.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});

const handleEditGallery = (item) => {
  setSelectedGallery(item);

  setFormData({
    eventName: item.eventName,
    category: item.category,
    location: item.location,
    description: item.description,
    image: null,
  });

  setPreview(item.image);

  setShowManageGallery(false);

  // Open Edit Modal
  setShowGalleryModal(true);
};

const handleUpdateGallery = async () => {
  try {
    const data = new FormData();

    data.append("eventName", formData.eventName);
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("description", formData.description);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const res = await updateGalleryEvent(
      selectedGallery._id,
      data
    );

    if (res.data.success) {
      alert("Gallery Updated Successfully");

      loadGallery();

      setShowGalleryModal(false);

      setSelectedGallery(null);

      setPreview("");

      setFormData({
        eventName: "",
        category: "",
        location: "",
        description: "",
        image: null,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteGallery = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this gallery image?"
  );

  if (!confirmDelete) return;

  try {
    const res = await deleteGalleryEvent(id);

    if (res.data.success) {
      alert("Gallery Deleted Successfully");
if (selectedGallery?._id === id) {
  setSelectedGallery(null);

  setShowGalleryModal(false);

  setPreview("");

  setFormData({
    eventName: "",
    category: "",
    location: "",
    description: "",
    image: null,
  });
}
      loadGallery();
    }
  } catch (error) {
    console.log(error);
  }
};
  return (
    <>
  
<div className="d-flex justify-content-between align-items-center mb-3 mt-3">

    <div>
        <h5
            className="fw-semibold mb-0"
            style={{
                fontSize: "20px",
                color: "#111827",
            }}
        >
            Gallery Upload
        </h5>
    </div>

<div className="dropdown">

  <button
    className="btn dropdown-toggle"
    type="button"
    data-bs-toggle="dropdown"
    style={{
      background: "#0D9488",
      color: "#fff",
      borderRadius: "8px",
      padding: "8px 18px",
      fontSize: "16px",
      fontWeight: "500",
      border: "none",
    }}
  >
    {selectedCategory === "All"
      ? "All Categories"
      : selectedCategory}
  </button>

  <ul className="dropdown-menu">

    <li>
      <button
        className="dropdown-item"
        onClick={() => setSelectedCategory("All")}
      >
        All Categories
      </button>
    </li>

    {Object.keys(categoryCount).map((category) => (
      <li key={category}>
        <button
          className="dropdown-item"
          onClick={() =>
            setSelectedCategory(category)
          }
        >
          {category}
        </button>
      </li>
    ))}

  </ul>

</div>

</div>
<div className="row g-3 align-items-stretch">

    <div className="col-lg-7 d-flex">
        <div
            className="card w-100"
            style={{
                minHeight: "400px",
                height: "400px",
                borderRadius: "12px",
            }}
        >
          <div className="card-body">

<div className="d-flex justify-content-between align-items-center mb-3">


</div>

<div className="row g-2 align-items-start">

{filteredGallery.map((item) => (
 <div className="col-lg-3 col-md-3 col-6" key={item._id}>
    <div
      className="border rounded-3"
      style={{
        height: "92px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <span
        className="badge bg-dark position-absolute top-0 start-0 m-2"
        style={{
          fontSize: "9px",
        }}
      >
        {item.category}
      </span>

      <img
        src={item.image}
        alt={item.eventName}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      
    </div>
  </div>
))}
 <div className="col-lg-3 col-md-3 col-6">
  <div
    className="border rounded-3 d-flex justify-content-center align-items-center"
    style={{
      height: "92px",
      background: "#F8FAFC",
      cursor: "pointer",
    }}
  >
    <div className="text-center">
      <i className="bi bi-camera fs-3 text-secondary"></i>

      <div
        style={{
          fontSize: "11px",
        }}
      >
        ADD NEW
      </div>
    </div>
  </div>
</div>
</div>

<hr/>

<div className="row text-center">

<div className="col">

<h3 className=""
style={{

  fontSize:"20px"
}}>
{gallery.length}
</h3>

<div className="text-muted"
style={{

  fontSize:"14px"
}}>
Total Assets
</div>

</div>

<div className="col">

<h3 className=""
style={{

  fontSize:"20px"
}}>
2.4GB
</h3>

<div className="text-muted"
style={{

  fontSize:"14px"
}}>
Space Used
</div>

</div>

<div className="col d-flex align-items-center justify-content-center">

<a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    setShowManageGallery(true);
  }}
  className="text-decoration-none fw-semibold"
  style={{
    color:"#0D9488"
  }}
>
  Manage All Files
</a>

</div>

</div>

</div> 
        </div>
    </div>

    <div className="col-lg-5 d-flex">
        <div
            className="card w-100"
            style={{
                minHeight: "400px",
                height: "400px",
                borderRadius: "12px",
            }}
        >
          <div className="card-body d-flex flex-column">

<div
className="border border-2 border-dashed rounded-3 d-flex flex-column justify-content-center align-items-center"
style={{
height:"210px",
background:"#F2FEFD",
borderColor:"#C7ECE8"
}}
>

<div
className="rounded-3 d-flex justify-content-center align-items-center mb-3"
style={{
width:"60px",
height:"60px",
background:"#DDF7F4"
}}
>

<i
className="bi bi-file-earmark-arrow-up fs-2"
style={{
color:"#0D9488"
}}
></i>

</div>

<h4
className="fw-semibold"
>
Drag & Drop Photos
</h4>

<p
className="text-muted mb-4"
>
Up to 10 files at once (Max 5MB each)
</p>

<button
  className="btn px-4"
  style={{
    background:"#0D9488",
    color:"#fff"
  }}
  onClick={() => setShowGalleryModal(true)}
>
  Browse Files
</button>

</div>

<div className="mt-4">

<h5 className="fw-semibold mb-3">
Category Breakdown
</h5>

{Object.entries(categoryCount).map(([category, count], index) => {
  const colors = [
    "#0D9488",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  return (
    <div
      key={category}
      className="d-flex justify-content-between mb-3"
    >
      <div>
        <span
          className="badge rounded-circle me-2"
          style={{
            background: colors[index % colors.length],
            width: "10px",
            height: "10px",
          }}
        ></span>

        {category}
      </div>

      <small>{count} assets</small>
    </div>
  );
})}

</div>

</div>

        </div>
        
    </div>

</div>
{showGalleryModal && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background: "rgba(0,0,0,.45)",
      zIndex: 1055,
    }}
  >
    <div
      className="bg-white"
      style={{
        width: "700px",
        borderRadius: "12px",
        padding: "25px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-semibold mb-0">
        {selectedGallery
  ? "Edit Gallery"
  : "Add Gallery Image"}
        </h5>

        <button
          className="btn btn-sm"
          onClick={() => setShowGalleryModal(false)}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="mb-3">
        <label className="fw-semibold mb-2">
          Event Name
        </label>

        <input
          className="form-control"
          value={formData.eventName}
          onChange={(e) =>
            setFormData({
              ...formData,
              eventName: e.target.value,
            })
          }
        />
      </div>

      <div className="row">

        <div className="col-md-6 mb-3">

          <label className="fw-semibold mb-2">
            Category
          </label>

          <select
            className="form-select"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
          >
            <option value="">Select Category</option>
            <option>Wedding</option>
            <option>Corporate</option>
            <option>Birthday</option>
            <option>Religious</option>
          </select>

        </div>

        <div className="col-md-6 mb-3">

          <label className="fw-semibold mb-2">
            Location
          </label>

          <input
            className="form-control"
            value={formData.location}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: e.target.value,
              })
            }
          />

        </div>

      </div>

      <div className="mb-3">

        <label className="fw-semibold mb-2">
          Description
        </label>

        <textarea
          rows="3"
          className="form-control"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />

      </div>

      <div
        onClick={() => fileInputRef.current.click()}
        className="border border-2 border-dashed rounded-3 d-flex flex-column justify-content-center align-items-center"
        style={{
          height: "180px",
          cursor: "pointer",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <>
            <i className="bi bi-cloud-upload fs-1"></i>
            <div>Upload Image</div>
          </>
        )}

      <input
  ref={fileInputRef}
  type="file"
  className="d-none"
  accept="image/*"
  onChange={handleImage}
/>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">

        <button
          className="btn btn-light"
          onClick={() => setShowGalleryModal(false)}
        >
          Cancel
        </button>

       <button
  className="btn"
onClick={
  selectedGallery
    ? handleUpdateGallery
    : handleSaveGallery
}
  style={{
    background: "#0D9488",
    color: "#fff",
  }}
>
  {selectedGallery ? "Update" : "Save"}
</button>

      </div>

    </div>
  </div>
)}

{showManageGallery && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background: "rgba(0,0,0,.45)",
      zIndex: 1060,
    }}
  >
    <div
      className="bg-white"
      style={{
        width: "1000px",
        borderRadius: "12px",
        padding: "20px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-semibold mb-0">
          Manage Gallery
        </h5>

        <button
          className="btn btn-sm"
          onClick={() => setShowManageGallery(false)}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <table className="table align-middle">
        <thead>
          <tr>
            <th>Image</th>
            <th>Event</th>
            <th>Category</th>
            <th>Location</th>
            <th width="120">Actions</th>
          </tr>
        </thead>

        <tbody>

          {gallery.map((item) => (

            <tr key={item._id}>

              <td>
                <img
                  src={item.image}
                  alt=""
                  style={{
                    width: "80px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              </td>

              <td>{item.eventName}</td>

              <td>{item.category}</td>

              <td>{item.location}</td>

              <td>

                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleEditGallery(item)}
                >
                  <i className="bi bi-pencil"></i>
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteGallery(item._id)}
                >
                  <i className="bi bi-trash"></i>
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  </div>
)}
  </>

    
  );
};

export default GallerySection;