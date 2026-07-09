import React, { useEffect, useState } from "react";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../services/cmsService";
const iconOptions = [
  { label: "Calendar", value: "bi-calendar2-check" },
  { label: "Check Badge", value: "bi-patch-check" },
  { label: "Dollar", value: "bi-currency-dollar" },
  { label: "Calendar Week", value: "bi-calendar-week" },
  { label: "Bell", value: "bi-bell" },
  { label: "Reports", value: "bi-bar-chart-line" },
  { label: "People", value: "bi-people" },
  { label: "Gift", value: "bi-gift" },
  { label: "Heart", value: "bi-heart-fill" },
  { label: "Camera", value: "bi-camera" },
  { label: "Music", value: "bi-music-note-beamed" },
  { label: "Star", value: "bi-star-fill" },
];

const CustomizationManagement = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
  badge: "",
  title: "",
  description: "",
});

const [cards, setCards] = useState([
  {
    title: "",
    description: "",
    icon: "bi-calendar2-check",
  },
]);

  useEffect(() => {
    fetchCustomization();
  }, []);

 const fetchCustomization = async () => {
  try {
    const res = await getCmsSection("customization");

    if (res.data?.data?.content) {
      const content = res.data.data.content;

      setFormData({
        badge: content.badge || "",
        title: content.title || "",
        description: content.description || "",
      });

      //console.log("CMS Content:", content);
      //console.log("Cards:", content.cards);
      //console.log("Is Array:", Array.isArray(content.cards));

      let parsedCards = [];

if (Array.isArray(content.cards)) {
  parsedCards = content.cards;
} else if (typeof content.cards === "string") {
  try {
    parsedCards = JSON.parse(content.cards);
  } catch (error) {
    console.error("Invalid cards JSON:", error);
    parsedCards = [];
  }
}

setCards(parsedCards);
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

  const handleCardChange = (index, field, value) => {
  const updated = [...cards];
  updated[index][field] = value;
  setCards(updated);
};

const addCard = () => {
  setCards([
    ...cards,
    {
      title: "",
      description: "",
      icon: "bi-calendar2-check",
    },
  ]);
};

const removeCard = (index) => {
  setCards(cards.filter((_, i) => i !== index));
};

  const handleSave = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      data.append("badge", formData.badge);
    data.append("title", formData.title);
    data.append("description", formData.description);

    data.append("cards", JSON.stringify(cards));

      await updateCmsSection("customization", data);

      alert("Customization section updated successfully.");

      fetchCustomization();
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4">Customization Section Management</h4>

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

      <div className="mb-4">
        <label className="form-label fw-bold">Description</label>
        <textarea
          rows="4"
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {Array.isArray(cards) &&
  cards.map((card, index) => (
  <div className="card shadow-sm mb-4" key={index}>
    <div className="card-header d-flex justify-content-between align-items-center">
      <strong>Card {index + 1}</strong>

      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={() => removeCard(index)}
      >
        Remove
      </button>
    </div>

    <div className="card-body">

      <div className="mb-3">
        <label className="form-label">Icon</label>

        <select
          className="form-select"
          value={card.icon}
          onChange={(e) =>
            handleCardChange(index, "icon", e.target.value)
          }
        >
          {iconOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Title</label>

        <input
          className="form-control"
          value={card.title}
          onChange={(e) =>
            handleCardChange(index, "title", e.target.value)
          }
        />
      </div>

      <div>
        <label className="form-label">Description</label>

        <textarea
          rows="2"
          className="form-control"
          value={card.description}
          onChange={(e) =>
            handleCardChange(index, "description", e.target.value)
          }
        />
      </div>

    </div>
  </div>
))}

        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            type="button"
            className="btn btn-success"
            onClick={addCard}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Card
          </button>

          <button
            type="button"
            className="btn btn-primary"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
    </div>
  );
};

export default CustomizationManagement;