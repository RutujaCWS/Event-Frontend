import React, { useEffect, useState,useRef } from "react";
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from "../../../../services/bannerService";

const BannerSection = () => {
const [showAddBannerModal, setShowAddBannerModal] = useState(false);
const [selectedBanner, setSelectedBanner] = useState(null);
const [banners, setBanners] = useState([]);
const fileInputRef = useRef(null);
const [addBannerData, setAddBannerData] = useState({
  title: "",
  subtitle: "",
  ctaLabel: "",
  ctaLink: "",
  slot: "Main Hero",
  status: "Draft",
  displayOrder: 1,
  bannerImage: null,
});
const [formData, setFormData] = useState({
  title: "",
  subtitle: "",
  ctaLabel: "",
  ctaLink: "",
  bannerImage: null,
});

const [preview, setPreview] = useState("");
const [addPreview, setAddPreview] = useState("");



const loadBanners = async () => {
  try {
    const res = await getAllBanners();

    if (res.data.success) {
      setBanners(res.data.data);
    }
  } catch (error) {
    console.log(error);
  }
};
const handleAddBanner = async () => {
  try {
    const data = new FormData();

    data.append("title", addBannerData.title);
    data.append("subtitle", addBannerData.subtitle);
    data.append("ctaLabel", addBannerData.ctaLabel);
    data.append("ctaLink", addBannerData.ctaLink);
    data.append("slot", addBannerData.slot);
    data.append("status", addBannerData.status);
    data.append("displayOrder", addBannerData.displayOrder);

    if (addBannerData.bannerImage) {
      data.append("bannerImage", addBannerData.bannerImage);
    }
console.log(addBannerData);

    const res = await createBanner(data);

    if (res.data.success) {
      alert("Banner Added Successfully");

setAddBannerData({
  title: "",
  subtitle: "",
  ctaLabel: "",
  ctaLink: "",
  slot: "",
  status: "",
  displayOrder: "",
  bannerImage: null,
});

setAddPreview("");

setShowAddBannerModal(false);

loadBanners();
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





useEffect(() => {
  loadBanners();
}, []);

const handleImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setFormData({
    ...formData,
    bannerImage: file,
  });

  setPreview(URL.createObjectURL(file));
};
const handleAddImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setAddBannerData({
    ...addBannerData,
    bannerImage: file,
  });

  setAddPreview(URL.createObjectURL(file));
};

const handleEdit = (banner) => {
  setSelectedBanner(banner);

  setFormData({
    title: banner.title,
    subtitle: banner.subtitle,
    ctaLabel: banner.ctaLabel,
    ctaLink: banner.ctaLink,
    bannerImage: null,
  });

  setPreview(banner.bannerImage);
};

const handleUpdateBanner = async () => {
  try {
    if (!selectedBanner) {
      alert("Please select a banner to edit.");
      return;
    }

    const data = new FormData();

    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("ctaLabel", formData.ctaLabel);
    data.append("ctaLink", formData.ctaLink);

    if (formData.bannerImage) {
      data.append("bannerImage", formData.bannerImage);
    }

    const res = await updateBanner(selectedBanner._id, data);

    if (res.data.success) {
      alert("Banner Updated Successfully");

      loadBanners();

      setSelectedBanner(null);

      setFormData({
        title: "",
        subtitle: "",
        ctaLabel: "",
        ctaLink: "",
        bannerImage: null,
      });

      setPreview("");
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteBanner = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this banner?"
  );

  if (!confirmDelete) return;

  try {
    const res = await deleteBanner(id);

    if (res.data.success) {
      alert("Banner Deleted Successfully");

      loadBanners();

      if (selectedBanner?._id === id) {
        setSelectedBanner(null);

        setFormData({
          title: "",
          subtitle: "",
          ctaLabel: "",
          ctaLink: "",
          bannerImage: null,
        });

        setPreview("");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const handleToggleStatus = async (banner) => {
  try {
    const res = await toggleBannerStatus(banner._id);

    if (res.data.success) {
      loadBanners();

      if (selectedBanner?._id === banner._id) {
        setSelectedBanner(res.data.data);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
  return (
    <>
    
  <div className="d-flex justify-content-between align-items-center mt-2">
  <h5 className="fw-semibold mb-0" >
    Home Page Banners
  </h5>

  <button
  className="btn mt-2"
  onClick={() => setShowAddBannerModal(true)}
  style={{
    background: "#0D9488",
    color: "#fff",
    borderRadius: "8px",
    padding: "8px 18px",
  }}
>
  Add Banner
</button>
</div>
<div className="row mt-2 g-4">

   
    <div className="col-lg-7">
 <div
  className="card border-0"
  style={{
    borderRadius: "10px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  }}
>
  <div className="card-body p-4">

    {/* Header */}

    <div className="d-flex align-items-center mb-4">
      <i
        className="bi bi-pencil"
        style={{
          color: "#2563EB",
          fontSize: "18px",
        }}
      ></i>

      <h6
        className="mb-1 ms-2 fw-semibold"
        style={{
          fontSize: "18px",
        }}
      >
        Edit Banner Details
      </h6>
    </div>

    {/* Banner Title */}

    <div className="mb-2">
      <label
        className="fw-semibold mb-2"
        style={{
          fontSize: "14px",
        }}
      >
        Banner Title
      </label>

        <input
        className="form-control"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Wedding Season 2026"
        style={{
          height: "40px",
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
          background: "#F9FAFB",
        }}
      />
    </div>

    {/* Subtitle */}

    <div className="mb-2">
      <label
        className="fw-semibold mb-2"
        style={{
          fontSize: "14px",
        }}
      >
        Subtitle / Tagline
      </label>

      <input
        className="form-control"
        name="subtitle"
        value={formData.subtitle}
        onChange={handleChange}
        placeholder="Create memories that last a lifetime"
        style={{
          height: "40px",
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
          background: "#F9FAFB",
        }}
      />
    </div>

    <div className="row">

      <div className="col-md-6">

        <label className="fw-semibold mb-2">
          CTA Label
        </label>

              <input
          className="form-control"
          name="ctaLabel"
          value={formData.ctaLabel}
          onChange={handleChange}
          placeholder="Book Now"
          style={{
            height: "40px",
            borderRadius: "8px",
            background: "#F9FAFB",
          }}
        />

      </div>

      <div className="col-md-6">

        <label className="fw-semibold mb-2">
          CTA Link
        </label>

              <input
          className="form-control"
          name="ctaLink"
          value={formData.ctaLink}
          onChange={handleChange}
          placeholder="/wedding"
          style={{
            height: "40px",
            borderRadius: "8px",
            background: "#F9FAFB",
          }}
        />

      </div>

    </div>

    {/* Upload */}

    <div className="mt-4">

     <div
  onClick={() => fileInputRef.current.click()}
  className="d-flex flex-column justify-content-center align-items-center"
  style={{
    height: "112px",
    border: "2px dashed #D1D5DB",
    borderRadius: "10px",
    background: "#F9FAFB",
    cursor: "pointer",
  }}
>

     {preview ? (
  <img
    src={preview}
    alt="Banner"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "10px",
    }}
  />
) : (
  <>
    <i
      className="bi bi-cloud-upload"
      style={{
        fontSize: "40px",
        color: "#6B7280",
      }}
    ></i>

    <div className="fw-semibold mt-2">
      Upload Banner Image
    </div>

    <small className="text-muted">
      PNG / JPG (1920 × 800)
    </small>
  </>
)}

     <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  className="d-none"
  onChange={handleImage}
/>

      </div>

    </div>

    {/* Buttons */}

    <div className="row mt-3">

      <div className="col">

     <button
  className="btn w-100"
  onClick={handleUpdateBanner}
  style={{
    height: "40px",
    background: "#0D9488",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
  }}
>
  Save Changes
</button>

      </div>

      <div className="col-auto">

        <button
          className="btn"
          style={{
            height: "40px",
            width: "90px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
</div>
    </div>

    {/* Right Side */}
    <div className="col-lg-5">
 <div
  className="card border-0"
  style={{
    borderRadius: "10px",
    boxShadow: "0 1px 6px rgba(0,0,0,.08)",
  }}
>
  <div className="card-body p-3">
{/* Header */}

<div className="d-flex justify-content-between align-items-center mb-3">

  <div className="d-flex align-items-center">

    <i
      className="bi bi-layout-text-window"
      style={{
        color: "#0D9488",
        fontSize: "18px",
      }}
    ></i>

    <h6
      className="mb-0 ms-2 fw-semibold"
      style={{
        fontSize: "17px",
      }}
    >
      Active Slots
    </h6>

  </div>

  <small
    style={{
      color: "#9CA3AF",
      fontSize: "13px",
    }}
  >
    {banners.length} slots occupied
  </small>

</div>
  {banners.map((banner) => (
    
  <div
    key={banner._id}
    className="mb-3"
    style={{
      border: "1px solid #E5E7EB",
      borderRadius: "10px",
      overflow: "hidden",
    }}
  >
    {/* Top Preview */}
    <div
      style={{
        height: "142px",
        overflow: "hidden",
        background: banner.slot === "Main Hero" ? "#ECFDFC" : "#EEF4FF",
      }}
    >
      {banner.bannerImage ? (
        <img
          src={banner.bannerImage}
          alt={banner.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          className="d-flex flex-column justify-content-center align-items-center h-100"
        >
          <h5
            className="fw-semibold mb-1"
            style={{
              color:
                banner.slot === "Main Hero"
                  ? "#0D9488"
                  : "#3559E0",
            }}
          >
            {banner.title}
          </h5>

          <div
            style={{
              color: "#7C8A96",
              fontSize: "15px",
            }}
          >
            {banner.slot}
          </div>
        </div>
      )}
    </div>

    {/* Bottom */}
    <div className="p-3">

      <div className="d-flex justify-content-between">

        <div>

          <div
            className="fw-semibold"
            style={{
              fontSize: "16px",
            }}
          >
            {banner.title}
          </div>

          <div
            style={{
              color: "#6B7280",
            }}
          >
            Link : {banner.ctaLink}
          </div>

        </div>

        <div className="d-flex align-items-center gap-2">
<a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    handleEdit(banner);
  }}
  className="text-decoration-none fw-semibold ms-3"
  style={{
    color: "#0D9488",
    cursor: "pointer",
  }}
>
  Edit <i className="bi bi-chevron-right"></i>
</a>
<a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    handleDeleteBanner(banner._id);
  }}
  className="text-decoration-none ms-3"
  style={{
    color: "#EF4444",
    cursor: "pointer",
  }}
>
  <i className="bi bi-trash"></i>
</a>
          <span
            style={{
              color:
                banner.status === "Live"
                  ? "#10B981"
                  : "#6B7280",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
           {banner.isActive ? "LIVE" : "DRAFT"}
          </span>

          <div className="form-check form-switch m-0">
           <input
  className="form-check-input"
  type="checkbox"
  checked={banner.isActive}
  onChange={() => handleToggleStatus(banner)}
  style={{
    width: "45px",
    height: "24px",
  }}
/>
          </div>

        </div>

      </div>

    </div>
  </div>
))}

  </div>
</div>
    </div>
{showAddBannerModal && (
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
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-semibold mb-0">
          Add New Banner
        </h5>

        <button
          className="btn btn-sm"
          onClick={() => setShowAddBannerModal(false)}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      {/* Banner Title */}
      <div className="mb-3">
        <label className="fw-semibold mb-2">
          Banner Title
        </label>

      <input
  className="form-control"
  value={addBannerData.title}
  onChange={(e) =>
    setAddBannerData({
      ...addBannerData,
      title: e.target.value,
    })
  }
  placeholder="Wedding Season 2026"
/>
      </div>

      {/* Subtitle */}
      <div className="mb-3">
        <label className="fw-semibold mb-2">
          Subtitle
        </label>

        <textarea
  rows="3"
  className="form-control"
  value={addBannerData.subtitle}
  onChange={(e) =>
    setAddBannerData({
      ...addBannerData,
      subtitle: e.target.value,
    })
  }
  placeholder="Create memories that last a lifetime"
/>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="fw-semibold mb-2">
            CTA Label
          </label>

         <input
  className="form-control"
  value={addBannerData.ctaLabel}
  onChange={(e) =>
    setAddBannerData({
      ...addBannerData,
      ctaLabel: e.target.value,
    })
  }
  placeholder="Book Now"
/>
        </div>

        <div className="col-md-6 mb-3">
          <label className="fw-semibold mb-2">
            CTA Link
          </label>

        <input
  className="form-control"
  value={addBannerData.ctaLink}
  onChange={(e) =>
    setAddBannerData({
      ...addBannerData,
      ctaLink: e.target.value,
    })
  }
/>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="fw-semibold mb-2">
            Banner Slot
          </label>

        <select
  className="form-select"
  value={addBannerData.slot}
  onChange={(e) =>
    setAddBannerData({
      ...addBannerData,
      slot: e.target.value,
    })
  }
>
  <option value="Main Hero">Main Hero</option>
  <option value="Secondary">Secondary</option>
  <option value="Third">Third Banner</option>
</select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="fw-semibold mb-2">
            Status
          </label>

        <select
  className="form-select"
  value={addBannerData.status}
  onChange={(e) =>
    setAddBannerData({
      ...addBannerData,
      status: e.target.value,
    })
  }
>
  <option value="Live">Live</option>
  <option value="Draft">Draft</option>
</select>
        </div>
      </div>

      {/* Upload */}
      <div className="mb-4">
        <label className="fw-semibold mb-2">
          Banner Image
        </label>

<div
  onClick={() => fileInputRef.current.click()}
  className="d-flex flex-column justify-content-center align-items-center"
  style={{
    height: "170px",
    border: "2px dashed #D1D5DB",
    borderRadius: "10px",
    background: "#F9FAFB",
    cursor: "pointer",
  }}
>
  {addPreview ? (
    <img
      src={addPreview}
      alt="Banner"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "10px",
      }}
    />
  ) : (
    <>
      <i className="bi bi-cloud-upload fs-1"></i>
      <div>Upload Banner Image</div>
      <small>PNG / JPG</small>
    </>
  )}

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    className="d-none"
    onChange={handleAddImage}
  />
</div>
      </div>

      {/* Footer */}
      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-light"
          onClick={() => setShowAddBannerModal(false)}
        >
          Cancel
        </button>

       <button
  className="btn"
  onClick={handleAddBanner}
  style={{
    background: "#0D9488",
    color: "#fff",
  }}
>
  Save Banner
</button>
      </div>
    </div>
  </div>
)}
</div>

    </>
  );
};

export default BannerSection;