import React, { useEffect, useState } from "react";
import {
  getCmsSection,
  updateCmsSection,
} from "../../../services/cmsService";

const iconOptions = [
  { label: "Journal", value: "bi bi-journal-text" },
  { label: "Chat", value: "bi bi-chat-dots" },
  { label: "File Plus", value: "bi bi-file-earmark-plus" },
  { label: "Calendar Check", value: "bi bi-calendar-check" },
  { label: "Credit Card", value: "bi bi-credit-card" },
  { label: "Receipt", value: "bi bi-receipt" },
  { label: "Dashboard", value: "bi bi-speedometer2" },
  { label: "Settings", value: "bi bi-gear" },
  { label: "Content", value: "bi bi-pencil-square" },
  { label: "Calendar", value: "bi bi-calendar2-check" },
  { label: "Bell", value: "bi bi-bell" },
  { label: "People", value: "bi bi-people" },
];

const CoreFeatureManagement = () => {
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
      icon: "bi bi-journal-text",
    },
  ]);

  useEffect(() => {
    fetchCoreFeatures();
  }, []);

  const fetchCoreFeatures = async () => {
    try {
      const res = await getCmsSection("core-features");

      if (res.data?.data?.content) {
        const content = res.data.data.content;

        setFormData({
          badge: content.badge || "",
          title: content.title || "",
          description: content.description || "",
        });

        let parsedCards = [];

        if (Array.isArray(content.cards)) {
          parsedCards = content.cards;
        } else if (typeof content.cards === "string") {
          try {
            parsedCards = JSON.parse(content.cards);
          } catch (error) {
            parsedCards = [];
          }
        }

        setCards(
          parsedCards.length
            ? parsedCards
            : [
                {
                  title: "",
                  description: "",
                  icon: "bi bi-journal-text",
                },
              ]
        );
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
        icon: "bi bi-journal-text",
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

      await updateCmsSection("core-features", data);

      alert("Core Features updated successfully.");

      fetchCoreFeatures();
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4">Core Features Management</h4>

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
            {cards.map((card, index) => (
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
            {/* Icon */}
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

            {/* Title */}
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

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>

              <textarea
                rows="3"
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

export default CoreFeatureManagement;