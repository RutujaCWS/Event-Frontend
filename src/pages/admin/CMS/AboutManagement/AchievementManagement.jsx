import React, { useState } from "react";

const AchievementManagement = () => {
  const [achievements, setAchievements] =
    useState([]);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h5>Achievements</h5>

        <button className="btn btn-success">
          Add Achievement
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {achievements.map((item) => (
            <tr key={item.id}>
              <td>{item.icon}</td>
              <td>{item.title}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2">
                  Edit
                </button>

                <button className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AchievementManagement;