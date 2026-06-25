import React from "react";

const LocationManagement = ({
  locations,
  setLocations,
}) => {

  const addLocation = () => {
    setLocations([
      ...locations,
      {
        id: Date.now(),
        city: "",
      },
    ]);
  };

  const handleChange = (id, value) => {
    setLocations(
      locations.map((item) =>
        item.id === id
          ? { ...item, city: value }
          : item
      )
    );
  };

  const deleteLocation = (id) => {
    setLocations(
      locations.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h5>Service Locations</h5>

        <button
          className="btn btn-success"
          onClick={addLocation}
        >
          Add Location
        </button>
      </div>

      {locations.map((location) => (
        <div
          key={location.id}
          className="card mb-3"
        >
          <div className="card-body d-flex gap-2">
            <input
              className="form-control"
              value={location.city}
              onChange={(e) =>
                handleChange(
                  location.id,
                  e.target.value
                )
              }
            />

            <button
              className="btn btn-danger"
              onClick={() =>
                deleteLocation(location.id)
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationManagement;