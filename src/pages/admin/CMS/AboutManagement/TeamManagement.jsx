import React from "react";

const TeamManagement = ({
  members,
  setMembers,
}) => {
  const addMember = () => {
    setMembers([
      ...members,
      {
        id: Date.now(),
        name: "",
        role: "",
      },
    ]);
  };

  const handleChange = (id, field, value) => {
    setMembers(
      members.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const deleteMember = (id) => {
    setMembers(
      members.filter((item) => item.id !== id)
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h5>Team Members</h5>

        <button
          className="btn btn-success"
          onClick={addMember}
        >
          Add Member
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <input
                  className="form-control"
                  value={member.name}
                  onChange={(e) =>
                    handleChange(
                      member.id,
                      "name",
                      e.target.value
                    )
                  }
                />
              </td>

              <td>
                <input
                  className="form-control"
                  value={member.role}
                  onChange={(e) =>
                    handleChange(
                      member.id,
                      "role",
                      e.target.value
                    )
                  }
                />
              </td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    deleteMember(member.id)
                  }
                >
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

export default TeamManagement;