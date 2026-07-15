import React, { useEffect, useState } from "react";

import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../../../services/testimonialService";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);

const [selectedTestimonial, setSelectedTestimonial] = useState(null);

const [showTestimonialModal, setShowTestimonialModal] = useState(false);

const [formData, setFormData] = useState({
  customerName: "",
  eventType: "Wedding",
  review: "",
  rating: 5,
  location: "",
  eventDate: "",
  isPublished: true,
});

const loadTestimonials = async () => {
  try {
    const res = await getTestimonials();

    if (res.data.success) {
      setTestimonials(res.data.data);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadTestimonials();
}, []);

console.log(testimonials);

const handleSaveTestimonial = async () => {
  try {
    const res = await createTestimonial(formData);

    if (res.data.success) {
      alert("Testimonial Added Successfully");

      loadTestimonials();

      setFormData({
        customerName: "",
        eventType: "Wedding",
        review: "",
        rating: 5,
        location: "",
        eventDate: "",
        isPublished: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteTestimonial = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this testimonial?"
  );

  if (!confirmDelete) return;

  try {
    const res = await deleteTestimonial(id);

    if (res.data.success) {
      alert("Testimonial Deleted Successfully");
      loadTestimonials();
    }
  } catch (error) {
    console.log(error);
  }
};


  return (
    <>
  
    <div className="d-flex justify-content-between align-items-center mb-3">

  <h5
    className="mb-0 fw-semibold"
    style={{
      fontSize: "20px",
      color: "#1F2937",
      marginTop:"15px"
    }}
  >
    Customer Testimonials
  </h5>

<button
  className="btn"
  onClick={() => {
    setSelectedTestimonial(null);

    setFormData({
      customerName: "",
      eventType: "Wedding",
      review: "",
      rating: 5,
      location: "",
      eventDate: "",
      isPublished: true,
    });

    setShowTestimonialModal(true);
  }}
  style={{
    background: "#0D9488",
    color: "#fff",
    borderRadius: "8px",
    padding: "8px 18px",
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "15px",
  }}
>
  Write Manual Entry
</button>

</div>

<div className="row g-3">

  {/* LEFT */}
  <div className="col-lg-7">

    {testimonials.map((item) => {
      const initials = item.customerName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

      return (
        <div
          key={item._id}
          className="card border-0 mb-3"
          style={{
            borderRadius: "12px",
            boxShadow: "0 1px 6px rgba(0,0,0,.08)",
          }}
        >
          <div
            className="card-body p-4"
            style={{
              minHeight: "170px",
            }}
            >

        <div className="d-flex justify-content-between">

          <div className="d-flex">

            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "#0D9488",
                color: "#fff",
                fontWeight: "600",
              }}
            >
              {initials}
            </div>

            <div className="ms-3">

              <h6 className="mb-1 fw-semibold"
              style={{
  fontSize: "20px",
}}>
                {item.customerName}
              </h6>
<div
  style={{
    color: "#6B7280",
    fontSize: "14px",
  }}
>
  {item.eventType}
  {item.location && ` • ${item.location}`}
  {item.eventDate &&
    ` • ${new Date(item.eventDate).toLocaleDateString()}`}
</div>

            </div>

          </div>

        <div
  className="d-flex gap-1"
  style={{
    minWidth: "110px",
    justifyContent: "flex-end",
  }}
>
  {[1, 2, 3, 4, 5].map((star) => (
    <i
      key={star}
      className={
        star <= item.rating
          ? "bi bi-star-fill"
          : "bi bi-star"
      }
      style={{
        color: "#F59E0B",
        fontSize: "14px",
      }}
    ></i>
    
  ))}
</div>

        </div>

     <p
  className="mt-3 mb-0"
  style={{
    color: "#374151",
    fontSize: "15px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    minHeight: "48px",
    wordBreak: "break-word",
  }}
>
  {item.review}
</p>

      </div>

    </div>

  

  
    );
  })}
  </div>


  {/* LEFT */}

 

  {/* RIGHT SIDE */}

<div className="col-lg-5 d-flex">

  <div
    className="card w-100 border-0"
    style={{
      borderRadius: "12px",
      boxShadow: "0 1px 6px rgba(0,0,0,.08)",
      minHeight: "330px",
    }}
  >
    <div className="card-body d-flex flex-column">

      {/* Header */}

      <div className="d-flex align-items-center mb-4">

        <i
          className="bi bi-plus-square"
          style={{
            color: "#0D9488",
            fontSize: "18px",
          }}
        ></i>

        <h6
          className="fw-semibold ms-2 mb-0"
          style={{
            fontSize: "18px",
          }}
        >
          Quick Add Testimonial
        </h6>

      </div>

      {/* Name + Event */}

      <div className="row">

        <div className="col-md-6 mb-2">

          <label
            className="fw-semibold mb-"
            style={{
              fontSize: "12px",
            }}
          >
            Customer Name
          </label>

        <input
  className="form-control"
  value={formData.customerName}
  onChange={(e) =>
    setFormData({
      ...formData,
      customerName: e.target.value,
    })
  }
            style={{
              height: "35px",
              background: "#F9FAFB",
              
            }}
          />

        </div>

        <div className="col-md-6 mb-3">

          <label
            className="fw-semibold mb-2"
            style={{
              fontSize: "12px",
            }}
          >
            Event Type
          </label>

          <select
  className="form-select"
  value={formData.eventType}
  onChange={(e) =>
    setFormData({
      ...formData,
      eventType: e.target.value,
    })
  }
>
  <option>Wedding</option>
  <option>Corporate</option>
  <option>Birthday</option>
  <option>Religious</option>
  <option>Engagement</option>
  <option>Reception</option>
</select>

        </div>

      </div>

      {/* Rating */}

      <div className="mb-3">

        <label
          className="fw-semibold mb-2"
          style={{
            fontSize: "12px",
          }}
        >
          Star Rating
        </label>

      <div className="d-flex gap-2 mb-3">
  {[1, 2, 3, 4, 5].map((star) => (
    <i
      key={star}
      className={
        star <= formData.rating
          ? "bi bi-star-fill"
          : "bi bi-star"
      }
      onClick={() =>
        setFormData({
          ...formData,
          rating: star,
        })
      }
      style={{
        color: "#F59E0B",
        fontSize: "22px",
        cursor: "pointer",
      }}
    ></i>
  ))}
</div>
<small className="text-muted">
  Rating: {formData.rating}/5
</small>

      </div>

      {/* Review */}

      <div className="mb-4">

        <label
          className="fw-semibold mb-2"
          style={{
            fontSize: "12px",
          }}
        >
          Review Text
        </label>

       <textarea
  className="form-control"
  rows={4}
  placeholder="e.g. Meena Gupta"
  value={formData.review}
  onChange={(e) =>
    setFormData({
      ...formData,
      review: e.target.value,
    })
  }
          style={{
            resize: "none",
            background: "#F9FAFB",
            wordBreak: "break-word",
overflowWrap: "anywhere",
          }}
        />

      </div>

      {/* Button */}

      <div className="mt-auto">

        <button
          className="btn w-100"
            onClick={handleSaveTestimonial}

          style={{
            background: "#0D9488",
            color: "#fff",
            height: "42px",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          <i className="bi bi-floppy me-2"></i>
          Save & Review
        </button>

      </div>

    </div>
  </div>

</div>


     </div>
     {showTestimonialModal && (
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
        width: "760px",
        borderRadius: "12px",
        padding: "25px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-semibold mb-0">
          Write Manual Testimonial
        </h5>

        <button
          className="btn btn-sm"
          onClick={() => setShowTestimonialModal(false)}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="row">

        <div className="col-md-6 mb-3">
          <label className="fw-semibold mb-2">
            Customer Name
          </label>

          <input
            className="form-control"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({
                ...formData,
                customerName: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="fw-semibold mb-2">
            Event Type
          </label>

          <select
            className="form-select"
            value={formData.eventType}
            onChange={(e) =>
              setFormData({
                ...formData,
                eventType: e.target.value,
              })
            }
          >
            <option>Wedding</option>
            <option>Corporate</option>
            <option>Birthday</option>
            <option>Religious</option>
            <option>Engagement</option>
            <option>Reception</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="fw-semibold mb-2">
            Event Location
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

        <div className="col-md-6 mb-3">
          <label className="fw-semibold mb-2">
            Event Date
          </label>

          <input
            type="date"
            className="form-control"
            value={formData.eventDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                eventDate: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="fw-semibold mb-2">
            Status
          </label>

          <select
            className="form-select"
            value={formData.isPublished ? "Published" : "Draft"}
            onChange={(e) =>
              setFormData({
                ...formData,
                isPublished: e.target.value === "Published",
              })
            }
          >
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="fw-semibold mb-2">
            Rating
          </label>

          <div className="d-flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={
                  star <= formData.rating
                    ? "bi bi-star-fill"
                    : "bi bi-star"
                }
                onClick={() =>
                  setFormData({
                    ...formData,
                    rating: star,
                  })
                }
                style={{
                  color: "#F59E0B",
                  cursor: "pointer",
                  fontSize: "22px",
                }}
              ></i>
            ))}
          </div>
        </div>

        <div className="col-12">
          <label className="fw-semibold mb-2">
            Review
          </label>

          <textarea
            rows="5"
            className="form-control"
            value={formData.review}
            onChange={(e) =>
              setFormData({
                ...formData,
                review: e.target.value,
              })
            }
          />
        </div>

      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">

        <button
          className="btn btn-light"
          onClick={() => setShowTestimonialModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn"
          onClick={async () => {
            await handleSaveTestimonial();
            setShowTestimonialModal(false);
          }}
          style={{
            background: "#0D9488",
            color: "#fff",
          }}
        >
          Save Testimonial
        </button>

      </div>

    </div>
  </div>
)}
  </>

  );
};

export default TestimonialSection;